import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { formatDateLabel } from "@/services/analytics";
import type { DayAggregate } from "@/types";

export function DailyHoursChart({ data, title = "Daily Hours" }: { data: DayAggregate[]; title?: string }) {
  const chartData = data.map((d) => ({
    date: formatDateLabel(d.date),
    Learning: +(d.learningMinutes / 60).toFixed(2),
    Exercise: +(d.exerciseMinutes / 60).toFixed(2),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="date" stroke="hsl(var(--ink-faint))" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--ink-faint))" fontSize={11} tickLine={false} axisLine={false} unit="h" />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--base-elevated))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 12,
                fontSize: 12,
              }}
            />
            <Bar dataKey="Learning" stackId="a" fill="#818CF8" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Exercise" stackId="a" fill="#FB7185" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
