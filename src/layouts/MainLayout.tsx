import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";

export function MainLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 pb-24 lg:pb-6">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
