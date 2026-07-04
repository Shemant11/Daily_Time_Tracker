import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import type { Category, Session } from "@/types";

export function DistributionPie({ sessions, categories }: { sessions: Session[]; categories: Category[] }) {
  const data = categories
    .map((c) => ({
      name: c.name,
      value: +(sessions.filter((s) => s.categoryId === c.id).reduce((sum, s) => sum + s.durationSeconds, 0) / 3600).toFixed(2),
      color: c.color,
    }))
    .filter((d) => d.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Distribution</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 h-64">
        {data.length === 0 ? (
          <p className="text-sm text-ink-faint h-full flex items-center justify-center">No data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {data.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--base-elevated))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
