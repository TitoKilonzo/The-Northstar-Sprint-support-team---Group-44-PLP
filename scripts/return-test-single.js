const http = require('http');
const fs = require('fs');
// Accept either a JSON string as argv[2], or individual fields:
// node return-test-single.js ORDER_ID ITEM_ID REASON CONDITION [PORT]
let body = null;
let port = 3001;
if (process.argv[2] && process.argv[2].startsWith('{')) {
  body = JSON.parse(process.argv[2]);
  port = process.argv[3] ? Number(process.argv[3]) : 3001;
} else {
  const order_id = process.argv[2];
  const item_id = process.argv[3];
  const reason = process.argv[4] || '';
  const condition = process.argv[5] || '';
  port = process.argv[6] ? Number(process.argv[6]) : 3001;
  body = { order_id, item_id, reason, condition };
}
const data = JSON.stringify(body);
const options = { hostname: 'localhost', port, path: '/api/return-eligibility', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } };
const req = http.request(options, res => {
  let out = '';
  res.setEncoding('utf8');
  res.on('data', c => out += c);
  res.on('end', () => {
    try { const js = JSON.parse(out); console.log(JSON.stringify({ status: res.statusCode, body: js })); }
    catch(e){ console.log(JSON.stringify({ status: res.statusCode, body: out })); }
  });
});
req.on('error', e => { console.log(JSON.stringify({ error: e.message })); });
req.write(data);
req.end();
