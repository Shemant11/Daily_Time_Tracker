import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  BarChart3,
  FileText,
  Trophy,
  Settings,
  History,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/utils/cn";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/statistics", label: "Statistics", icon: BarChart3 },
  { to: "/sessions", label: "Sessions", icon: History },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/achievements", label: "Achievements", icon: Trophy },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border/60 bg-base-soft/40 backdrop-blur-xl">
      <div className="flex items-center gap-2.5 px-6 h-16 border-b border-border/60">
        <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center">
          <GraduationCap className="text-accent" size={20} />
        </div>
        <div>
          <p className="font-display font-semibold text-sm leading-tight">Learning Time</p>
          <p className="font-display font-semibold text-sm leading-tight text-accent">Tracker</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent/15 text-accent"
                  : "text-ink-muted hover:bg-base-elevated hover:text-ink"
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-border/60">
        <p className="text-[11px] text-ink-faint leading-relaxed">
          Discipline compounds daily.
          <br />
          Track it. Trust it.
        </p>
      </div>
    </aside>
  );
}
