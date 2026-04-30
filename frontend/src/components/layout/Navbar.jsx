import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function Navbar({ tabs, activeTab, setActiveTab, alertCount, user, onLogout }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0f172a]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
          </span>
          <div>
            <p className="text-lg font-semibold text-white">MediVerify</p>
            <p className="text-xs text-slate-400">Counterfeit medicine intelligence ledger</p>
          </div>
        </div>

        <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1 lg:flex">
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm transition",
                  isActive ? "text-white" : "text-slate-400 hover:text-white"
                )}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {tab.label}
                  {tab.key === "alerts" && alertCount > 0 ? (
                    <Badge variant="destructive" className="border-0 bg-red-500/20 text-red-200">
                      {alertCount}
                    </Badge>
                  ) : null}
                </span>
                <AnimatePresence>
                  {isActive ? (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-full bg-white/10"
                    />
                  ) : null}
                </AnimatePresence>
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Badge variant="dark" className="gap-2 rounded-full px-3 py-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
            CDSCO LINKED
          </Badge>
          <div className="hidden text-right md:block">
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs uppercase tracking-wide text-slate-400">{user?.role}</p>
          </div>
          <button
            onClick={onLogout}
            className="rounded-full border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
