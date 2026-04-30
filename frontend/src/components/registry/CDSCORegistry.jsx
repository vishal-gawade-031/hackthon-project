import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const inferCategory = (drugName) => {
  if (/amoxicillin|cefixime/i.test(drugName)) return "Antibiotics";
  if (/metformin/i.test(drugName)) return "Antidiabetic";
  if (/vaccine/i.test(drugName)) return "Vaccines";
  return "General";
};

export default function CDSCORegistry({ batches }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const rows = useMemo(() => {
    const unique = new Map();
    batches.forEach((batch) => {
      if (!unique.has(batch.batchId)) {
        unique.set(batch.batchId, {
          drugName: batch.drugName,
          manufacturer: batch.manufacturer?.name || "-",
          dlNumber: batch.dlLicense,
          category: inferCategory(batch.drugName),
          expiry: batch.expDate,
          status: batch.qcStatus === "passed" ? "verified" : "pending",
        });
      }
    });
    return [...unique.values()];
  }, [batches]);

  const filteredRows = rows.filter((row) => {
    const matchesQuery =
      row.drugName.toLowerCase().includes(query.toLowerCase()) ||
      row.manufacturer.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "All" || row.category === category;
    return matchesQuery && matchesCategory;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>CDSCO Registry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-[1fr_220px]">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search medicines or manufacturers"
            />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Filter category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Antibiotics">Antibiotics</SelectItem>
                <SelectItem value="Antidiabetic">Antidiabetic</SelectItem>
                <SelectItem value="Vaccines">Vaccines</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>Drug Name</TableHead>
                  <TableHead>Manufacturer</TableHead>
                  <TableHead>DL Number</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRows.map((row) => (
                  <TableRow key={`${row.drugName}-${row.dlNumber}`}>
                    <TableCell className="font-medium">{row.drugName}</TableCell>
                    <TableCell>{row.manufacturer}</TableCell>
                    <TableCell>{row.dlNumber}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{new Date(row.expiry).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={row.status === "verified" ? "success" : "warning"}>
                        {row.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
