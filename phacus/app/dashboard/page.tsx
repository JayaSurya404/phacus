"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Dashboard() {
  const router = useRouter();

  const [userName, setUserName] = useState("Loading...");
  const [medicines, setMedicines] = useState<any[]>([]);

  // 🔥 FETCH USER + MEDICINES
  useEffect(() => {
    // ✅ Get medicines
    fetch("/api/medicines")
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) {
          router.push("/login");
          return;
        }
        setMedicines(data);
      })
      .catch(() => router.push("/login"));

    // ✅ Get user name
    fetch("/api/me")
      .then(res => res.json())
      .then(data => {
        if (data.name) setUserName(data.name);
      })
      .catch(() => setUserName("User"));
  }, []);

  // 📊 STATS
  const total = medicines.length;

  const lowStock = medicines.filter(
    (m) => Number(m.stock) < 5
  ).length;

  const expiringSoon = medicines.filter((m) => {
    if (!m.expiryDate) return false;

    const today = new Date();
    const expiry = new Date(m.expiryDate);

    const diff =
      (expiry.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24);

    return diff <= 7; // next 7 days
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white p-5">
      
      {/* 🔝 Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-semibold">💊 PharmaSys</h1>

        <button
          onClick={() => router.push("/login")}
          className="px-3 py-1.5 text-sm bg-white/10 rounded-lg hover:bg-white/20"
        >
          Logout
        </button>
      </div>

      {/* 👋 Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-semibold">
          Welcome, {userName} 👋
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Manage your pharmacy efficiently.
        </p>
      </motion.div>

      {/* 📊 Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {[
          { title: "Total Medicines", value: total },
          { title: "Low Stock ⚠️", value: lowStock },
          { title: "Expiring Soon ⏳", value: expiringSoon },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/10 p-4 rounded-xl backdrop-blur"
          >
            <h3 className="text-sm text-gray-400">
              {item.title}
            </h3>
            <p className="text-2xl font-bold mt-1">
              {item.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* 💊 Inventory Preview */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-3">
          Inventory Preview
        </h3>

        <div className="grid md:grid-cols-3 gap-4">
          {medicines.slice(0, 3).map((med, i) => (
            <motion.div
              key={med._id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`p-4 rounded-xl backdrop-blur ${
                med.stock < 5
                  ? "bg-red-500/20"
                  : "bg-white/10"
              }`}
            >
              <h4 className="text-base font-semibold">
                {med.name}
              </h4>

              <p className="text-gray-400 text-sm mt-1">
                Stock: {med.stock}
              </p>

              {med.expiryDate && (
                <p className="text-xs text-gray-400 mt-1">
                  Exp:{" "}
                  {new Date(
                    med.expiryDate
                  ).toLocaleDateString()}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* 🚀 Button */}
      <div className="flex justify-center gap-4">
  <button
    onClick={() => router.push("/inventory")}
    className="px-5 py-2 bg-purple-600 rounded-lg text-sm"
  >
    Inventory
  </button>

  <button
    onClick={() => router.push("/billing")}
    className="px-5 py-2 bg-green-600 rounded-lg text-sm"
  >
    Billing 💰
  </button>
</div>
    </div>
  );
}