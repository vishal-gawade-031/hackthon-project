import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function BatchTable({ batches }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead>Batch ID</TableHead>
            <TableHead>Drug</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Mfg Date</TableHead>
            <TableHead>Expiry</TableHead>
            <TableHead>QC Status</TableHead>
            <TableHead>Blockchain</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {batches.map((batch) => (
            <TableRow key={batch._id}>
              <TableCell className="font-medium">{batch.batchId}</TableCell>
              <TableCell>{batch.drugName}</TableCell>
              <TableCell>{batch.quantity.toLocaleString()}</TableCell>
              <TableCell>{new Date(batch.mfgDate).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(batch.expDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    batch.qcStatus === "passed"
                      ? "success"
                      : batch.qcStatus === "failed"
                        ? "destructive"
                        : "warning"
                  }
                  className="capitalize"
                >
                  {batch.qcStatus}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="success">✓ on-chain</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
