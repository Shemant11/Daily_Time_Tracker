import { CheckCircle2, Lightbulb } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatMinutes } from "@/utils/time";
import type { ReportData } from "@/services/reports";
import { exportPDF } from "@/services/exportService";

export function ReportCard({ report }: { report: ReportData }) {
  const handleExportPDF = () => {
    const summaryLines = [
      `Range: ${report.rangeLabel}`,
      `Total: ${formatMinutes(report.totalMinutes)}  |  Learning: ${formatMinutes(report.learningMinutes)}  |  Exercise: ${formatMinutes(report.exerciseMinutes)}`,
      `Most productive: ${report.mostProductiveCategory ?? "-"}   Least productive: ${report.leastProductiveCategory ?? "-"}`,
    ];
    const rows = report.categoryBreakdown.map((c) => [c.name, formatMinutes(c.minutes)]);
    exportPDF(report.title, summaryLines, rows, ["Category", "Minutes"]);
  };

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>{report.title}</CardTitle>
          <p className="text-xs text-ink-faint mt-0.5">{report.rangeLabel}</p>
        </div>
        <Button size="sm" variant="secondary" onClick={handleExportPDF}>
          Export PDF
        </Button>
      </CardHeader>
      <CardContent className="pt-0 space-y-5">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-base-soft/60 border border-border/40 p-3">
            <p className="text-xs text-ink-faint">Total</p>
            <p className="font-semibold tabular">{formatMinutes(report.totalMinutes)}</p>
          </div>
          <div className="rounded-xl bg-base-soft/60 border border-border/40 p-3">
            <p className="text-xs text-ink-faint">Learning</p>
            <p className="font-semibold tabular">{formatMinutes(report.learningMinutes)}</p>
          </div>
          <div className="rounded-xl bg-base-soft/60 border border-border/40 p-3">
            <p className="text-xs text-ink-faint">Exercise</p>
            <p className="font-semibold tabular">{formatMinutes(report.exerciseMinutes)}</p>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-ink-faint font-medium mb-2">Category Breakdown</p>
          <div className="space-y-1.5">
            {report.categoryBreakdown.map((c) => (
              <div key={c.name} className="flex justify-between text-sm">
                <span>{c.name}</span>
                <span className="tabular text-ink-muted">{formatMinutes(c.minutes)}</span>
              </div>
            ))}
            {report.categoryBreakdown.length === 0 && <p className="text-sm text-ink-faint">No activity logged.</p>}
          </div>
        </div>

        <div className="flex gap-4 text-sm">
          <p className="flex items-center gap-1.5 text-success">
            <CheckCircle2 size={14} /> Best: {report.mostProductiveCategory ?? "—"}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-ink-faint font-medium mb-2 flex items-center gap-1.5">
            <Lightbulb size={13} /> Suggestions
          </p>
          <ul className="space-y-1.5 text-sm text-ink-muted list-disc pl-4">
            {report.suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
