/**
 * Admin app shell — collapsible sidebar + header, wraps every /admin/* route.
 */
import { PropsWithChildren } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Activity,
  AlertTriangle,
  Bell,
  Database,
  FileSearch,
  FlaskConical,
  Gauge,
  History,
  KeyRound,
  Layers,
  LayoutDashboard,
  ListChecks,
  Map as MapIcon,
  RefreshCw,
  Shield,
  ShieldCheck,
  Upload,
} from "lucide-react";

type NavItem = { title: string; url: string; icon: typeof Activity };

const groups: Array<{ label: string; items: NavItem[] }> = [
  {
    label: "Security & ops",
    items: [
      { title: "SOC Watch", url: "/admin/soc-watch", icon: Shield },
      { title: "Ops", url: "/admin/ops", icon: Activity },
      { title: "Performance", url: "/admin/performance", icon: Gauge },
      { title: "Audit console", url: "/admin/audit-console", icon: FileSearch },
      { title: "Change log", url: "/admin/change-log", icon: History },
      { title: "Alert routing", url: "/admin/alert-routing", icon: Bell },
    ],
  },
  {
    label: "Data",
    items: [
      { title: "Test dashboard", url: "/admin/test-dashboard", icon: LayoutDashboard },
      { title: "Scrapers", url: "/admin/scrapers", icon: RefreshCw },
      { title: "Test mapper", url: "/admin/test-mapper", icon: MapIcon },
      { title: "Biomarker audit", url: "/admin/biomarker-audit", icon: FlaskConical },
      { title: "Biomarker validation", url: "/admin/biomarker-validation", icon: ListChecks },
      { title: "Data refresh", url: "/admin/data-refresh", icon: Database },
      { title: "Test upload", url: "/admin/test-upload", icon: Upload },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Encryption status", url: "/admin/encryption-status", icon: KeyRound },
      { title: "Security diff", url: "/admin/security-diff", icon: ShieldCheck },
      { title: "Control centre", url: "/control", icon: Layers },
    ],
  },
];

function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const isActive = (url: string) => pathname === url || pathname.startsWith(url + "/");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-2">
        <NavLink to="/admin/soc-watch" className="flex items-center gap-2 text-sm font-semibold">
          <AlertTriangle className="h-4 w-4 text-primary" />
          {!collapsed && <span>Admin</span>}
        </NavLink>
      </SidebarHeader>
      <SidebarContent>
        {groups.map((g) => (
          <SidebarGroup key={g.label}>
            {!collapsed && <SidebarGroupLabel>{g.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                      <NavLink to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span className="truncate">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}

export function AdminShell({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center gap-2 border-b px-2 sticky top-0 bg-background z-10">
            <SidebarTrigger />
            <span className="text-xs text-muted-foreground">myhealth checkup · admin</span>
          </header>
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
