import { motion } from "framer-motion";

export default function BlockchainTrail({ steps = [] }) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.12 }}
          className="relative pl-6"
        >
          <span className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(34,197,94,0.8)]" />
          {index !== steps.length - 1 ? (
            <span className="absolute left-[5px] top-5 h-10 w-px bg-slate-200" />
          ) : null}
          <p className="font-medium text-slate-900">{step.label}</p>
          <p className="font-mono text-xs text-slate-500">{step.hash}</p>
        </motion.div>
      ))}
    </div>
  );
}
