"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params?.orderId;
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    fetch(`/api/order-status?order_id=${encodeURIComponent(orderId)}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data.error ? null : data);
        if (data.error) setError(data.error);
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!order) return <div className="p-6">No order found.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-2">Order {order.order_id}</h1>
      <p className="text-sm text-ink/60">Customer: {order.customer_name}</p>
      <p className="mt-2">Status: {order.status}</p>
      <p className="mt-1">Placed: {new Date(order.placed_at).toLocaleString()}</p>
      {order.delivered_at && <p className="mt-1">Delivered: {new Date(order.delivered_at).toLocaleString()}</p>}

      <div className="mt-4">
        <h2 className="font-medium">Items</h2>
        <ul className="mt-2 list-disc pl-6">
          {order.items.map((it: any) => (
            <li key={it.item_id} className="mb-1">
              <span className="font-mono">{it.item_id}</span> — {it.product_name} {it.final_sale ? "(Final sale)" : ""}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
