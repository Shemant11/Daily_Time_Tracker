import { NavLink } from "react-router-dom";
import { LayoutDashboard, CalendarDays, BarChart3, FileText, Settings } from "lucide-react";
import { cn } from "@/utils/cn";

const links = [
  { to: "/", label: "Home", icon: LayoutDashboard },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/statistics", label: "Stats", icon: BarChart3 },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-border/60 bg-base-soft/90 backdrop-blur-xl flex justify-around py-2">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium",
              isActive ? "text-accent" : "text-ink-faint"
            )
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
