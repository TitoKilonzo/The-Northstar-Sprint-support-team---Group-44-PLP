"use client";

import { useState } from "react";

const ORDER_STAGES = ["Processing", "Shipped", "In Transit", "Delivered"];
const REASON_OPTIONS = [
  "Changed my mind",
  "Wrong item received",
  "Item arrived damaged",
  "Item doesn't fit",
  "No longer needed",
  "Other",
];
const CONDITION_OPTIONS = [
  "New, unused, original packaging",
  "Opened but unused",
  "Used",
  "Damaged",
];

function fmt(iso) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function StatusTrack({ status }) {
  const current = ORDER_STAGES.indexOf(status);

  return (
    <div className="mt-8">
      {/* Progress line */}
      <div className="relative px-2">
        <div className="absolute left-2 right-2 top-4 h-1 rounded-full bg-gray-100" />

        <div
          className="absolute left-2 top-4 h-1 rounded-full bg-orange-600 transition-all duration-500"
          style={{
            width:
              current <= 0
                ? "0%"
                : `${(current / (ORDER_STAGES.length - 1)) * 100}%`,
          }}
        />

        <div className="relative flex justify-between">
          {ORDER_STAGES.map((stage, index) => {
            const completed = index < current;
            const active = index === current;

            return (
              <div
                key={stage}
                className="flex flex-col items-center"
              >
                {/* Status dot */}
                <div
                  className={[
                    "h-8 w-8 rounded-full flex items-center justify-center border-4 border-white transition-all duration-300",
                    completed
                      ? "bg-orange-600"
                        : active
                        ? "bg-orange-600 ring-4 ring-orange-100"
                      : "bg-gray-200",
                  ].join(" ")}
                >
                  {completed && (
                    <span className="text-white text-xs font-bold">
                      ✓
                    </span>
                  )}

                  {active && (
                    <span className="h-2.5 w-2.5 rounded-full bg-white" />
                  )}
                </div>

                {/* Label */}
                <div className="mt-3 text-center">
                  <p
                    className={[
                      "text-xs font-semibold",
                      active || completed
                        ? "text-[#111827]"
                        : "text-gray-400",
                    ].join(" ")}
                  >
                    {stage}
                  </p>

                  {active && (
                    <p className="text-[10px] text-orange-600 font-medium mt-1">
                      Current status
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


function OrderStatusCard() {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const res = await fetch(
        `/api/order-status?order_id=${encodeURIComponent(orderId)}`
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setOrder(data);
      }
    } catch {
      setError("Couldn't reach the order lookup right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-2xl shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="p-6 md:p-8 border-b border-[#e5e7eb]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
              Order status
            </p>

            <h3 className="text-2xl font-semibold mt-2 text-[#111827]">
              Where's your order?
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Enter your order number to see its latest status.
            </p>
          </div>

          <div className="hidden sm:flex h-11 w-11 rounded-xl bg-orange-50 items-center justify-center text-xl">
          
          </div>
        </div>

        {/* Search */}
        <form onSubmit={onSubmit} className="mt-6">
          <label
            htmlFor="order-status-id"
            className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2"
          >
            Order number
          </label>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="order-status-id"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="NS-90001"
              className="flex-1 rounded-lg border border-[#e5e7eb] bg-white px-4 py-3 text-sm outline-none transition-all focus:border-orange-600 focus:ring-4 focus:ring-orange-100"
            />

            <button
              type="submit"
              disabled={loading || !orderId.trim()}
              className="rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "Checking…" : "Check order →"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>

      {/* Order result */}
      {order && (
        <div className="p-6 md:p-8">
          {/* Order identity */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                Order
              </p>

              <p className="font-mono text-lg font-semibold text-[#111827] mt-1">
                {order.order_id}
              </p>
            </div>

            <div className="sm:text-right">
              <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                Customer
              </p>

              <p className="text-sm font-medium text-[#111827] mt-1">
                {order.customer_name}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-[#111827]">
                Delivery progress
              </p>

              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                {order.status}
              </span>
            </div>

            <StatusTrack status={order.status} />
          </div>

          {/* Dates */}
          <div className="grid sm:grid-cols-2 gap-4 mt-8">
            <div className="rounded-xl bg-[#f6f7f9] p-4">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">
                Placed
              </p>

              <p className="text-sm font-medium mt-1 text-[#111827]">
                {fmt(order.placed_at)}
              </p>
            </div>

            <div className="rounded-xl bg-[#f6f7f9] p-4">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">
                Delivered
              </p>

              <p className="text-sm font-medium mt-1 text-[#111827]">
                {order.delivered_at ? fmt(order.delivered_at) : "Not delivered yet"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReturnCard() {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);

  const [itemId, setItemId] = useState("");
  const [reason, setReason] = useState("");
  const [condition, setCondition] = useState("");
  const [verdict, setVerdict] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function findOrder(e) {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setOrder(null);
    setVerdict(null);

    try {
      const res = await fetch(
        `/api/order-status?order_id=${encodeURIComponent(orderId)}`
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setOrder(data);
        setItemId(data.items?.[0]?.item_id ?? "");
      }
    } catch {
      setError("Couldn't reach the order lookup right now.");
    } finally {
      setLoading(false);
    }
  }

  async function submitReturn(e) {
    e.preventDefault();

    setSubmitting(true);
    setVerdict(null);

    try {
      const res = await fetch("/api/return-eligibility", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: order.order_id,
          item_id: itemId,
          reason,
          condition,
        }),
      });

      const data = await res.json();
      setVerdict(data);
    } catch {
      setVerdict({
        eligible: false,
        reason: "Couldn't reach the eligibility check right now.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  function startOver() {
    setOrder(null);
    setOrderId("");
    setVerdict(null);
    setReason("");
    setCondition("");
    setItemId("");
    setError(null);
  }

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <header className="border-b border-[#e5e7eb] bg-white p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
              Return / refund
            </p>

            <h3 className="text-2xl font-semibold mt-2 text-[#111827]">
              {order ? "Tell us about your item" : "Find your order"}
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              {order
                ? "Give us a few details so we can check whether your return qualifies."
                : "Enter your order number to check whether your item qualifies for a return."}
            </p>
          </div>

          <div className="hidden sm:flex h-11 w-11 rounded-xl bg-gray-100 items-center justify-center text-xl">
            ↩
          </div>
        </div>

        {/* Find order */}
        {!order && (
          <form onSubmit={findOrder} className="mt-6">
            <label
              htmlFor="return-order-id"
              className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2"
            >
              Order number
            </label>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="return-order-id"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="NS-90005"
                className="flex-1 rounded-lg border border-[#e5e7eb] bg-white px-4 py-3 text-sm outline-none transition-all focus:border-orange-600 focus:ring-4 focus:ring-orange-100"
              />

              <button
                type="submit"
                disabled={loading || !orderId.trim()}
                className="rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? "Looking…" : "Find order →"}
              </button>
            </div>
          </form>
        )}

        {error && (
          <div className="mt-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </header>

      {/* Return details */}
      {order && !verdict && (
        <form onSubmit={submitReturn} className="p-6 sm:p-8 md:p-10">
          <div className="flex items-center justify-between gap-3 mb-7">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                Order
              </p>

              <p className="font-mono text-sm font-semibold mt-1">
                {order.order_id}
              </p>
            </div>

              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
              {order.status}
            </span>
          </div>

          <div className="space-y-5">
            {/* Item */}
            <div>
              <label
                htmlFor="return-item"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2"
              >
                Which item?
              </label>

              <select
                id="return-item"
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
                className="w-full rounded-lg border border-[#e5e7eb] bg-white px-4 py-3 text-sm outline-none transition-all focus:border-orange-600 focus:ring-4 focus:ring-orange-100"
              >
                {order.items?.map((item) => (
                  <option key={item.item_id} value={item.item_id}>
                    {item.product_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Reason */}
            <div>
              <label
                htmlFor="return-reason"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2"
              >
                Reason for return
              </label>

              <select
                id="return-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-lg border border-[#e5e7eb] bg-white px-4 py-3 text-sm outline-none transition-all focus:border-orange-600 focus:ring-4 focus:ring-orange-100"
              >
                <option value="">Select a reason…</option>

                {REASON_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div>
              <label
                htmlFor="return-condition"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2"
              >
                Item condition
              </label>

              <select
                id="return-condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full rounded-lg border border-[#e5e7eb] bg-white px-4 py-3 text-sm outline-none transition-all focus:border-orange-600 focus:ring-4 focus:ring-orange-100"
              >
                <option value="">Select condition…</option>

                {CONDITION_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-7">
            <button
              type="submit"
              disabled={submitting || !reason || !condition}
              className="rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? "Checking…" : "Check eligibility →"}
            </button>

            <button
              type="button"
              onClick={startOver}
              className="rounded-lg border border-[#e5e7eb] px-5 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
            >
              Start over
            </button>
          </div>
        </form>
      )}

      {/* Verdict */}
      {verdict && (
        <div className="p-6 md:p-8">
          <div
            className={[
              "rounded-2xl border p-6",
              verdict.eligible
                ? "border-green-600 text-green-600"
                : "border-red-600 text-red-600"
            ].join(" ")}
          >
            <div className="flex items-start gap-4">
              <div
                className={[
                  "h-10 w-10 rounded-full flex items-center justify-center font-bold shrink-0",
                  verdict.eligible
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700",
                ].join(" ")}
              >
                {verdict.eligible ? "✓" : "!"}
              </div>

              <div>
                <p
                  className={[
                    "text-xs font-semibold uppercase tracking-[0.18em]",
                    verdict.eligible
                      ? "text-green-700"
                      : "text-red-700",
                  ].join(" ")}
                >
                  {verdict.eligible ? "Eligible" : "Not eligible"}
                </p>

                <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                  {verdict.reason}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={startOver}
            className="mt-5 text-sm font-semibold text-orange-600 hover:text-orange-700"
          >
            Check another order →
          </button>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [activeTool, setActiveTool] = useState(null);

  return (
    <main className="min-h-screen bg-[#f6f7f9] text-[#111827] px-4 sm:px-6 py-10 sm:py-16 md:py-24">
      {/* Header */}
      <header className="border-b border-orange-600 bg-orange-500">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold tracking-tight text-white">NORTHSTAR</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-orange-100 mt-0.5">
              Retail Co.
            </p>
          </div>

          <button
            type="button"
            className="text-sm font-semibold text-white hover:text-orange-100"
          >
            Help
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 border border-orange-100 px-3 py-1.5 text-xs font-medium text-orange-700 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
            Self-service support
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
            How can we help?
          </h1>
          <p className="text-lg md:text-xl text-gray-500 mt-5 max-w-xl leading-relaxed">
            Track your delivery or check your return eligibility.
          </p>
        </div>
      </section>

      {/* Main actions */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-2 gap-5">

          {/* TRACK ORDER */}
          <button
            type="button"
            onClick={() => setActiveTool("status")}
            className="w-full text-left bg-white border border-[#e5e7eb] rounded-2xl p-6 sm:p-6 sm:p-7 md:p-9 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-[0.99]"
          >
            <div className="flex items-start justify-between">
              <div className="h-11 w-11 rounded-xl bg-orange-50 flex items-center justify-center text-xl">
              
              </div>

              <span className="text-xs font-medium text-gray-400">
                01
              </span>
            </div>

            <h2 className="text-2xl font-semibold mt-8">
              Track an order
            </h2>

            <p className="text-gray-500 mt-2 leading-relaxed max-w-sm">
              See where your order is and follow its journey from processing
              to delivery.
            </p>

            <div className="mt-7 text-sm font-semibold text-orange-600">
              Check order <span className="ml-2">→</span>
            </div>
          </button>

          {/* START RETURN */}
          <button
            type="button"
            onClick={() => setActiveTool("return")}
            className="w-full text-left bg-white border border-[#e5e7eb] rounded-2xl p-7 md:p-9 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="h-11 w-11 rounded-xl bg-gray-100 flex items-center justify-center text-xl">
                ↩
              </div>

              <span className="text-xs font-medium text-gray-400">
                02
              </span>
            </div>

            <h2 className="text-2xl font-semibold mt-8">
              Start a return
            </h2>

            <p className="text-gray-500 mt-2 leading-relaxed max-w-sm">
              Check your order and find out whether your item qualifies for a
              return or refund.
            </p>

            <div className="mt-7 text-sm font-semibold text-gray-900">
              Start return <span className="ml-2">→</span>
            </div>
          </button>

        </div>
      </section>

      {/* EXISTING WORKING FORMS */}
      {activeTool && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
          <div className="flex items-center justify-between mb-5 px-1">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
                
              </p>

              <h2 className="text-2xl font-semibold mt-1">
                {activeTool === "status"
                  ? "Track your order"
                  : "Start a return"}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setActiveTool(null)}
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              Close
            </button>
          </div>

          {activeTool === "status" && <OrderStatusCard />}

          {activeTool === "return" && <ReturnCard />}
        </section>
      )}

      {/* How it works */}
      <section className="border-t border-[#e5e7eb] bg-white">
        <div className="max-w-6xl mx-auto px-6 py-14 md:py-18">
          <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
             
            </p>

            <h2 className="text-2xl md:text-3xl font-semibold mt-3">
              Get your answer in three steps.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-10">
            <div>
              <span className="text-sm font-semibold text-orange-600">01</span>
              <h3 className="font-semibold mt-3">Search</h3>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                Enter your order number to find your order.
              </p>
            </div>

            <div>
              <span className="text-sm font-semibold text-orange-600">02</span>
              <h3 className="font-semibold mt-3">Check</h3>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                See your delivery status or return eligibility.
              </p>
            </div>

            <div>
              <span className="text-sm font-semibold text-orange-600">03</span>
              <h3 className="font-semibold mt-3">Resolve</h3>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                Take the next step without waiting for an agent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1f2937] bg-[#111827]">
        <div className="max-w-6xl mx-auto px-6 py-7 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            © 2026 Northstar Retail Co.
          </p>

          <p className="text-xs text-gray-400">
            Self-service support
          </p>
        </div>
      </footer>
    </main>
  );
}

