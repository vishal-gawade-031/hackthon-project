import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BatchTable from "./BatchTable";
import RegisterBatchForm from "./RegisterBatchForm";

export default function ManufacturerPortal({ batches, user, onRefresh }) {
  const manufacturers = useMemo(() => {
    const map = new Map();
    batches.forEach((batch) => {
      if (batch.manufacturer?._id && !map.has(batch.manufacturer._id)) {
        map.set(batch.manufacturer._id, batch.manufacturer);
      }
    });
    return [...map.values()];
  }, [batches]);

  const defaultManufacturerId =
    user?.manufacturer?._id || manufacturers[0]?._id || "";
  const [activeManufacturerId, setActiveManufacturerId] = useState(defaultManufacturerId);

  const selectedManufacturer =
    manufacturers.find((item) => item._id === activeManufacturerId) || manufacturers[0];
  const filteredBatches = batches.filter(
    (batch) => batch.manufacturer?._id === selectedManufacturer?._id
  );

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 xl:grid-cols-[280px_1fr]">
      <Sidebar
        manufacturers={manufacturers}
        activeId={selectedManufacturer?._id}
        onSelect={setActiveManufacturerId}
      />

      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardContent className="pt-6">
          <Tabs defaultValue="history">
            <TabsList>
              <TabsTrigger value="history">Batch History</TabsTrigger>
              <TabsTrigger value="register">Register New Batch</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="history">
              <BatchTable batches={filteredBatches} />
            </TabsContent>

            <TabsContent value="register">
              <RegisterBatchForm selectedManufacturer={selectedManufacturer} onCreated={onRefresh} />
            </TabsContent>

            <TabsContent value="profile">
              {selectedManufacturer ? (
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-bold text-white"
                      style={{ backgroundColor: selectedManufacturer.color }}
                    >
                      {selectedManufacturer.initials}
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-slate-900">{selectedManufacturer.name}</p>
                      <p className="text-sm text-slate-500">{selectedManufacturer.city}</p>
                    </div>
                    <Badge
                      variant={
                        selectedManufacturer.status === "verified"
                          ? "success"
                          : selectedManufacturer.status === "warning"
                            ? "warning"
                            : "destructive"
                      }
                      className="capitalize"
                    >
                      {selectedManufacturer.status}
                    </Badge>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {[
                      ["CDSCO License", selectedManufacturer.cdscoLicense],
                      ["GST Number", selectedManufacturer.gstNumber],
                      ["Onboarded", new Date(selectedManufacturer.onboardedAt).toLocaleDateString()],
                      ["Total Batches", selectedManufacturer.totalBatches],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
                        <p className="mt-2 font-medium text-slate-900">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-[#0f172a] p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-400">Blockchain Wallet</p>
                    <p className="mt-2 break-all font-mono text-sm text-white">
                      {selectedManufacturer.walletAddress}
                    </p>
                  </div>
                </div>
              ) : null}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
