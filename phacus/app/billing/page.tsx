"use client";

import { useEffect, useState } from "react";

export default function BillingPage() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);

  // fetch medicines
  useEffect(() => {
    fetch("/api/medicines")
      .then(res => res.json())
      .then(data => setMedicines(data));
  }, []);

  // add to cart
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

  // total
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // create bill
  const createBill = async () => {
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
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-[#0f0c29] text-white p-5">

      <h1 className="text-2xl mb-5">💰 Billing System</h1>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Medicines */}
        <div>
          <h2 className="mb-3">Medicines</h2>

          {medicines.map((m) => (
            <div
              key={m._id}
              className="bg-white/10 p-3 mb-2 rounded flex justify-between"
            >
              <div>
                {m.name} - ₹{m.price}
              </div>

              <button
                onClick={() => addToCart(m)}
                className="bg-green-600 px-2 rounded"
              >
                Add
              </button>
            </div>
          ))}
        </div>

        {/* Cart */}
        <div>
          <h2 className="mb-3">Cart</h2>

          {cart.map((item) => (
            <div
              key={item._id}
              className="bg-white/10 p-3 mb-2 rounded flex justify-between"
            >
              <div>
                {item.name} x {item.quantity}
              </div>

              <div>₹{item.price * item.quantity}</div>
            </div>
          ))}

          <h3 className="mt-4 text-lg">
            Total: ₹{total}
          </h3>

          <button
            onClick={createBill}
            className="mt-4 bg-purple-600 px-4 py-2 rounded"
          >
            Generate Bill
          </button>
        </div>

      </div>
    </div>
  );
}