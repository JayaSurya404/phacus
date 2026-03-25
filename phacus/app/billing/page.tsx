"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BillingPage() {
  const router = useRouter();

  const [medicines, setMedicines] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);

  // ✅ fetch medicines
  const fetchMedicines = () => {
    fetch("/api/medicines")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMedicines(data);
        } else {
          router.push("/login");
        }
      });
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // ✅ add to cart
  const addToCart = (med: any) => {
    setCart(prev => {
      const exists = prev.find(p => p._id === med._id);

      if (exists) {
        return prev.map(p =>
          p._id === med._id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }

      return [...prev, { ...med, quantity: 1 }];
    });
  };

  // ✅ total
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // ✅ create bill
  const createBill = async () => {
    if (cart.length === 0) {
      alert("Cart is empty ❌");
      return;
    }

    const res = await fetch("/api/billing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Bill Created ✅");

    // ✅ clear cart
    setCart([]);

    // ✅ refresh medicines (updated stock)
    fetchMedicines();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white p-5">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">💰 Billing System</h1>

        <button
          onClick={() => router.push("/billing/history")}
          className="bg-blue-600 px-3 py-1.5 text-sm rounded-lg hover:bg-blue-700"
        >
          View Bills 📊
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* 💊 MEDICINES */}
        <div>
          <h2 className="mb-3 text-lg">Medicines</h2>

          {medicines.map((m) => (
            <div
              key={m._id}
              className="bg-white/10 p-3 mb-2 rounded-lg flex justify-between items-center"
            >
              <div className="text-sm">
                <p>{m.name}</p>
                <p className="text-gray-400 text-xs">
                  ₹{m.price} | Stock: {m.stock}
                </p>
              </div>

              <button
                onClick={() => addToCart(m)}
                className="bg-green-600 px-2 py-1 text-xs rounded"
              >
                Add
              </button>
            </div>
          ))}
        </div>

        {/* 🛒 CART */}
        <div>
          <h2 className="mb-3 text-lg">Cart</h2>

          {cart.length === 0 && (
            <p className="text-gray-400 text-sm">No items added</p>
          )}

          {cart.map((item) => (
            <div
              key={item._id}
              className="bg-white/10 p-3 mb-2 rounded-lg flex justify-between"
            >
              <div className="text-sm">
                {item.name} x {item.quantity}
              </div>

              <div className="text-sm">
                ₹{item.price * item.quantity}
              </div>
            </div>
          ))}

          {/* 💰 TOTAL */}
          <h3 className="mt-4 text-lg font-semibold">
            Total: ₹{total}
          </h3>

          {/* 🚀 BUTTON */}
          <button
            onClick={createBill}
            disabled={cart.length === 0}
            className={`mt-4 px-4 py-2 text-sm rounded-lg ${
              cart.length === 0
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            Generate Bill
          </button>
        </div>

      </div>
    </div>
  );
}