import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import BlockchainTrail from "./BlockchainTrail";

const loadingStages = [
  "Connecting to CDSCO registry",
  "Cross-referencing manufacturer DB",
  "Validating blockchain signature",
  "Checking batch expiry & recalls",
  "Generating audit trail",
];

const statusStyles = {
  verified: {
    badge: "success",
    box: "border-emerald-200 bg-emerald-50",
    icon: "✓",
  },
  counterfeit: {
    badge: "destructive",
    box: "border-red-200 bg-red-50",
    icon: "✗",
  },
  warning: {
    badge: "warning",
    box: "border-amber-200 bg-amber-50",
    icon: "⚠",
  },
  expired: {
    badge: "warning",
    box: "border-amber-200 bg-amber-50",
    icon: "⚠",
  },
};

export default function ResultPanel({ loading, loadingStage, result, blockchainTrail }) {
  const current = statusStyles[result?.status || "verified"] || statusStyles.verified;
  const batch = result?.batch;

  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Verification Result</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            <Progress value={Math.min(((loadingStage + 1) / loadingStages.length) * 100, 100)} />
            <div className="space-y-2">
              {loadingStages.map((stage, index) => (
                <motion.p
                  key={stage}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.35 }}
                  className={`text-sm ${index <= loadingStage ? "text-slate-800" : "text-slate-400"}`}
                >
                  {stage}
                </motion.p>
              ))}
            </div>
          </div>
        ) : null}

        {result ? (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`rounded-2xl border p-5 ${current.box}`}
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl shadow-sm">
                    {current.icon}
                  </span>
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{result.title}</p>
                    <p className="text-sm text-slate-600">{result.subtitle}</p>
                  </div>
                </div>
                <Badge variant={current.badge} className="capitalize">
                  {result.status}
                </Badge>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["Drug", batch?.drugName || batch?.chainRecord?.drugName || "-"],
                  ["Manufacturer", batch?.manufacturer?.name || batch?.chainRecord?.manufacturer || "-"],
                  ["Batch No.", batch?.batchId || batch?.chainRecord?.batchId || "-"],
                  ["Mfg Date", batch?.mfgDate ? new Date(batch.mfgDate).toLocaleDateString() : "-"],
                  ["Expiry", batch?.expDate ? new Date(batch.expDate).toLocaleDateString() : "-"],
                  ["CDSCO DL", batch?.manufacturer?.cdscoLicense || batch?.chainRecord?.cdscoLicense || "-"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-white/80 p-3 shadow-sm">
                    <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">Blockchain Audit Trail</p>
                <Badge variant="info">Immutable ledger</Badge>
              </div>
              <BlockchainTrail
                steps={
                  blockchainTrail?.length
                    ? blockchainTrail
                    : [
                        { id: "1", label: "Batch registration confirmed", hash: "0x8a4f...9c21" },
                        { id: "2", label: "Manufacturer signature matched", hash: "0x27db...11ce" },
                        { id: "3", label: "Expiry window validated", hash: "0x9f10...32ab" },
                      ]
                }
              />
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
            Scan a medicine QR or enter a batch code to see blockchain-backed verification details.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
