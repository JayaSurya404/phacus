"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BillHistoryPage() {
  const router = useRouter();

  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch bills
  useEffect(() => {
    fetch("/api/billing")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setBills(data);
        } else {
          router.push("/login");
        }
        setLoading(false);
      })
      .catch(() => {
        setBills([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white p-5">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">📊 Bill History</h1>

        <button
          onClick={() => router.push("/billing")}
          className="bg-purple-600 px-3 py-1.5 text-sm rounded-lg hover:bg-purple-700"
        >
          Back to Billing
        </button>
      </div>

      {/* ⏳ LOADING */}
      {loading && (
        <p className="text-gray-400 text-sm">Loading bills...</p>
      )}

      {/* ❌ EMPTY */}
      {!loading && bills.length === 0 && (
        <p className="text-gray-400 text-sm">No bills found</p>
      )}

      {/* 💰 BILL LIST */}
      <div className="space-y-4">
        {bills.map((bill) => (
          <div
            key={bill._id}
            className="bg-white/10 p-4 rounded-xl backdrop-blur"
          >
            {/* 🕒 Date */}
            <p className="text-xs text-gray-400 mb-2">
              {new Date(bill.createdAt).toLocaleString()}
            </p>

            {/* 💊 Items */}
            {bill.items.map((item: any, i: number) => (
              <div
                key={i}
                className="flex justify-between text-sm mb-1"
              >
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}

            {/* Divider */}
            <hr className="my-2 border-white/20" />

            {/* 💰 Total */}
            <p className="text-right font-semibold text-green-400">
              Total: ₹{bill.total}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}