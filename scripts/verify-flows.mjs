import { createClient } from "@libsql/client";
import crypto from "crypto";

const db = createClient({ url: process.env.TURSO_DATABASE_URL ?? "file:local.db" });

const RETURN_WINDOW_DAYS = 30;
const ACCEPTABLE_CONDITIONS = ["New, unused, original packaging", "Opened but unused"];

function daysBetween(isoA, isoB) {
  const a = new Date(isoA);
  const b = new Date(isoB);
  return Math.round(Math.abs((a - b) / (1000 * 60 * 60 * 24)));
}

async function getOrder(orderId) {
  const r = await db.execute({ sql: `SELECT * FROM orders WHERE order_id = ?`, args: [orderId] });
  const rows = r.rows || [];
  if (rows.length === 0) return null;
  const order = rows[0];
  const itemsRes = await db.execute({ sql: `SELECT * FROM order_items WHERE order_id = ?`, args: [orderId] });
  order.items = itemsRes.rows || [];
  return order;
}

async function ensureReturnsTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS returns (
      return_id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      item_id TEXT NOT NULL,
      reason TEXT NOT NULL,
      condition TEXT NOT NULL,
      status TEXT NOT NULL,
      eligible INTEGER NOT NULL DEFAULT 0,
      requested_at TEXT NOT NULL
    );
  `);
}

async function checkReturnEligibility({ order_id, item_id, reason, condition }) {
  const order = await getOrder(order_id);
  if (!order) return { eligible: false, reason: `We couldn't find an order matching "${order_id}".` };
  const item = order.items.find((it) => it.item_id === item_id);
  if (!item) return { eligible: false, reason: `The item ${item_id} does not belong to order ${order_id}.` };
  if (!order.delivered_at) return { eligible: false, reason: `This order has not been delivered yet.` };
  const daysSinceDelivery = daysBetween(new Date().toISOString(), order.delivered_at);
  if (daysSinceDelivery > RETURN_WINDOW_DAYS) return { eligible: false, reason: `This order was delivered ${daysSinceDelivery} day(s) ago, which is past our ${RETURN_WINDOW_DAYS}-day return window.` };
  if (item.final_sale) return { eligible: false, reason: `This item is a final-sale item and cannot be returned.` };
  if (!reason || reason.trim().length === 0) return { eligible: false, reason: `A return reason is required.` };
  if (!ACCEPTABLE_CONDITIONS.includes(condition)) return { eligible: false, reason: `Invalid condition '${condition}'. Acceptable conditions: ${ACCEPTABLE_CONDITIONS.join(', ')}.` };

  // eligible
  return { eligible: true, reason: `Return approved.` };
}

async function persistReturn({ order_id, item_id, reason, condition, eligible }) {
  await ensureReturnsTable();
  const id = "RET-" + crypto.randomBytes(6).toString("hex");
  await db.execute({ sql: `INSERT INTO returns (return_id, order_id, item_id, reason, condition, status, eligible, requested_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, args: [id, order_id, item_id, reason, condition, eligible ? 'approved' : 'rejected', eligible ? 1 : 0, new Date().toISOString()] });
  return id;
}

async function runTests() {
  const qaIds = ["NS-90001","NS-90002","NS-90003","NS-90004","NS-90005","NS-90006","NS-90007"];
  console.log('Checking QA orders:');
  for (const id of qaIds) {
    const order = await getOrder(id);
    console.log(id, order ? `${order.status} - ${order.customer_name} (${order.items.length} items)` : 'NOT FOUND');
  }

  console.log('\nRunning return eligibility tests:');

  // NS-90001 eligible
  const o1 = await getOrder('NS-90001');
  const item1 = o1.items[0];
  let res = await checkReturnEligibility({ order_id: 'NS-90001', item_id: item1.item_id, reason: 'Changed my mind', condition: ACCEPTABLE_CONDITIONS[0] });
  console.log('NS-90001 ->', res);
  if (res.eligible) console.log(' Persisted:', await persistReturn({ order_id: 'NS-90001', item_id: item1.item_id, reason: 'Changed my mind', condition: ACCEPTABLE_CONDITIONS[0], eligible: true }));

  // NS-90002 outside window
  const o2 = await getOrder('NS-90002');
  const item2 = o2.items[0];
  res = await checkReturnEligibility({ order_id: 'NS-90002', item_id: item2.item_id, reason: 'Found cheaper', condition: ACCEPTABLE_CONDITIONS[0] });
  console.log('NS-90002 ->', res);

  // NS-90003 not delivered
  const o3 = await getOrder('NS-90003');
  const item3 = o3.items[0];
  res = await checkReturnEligibility({ order_id: 'NS-90003', item_id: item3.item_id, reason: 'Item damaged', condition: ACCEPTABLE_CONDITIONS[0] });
  console.log('NS-90003 ->', res);

  // NS-90004 final sale
  const o4 = await getOrder('NS-90004');
  const item4 = o4.items[0];
  res = await checkReturnEligibility({ order_id: 'NS-90004', item_id: item4.item_id, reason: 'Defective', condition: ACCEPTABLE_CONDITIONS[0] });
  console.log('NS-90004 ->', res);

  // NS-90005 multiple items -> pick second item
  const o5 = await getOrder('NS-90005');
  const item5b = o5.items[1];
  res = await checkReturnEligibility({ order_id: 'NS-90005', item_id: item5b.item_id, reason: 'Wrong size', condition: ACCEPTABLE_CONDITIONS[1] });
  console.log('NS-90005 ->', res);
  if (res.eligible) console.log(' Persisted:', await persistReturn({ order_id: 'NS-90005', item_id: item5b.item_id, reason: 'Wrong size', condition: ACCEPTABLE_CONDITIONS[1], eligible: true }));

  // NS-90006 In Transit
  const o6 = await getOrder('NS-90006');
  const item6 = o6.items[0];
  res = await checkReturnEligibility({ order_id: 'NS-90006', item_id: item6.item_id, reason: 'Changed my mind', condition: ACCEPTABLE_CONDITIONS[0] });
  console.log('NS-90006 ->', res);

  // NS-90007 final sale/edge-window
  const o7 = await getOrder('NS-90007');
  const item7 = o7.items[0];
  res = await checkReturnEligibility({ order_id: 'NS-90007', item_id: item7.item_id, reason: 'Arrived late', condition: ACCEPTABLE_CONDITIONS[0] });
  console.log('NS-90007 ->', res);

  // invalid order
  res = await checkReturnEligibility({ order_id: 'NS-99999', item_id: 'NS-99999-ITEM1', reason: 'Nope', condition: ACCEPTABLE_CONDITIONS[0] });
  console.log('NS-99999 ->', res);

  // missing reason
  res = await checkReturnEligibility({ order_id: 'NS-90001', item_id: item1.item_id, reason: '', condition: ACCEPTABLE_CONDITIONS[0] });
  console.log('NS-90001 (missing reason) ->', res);

  // invalid item/order combination
  res = await checkReturnEligibility({ order_id: 'NS-90001', item_id: 'NS-90002-ITEM1', reason: 'Bad', condition: ACCEPTABLE_CONDITIONS[0] });
  console.log('NS-90001 (wrong item) ->', res);

  // invalid condition
  res = await checkReturnEligibility({ order_id: 'NS-90001', item_id: item1.item_id, reason: 'Bad', condition: 'Completely ruined' });
  console.log('NS-90001 (invalid condition) ->', res);
}

runTests().catch((err) => { console.error(err); process.exit(1); });
