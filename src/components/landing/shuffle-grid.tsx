"use client";

import { motion } from "framer-motion";

const tones = [
  "from-orange-400 to-rose-500",
  "from-sky-400 to-cyan-500",
  "from-emerald-400 to-lime-500",
  "from-fuchsia-400 to-pink-500",
];

export function ShuffleGrid({ labels, moduleLabel }: { labels: string[]; moduleLabel: string }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {labels.map((label, index) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 24, rotate: index % 2 === 0 ? -3 : 3 }}
          animate={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? -2 : 2 }}
          transition={{ duration: 0.45, delay: index * 0.08 }}
          whileHover={{ y: -6, rotate: 0, scale: 1.02 }}
          className={`rounded-[28px] border border-white/20 bg-gradient-to-br ${tones[index % tones.length]} p-6 text-white shadow-2xl shadow-black/20`}
        >
          <p className="text-sm uppercase tracking-[0.24em] text-white/70">
            {moduleLabel} {index + 1}
          </p>
          <h3 className="mt-10 text-2xl font-semibold tracking-tight">{label}</h3>
        </motion.div>
      ))}
    </div>
  );
}
