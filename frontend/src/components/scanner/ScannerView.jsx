import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { QrReader } from "react-qr-reader";
import api from "@/api";
import { useBlockchain } from "@/hooks/useBlockchain";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ScanFrame from "./ScanFrame";
import ResultPanel from "./ResultPanel";

const sampleCodes = {
  genuine: [
    "MFG-SUN-AMX-2024-001A",
    "MFG-CIP-CFX-2024-089B",
    "MFG-DRL-MET-2024-045C",
  ],
  counterfeit: ["FAKE-OXY-2024-087", "UNRG-2024-999"],
  warning: ["EXP-AMX-2019-001"],
};

export default function ScannerView() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(-1);
  const blockchain = useBlockchain(result);

  const chips = useMemo(
    () => [
      ...sampleCodes.genuine.map((item) => ({ value: item, variant: "success" })),
      ...sampleCodes.counterfeit.map((item) => ({ value: item, variant: "destructive" })),
      ...sampleCodes.warning.map((item) => ({ value: item, variant: "warning" })),
    ],
    []
  );

  const verifyBatch = async (batchCode = code) => {
    if (!batchCode) return;

    setLoading(true);
    setLoadingStage(0);
    setResult(null);

    const stages = [0, 1, 2, 3, 4];
    stages.forEach((stage, index) => {
      setTimeout(() => setLoadingStage(stage), index * 350);
    });

    try {
      const { data } = await api.post("/scan/verify", {
        batchId: batchCode,
        location: { city: "Mumbai", state: "Maharashtra" },
        deviceId: "WEB-SCANNER-01",
      });
      setTimeout(() => {
        setResult(data);
        setLoading(false);
      }, 1750);
    } catch (error) {
      setTimeout(() => {
        setResult({
          status: "counterfeit",
          title: "Verification failed",
          subtitle: error.response?.data?.message || "Unable to validate this batch right now.",
        });
        setLoading(false);
      }, 1750);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-6 xl:grid-cols-[1.02fr_1fr]"
    >
      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Scan Panel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <ScanFrame />

          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <QrReader
              constraints={{ facingMode: "environment" }}
              onResult={(scanResult) => {
                const text = scanResult?.getText?.();
                if (text) {
                  setCode(text);
                }
              }}
              containerStyle={{ width: "100%" }}
            />
          </div>

          <div className="space-y-3">
            <Input
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Enter barcode or batch id manually"
              className="h-11"
            />
            <Button
              onClick={() => verifyBatch()}
              className="h-11 w-full bg-[#1d4ed8] text-white hover:bg-[#1e40af]"
            >
              Verify
            </Button>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-700">Sample codes</p>
            <div className="flex flex-wrap gap-2">
              {chips.map((chip) => (
                <button key={chip.value} onClick={() => setCode(chip.value)}>
                  <Badge variant={chip.variant} className="cursor-pointer">
                    {chip.value}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <ResultPanel
        loading={loading}
        loadingStage={loadingStage}
        result={result}
        blockchainTrail={blockchain.trail}
      />
    </motion.div>
  );
}
