import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import QRCode from "qrcode";
import api from "@/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialForm = {
  drugName: "",
  batchId: "",
  mfgDate: "",
  expDate: "",
  quantity: "",
  storageCondition: "",
  nablCertNo: "",
  dlLicense: "",
  plantAddress: "",
  qcStatus: "passed",
};

export default function RegisterBatchForm({ selectedManufacturer, onCreated }) {
  const [form, setForm] = useState(initialForm);
  const [qrPreview, setQrPreview] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!form.batchId) {
      setQrPreview("");
      return;
    }

    QRCode.toDataURL(form.batchId).then(setQrPreview).catch(() => setQrPreview(""));
  }, [form.batchId]);

  const handleChange = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("submitting");

    try {
      await api.post("/batches", {
        ...form,
        quantity: Number(form.quantity),
        manufacturer: selectedManufacturer?._id,
      });
      setForm(initialForm);
      setStatus("success");
      onCreated?.();
      setTimeout(() => setStatus(""), 2200);
    } catch (error) {
      setStatus(error.response?.data?.message || "Failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Input placeholder="Drug Name" value={form.drugName} onChange={(e) => handleChange("drugName", e.target.value)} />
        <Input placeholder="Batch Number" value={form.batchId} onChange={(e) => handleChange("batchId", e.target.value)} />
        <Input type="date" value={form.mfgDate} onChange={(e) => handleChange("mfgDate", e.target.value)} />
        <Input type="date" value={form.expDate} onChange={(e) => handleChange("expDate", e.target.value)} />
        <Input type="number" placeholder="Quantity" value={form.quantity} onChange={(e) => handleChange("quantity", e.target.value)} />
        <Input placeholder="Storage Condition" value={form.storageCondition} onChange={(e) => handleChange("storageCondition", e.target.value)} />
        <Input placeholder="NABL Cert No." value={form.nablCertNo} onChange={(e) => handleChange("nablCertNo", e.target.value)} />
        <Input placeholder="DL License" value={form.dlLicense} onChange={(e) => handleChange("dlLicense", e.target.value)} />
        <Input
          placeholder="Manufacturing Site"
          className="md:col-span-2"
          value={form.plantAddress}
          onChange={(e) => handleChange("plantAddress", e.target.value)}
        />
        <Select value={form.qcStatus} onValueChange={(value) => handleChange("qcStatus", value)}>
          <SelectTrigger className="md:col-span-2">
            <SelectValue placeholder="QC Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="passed">Passed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="h-11 bg-[#1d4ed8] text-white hover:bg-[#1e40af]">
        Submit to Blockchain ↗
      </Button>
      <p className="text-sm text-slate-500">
        Batch will be immutably recorded on the audit ledger and synced to CDSCO.
      </p>

      {status === "success" ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
        >
          Batch registered successfully and committed on-chain.
        </motion.div>
      ) : status && status !== "submitting" ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {status}
        </div>
      ) : null}

      {qrPreview ? (
        <Card className="border border-slate-200 bg-slate-50">
          <CardContent className="flex items-center gap-4 pt-4">
            <img src={qrPreview} alt="Batch QR" className="h-24 w-24 rounded-xl border border-slate-200 bg-white p-2" />
            <div>
              <p className="font-medium text-slate-900">QR preview</p>
              <p className="text-sm text-slate-500">{form.batchId}</p>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </form>
  );
}
