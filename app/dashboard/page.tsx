"use client";
import React, { useEffect, useState } from "react";

export default function DashboardPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        setOrders(data.orders || []);
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Orders</h1>
      {loading && <p>Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !orders.length && <p>No orders found.</p>}
      {orders.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Order</th>
                <th className="py-2">Customer</th>
                <th className="py-2">Status</th>
                <th className="py-2">Placed</th>
                <th className="py-2">Delivered</th>
                <th className="py-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o: any) => (
                <tr key={o.order_id} className="border-b">
                  <td className="py-2 font-mono">{o.order_id}</td>
                  <td className="py-2">{o.customer_name}</td>
                  <td className="py-2">{o.status}</td>
                  <td className="py-2">{new Date(o.placed_at).toLocaleString()}</td>
                  <td className="py-2">{o.delivered_at ? new Date(o.delivered_at).toLocaleString() : "—"}</td>
                  <td className="py-2">
                    <a className="text-orange-600 hover:underline" href={`/dashboard/order/${encodeURIComponent(o.order_id)}`}>
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
