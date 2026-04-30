import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MetricCard from "./MetricCard";
import ScanBarChart from "./ScanBarChart";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function AnalyticsView({ summary, monthly, byState }) {
  const monthlyData = monthNames.map((month, index) => {
    const matched = monthly.find((item) => item._id === index + 1);
    return {
      month,
      scans: matched?.scans || 0,
      future: index >= 9,
    };
  });

  const metrics = [
    {
      title: "Total Scans (2025)",
      value: summary?.totalScans?.toLocaleString?.("en-IN") || "0",
      delta: "+23% vs 2024",
    },
    {
      title: "Counterfeits Detected",
      value: summary?.counterfeitCount?.toLocaleString?.("en-IN") || "0",
      delta: "+8% vs 2024",
    },
    {
      title: "Verification Accuracy",
      value: `${summary?.accuracy || 0}%`,
      delta: "↑ 0.2%",
    },
    {
      title: "Manufacturers Enrolled",
      value: summary?.manufacturerCount || 0,
      delta: "+3 this year",
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-4">
        {metrics.map((metric, index) => (
          <MetricCard key={metric.title} {...metric} index={index} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Monthly Scan Volumes</CardTitle>
          </CardHeader>
          <CardContent>
            <ScanBarChart data={monthlyData} />
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>State-wise Counterfeit Heatmap</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {byState.map((state) => {
              const color =
                state.counterfeits >= 3
                  ? "bg-red-500"
                  : state.counterfeits === 2
                    ? "bg-amber-500"
                    : state.counterfeits === 1
                      ? "bg-blue-500"
                      : "bg-emerald-500";
              return (
                <div key={state._id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{state._id}</span>
                    <span className="text-slate-500">{state.counterfeits}</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100">
                    <div
                      className={`h-3 rounded-full ${color}`}
                      style={{ width: `${Math.max(state.counterfeits * 25, 12)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
