"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      {/* Navbar */}
      <div className="flex items-center justify-between px-8 py-5">
        <h1 className="text-2xl font-bold tracking-wide">
          💊 PharmaSys
        </h1>

        <div className="flex gap-4">
          <button
            onClick={() => router.push("/login")}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            Login
          </button>
          <button
            onClick={() => router.push("/signup")}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 transition"
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center mt-20 px-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold leading-tight"
        >
          Smart Pharmacy Management System
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-lg text-gray-300 max-w-2xl"
        >
          Manage your pharmacy inventory, track medicines, monitor stock levels,
          and streamline billing — all in one modern dashboard.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex gap-6 mt-10"
        >
          <button
            onClick={() => router.push("/signup")}
            className="px-8 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-lg font-semibold shadow-lg"
          >
            Get Started
          </button>
          <button
            onClick={() => router.push("/login")}
            className="px-8 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-lg"
          >
            Login
          </button>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="mt-32 px-8 grid md:grid-cols-3 gap-8">
        {[
          {
            title: "Inventory Management",
            desc: "Add, update, and delete medicines easily with real-time stock tracking.",
          },
          {
            title: "Low Stock Alerts ⚠️",
            desc: "Get notified instantly when medicines are running low.",
          },
          {
            title: "Expiry Tracking",
            desc: "Track medicine expiry dates and avoid losses.",
          },
          {
            title: "Billing System",
            desc: "Generate bills quickly and manage transactions efficiently.",
          },
          {
            title: "Search Medicines",
            desc: "Quickly find any medicine in your inventory.",
          },
          {
            title: "Secure Login",
            desc: "Your pharmacy data is safe with authentication.",
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:scale-105 transition"
          >
            <h3 className="text-xl font-semibold mb-3">
              {feature.title}
            </h3>
            <p className="text-gray-300">{feature.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-32 text-center pb-10 text-gray-400">
        © 2026 PharmaSys • Built with Next.js & MERN 🚀
      </div>
    </div>
  );
}
