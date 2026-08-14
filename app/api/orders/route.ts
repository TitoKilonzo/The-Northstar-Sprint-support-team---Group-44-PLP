import { NextRequest, NextResponse } from "next/server";
import { db, ensureSchema } from "@/lib/db";

export async function GET(req: NextRequest) {
  await ensureSchema();
  const q = await db.execute({
    sql: `SELECT order_id, customer_name, status, placed_at, delivered_at FROM orders ORDER BY placed_at DESC LIMIT 200`,
  });

  return NextResponse.json({ orders: q.rows });
}
