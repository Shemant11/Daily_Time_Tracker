import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { formatDateLabel } from "@/services/analytics";
import type { DayAggregate } from "@/types";

export function ExerciseTrendChart({ data }: { data: DayAggregate[] }) {
  const chartData = data.map((d) => ({
    date: formatDateLabel(d.date),
    Minutes: Math.round(d.exerciseMinutes),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exercise Trend</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="date" stroke="hsl(var(--ink-faint))" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--ink-faint))" fontSize={11} tickLine={false} axisLine={false} unit="m" />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--base-elevated))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 12,
                fontSize: 12,
              }}
            />
            <Line type="monotone" dataKey="Minutes" stroke="#FB7185" strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
