import { motion } from "framer-motion";
import { AlertCircle, Bell, Siren } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const styles = {
  high: {
    icon: Siren,
    border: "border-red-500",
    box: "bg-red-100 text-red-700",
    badge: "destructive",
  },
  medium: {
    icon: AlertCircle,
    border: "border-amber-500",
    box: "bg-amber-100 text-amber-700",
    badge: "warning",
  },
  low: {
    icon: Bell,
    border: "border-blue-500",
    box: "bg-blue-100 text-blue-700",
    badge: "info",
  },
};

export default function AlertsView({ alerts }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {alerts.map((alert, index) => {
        const style = styles[alert.severity];
        const Icon = style.icon;

        return (
          <motion.div
            key={alert._id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`rounded-2xl border-l-4 ${style.border} border-y border-r border-slate-200 bg-white p-5 shadow-sm`}
          >
            <div className="flex gap-4">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${style.box}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <p className="font-semibold text-slate-900">{alert.title}</p>
                  <Badge variant={style.badge} className="capitalize">
                    {alert.severity}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600">{alert.description}</p>
                <p className="mt-3 text-xs text-slate-500">
                  Alert ID: {alert._id} | {new Date(alert.createdAt).toLocaleString()} | {alert.state || "N/A"}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
