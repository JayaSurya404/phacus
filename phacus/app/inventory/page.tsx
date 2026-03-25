"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function InventoryPage() {
  const router = useRouter();

  const [medicines, setMedicines] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [search, setSearch] = useState("");

  // ✅ FETCH DATA
  useEffect(() => {
    fetch("/api/medicines")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMedicines(data);
        } else {
          router.push("/login");
        }
      })
      .catch(() => setMedicines([]));
  }, []);

  // ✅ ADD MEDICINE
  const addMedicine = async () => {
    if (!name || !stock || !price || !expiryDate) {
      alert("All fields required");
      return;
    }

    const res = await fetch("/api/medicines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, stock, price, expiryDate }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    setMedicines(prev => [data, ...prev]);

    setName("");
    setStock("");
    setPrice("");
    setExpiryDate("");
  };

  // ✅ DELETE
  const deleteMedicine = async (id: string) => {
    await fetch(`/api/medicines?id=${id}`, { method: "DELETE" });

    setMedicines(prev => prev.filter(m => m._id !== id));
  };

  // ✅ UPDATE STOCK
  const updateStock = async (id: string, change: number) => {
    const res = await fetch("/api/medicines", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, change }),
    });

    const updated = await res.json();

    setMedicines(prev =>
      prev.map(m => (m._id === id ? updated : m))
    );
  };

  // ✅ SAFE FILTER
  const filtered = medicines.filter((m) =>
    (m.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white p-5">

      <h1 className="text-2xl font-semibold mb-6">
        💊 Inventory Management
      </h1>

      {/* ➕ Add Medicine */}
      <div className="bg-white/10 p-5 rounded-xl mb-8 backdrop-blur">
        <h2 className="text-lg mb-3">Add Medicine</h2>

        <div className="grid md:grid-cols-5 gap-3">
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 rounded bg-white/10 text-sm"
          />

          <input
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="p-2 rounded bg-white/10 text-sm"
          />

          <input
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="p-2 rounded bg-white/10 text-sm"
          />

          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="p-2 rounded bg-white/10 text-sm"
          />

          <button
            onClick={addMedicine}
            className="bg-purple-600 rounded text-sm"
          >
            Add
          </button>
        </div>
      </div>

      {/* 🔍 Search */}
      <input
        placeholder="Search medicine..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 rounded-lg bg-white/10 mb-6 w-full text-sm"
      />

      {/* 📋 Table */}
      <div className="bg-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/20">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Stock</th>
              <th className="p-2">Price</th>
              <th className="p-2">Expiry</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((m) => {
              const isLow = m.stock < 5;

              return (
                <tr
                  key={m._id}
                  className={`text-center border-t border-white/10 ${
                    isLow ? "bg-red-500/20" : ""
                  }`}
                >
                  <td className="p-2">{m.name}</td>

                  <td className="p-2">
                    {m.stock}
                    {isLow && " ⚠️"}
                  </td>

                  <td className="p-2">₹{m.price}</td>

                  <td className="p-2">
                    {m.expiryDate
                      ? new Date(m.expiryDate).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="p-2 flex justify-center gap-2">
                    <button
                      onClick={() => updateStock(m._id, 1)}
                      className="bg-green-600 px-2 rounded"
                    >
                      +
                    </button>

                    <button
                      onClick={() => updateStock(m._id, -1)}
                      className="bg-yellow-600 px-2 rounded"
                    >
                      -
                    </button>

                    <button
                      onClick={() => deleteMedicine(m._id)}
                      className="bg-red-600 px-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}