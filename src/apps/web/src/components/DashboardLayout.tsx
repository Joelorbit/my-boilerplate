import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { startLogin } from "@/const";
import { useIsMobile } from "@/hooks/useMobile";
import { LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";
import { useLocation } from "wouter";
import { BrandMark } from "./BrandMark";
import { DashboardLayoutSkeleton } from "./DashboardLayoutSkeleton";
import { Button } from "./ui/button";

const navigation = [
  { icon: LayoutDashboard, label: "Overview", path: "/" },
  { icon: ShieldCheck, label: "Security baseline", path: "/#security" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, user } = useAuth();

  if (loading) return <DashboardLayoutSkeleton />;

  if (!user) {
    return (
      <main className="grid min-h-screen place-items-center p-5">
        <section className="eyu-card w-full max-w-lg overflow-hidden rounded-[1.35rem]">
          <div className="eyu-dot-grid border-b border-border bg-[var(--surface-soft)] p-8 sm:p-10">
            <BrandMark />
          </div>
          <div className="space-y-7 p-8 sm:p-10">
            <div className="space-y-3">
              <p className="eyu-kicker">Secure application workspace</p>
              <h1 className="font-serif text-3xl tracking-[-0.035em] text-foreground sm:text-4xl">
                Start with a dependable foundation.
              </h1>
              <p className="max-w-md text-sm leading-6 text-muted-foreground">
                Sign in to inspect the authenticated starter, typed procedures,
                database model, and security defaults.
              </p>
            </div>
            <Button
              onClick={startLogin}
              size="lg"
              className="w-full gap-2 rounded-xl shadow-[var(--shadow-soft)]"
            >
              Continue with secure sign-in
            </Button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <SidebarProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SidebarProvider>
  );
}

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const isMobile = useIsMobile();

  return (
    <>
      <Sidebar
        className="border-r border-sidebar-border bg-sidebar/95 backdrop-blur-xl"
        collapsible="icon"
      >
        <SidebarHeader className="h-[76px] justify-center border-b border-sidebar-border px-3">
          <div className="group-data-[collapsible=icon]:hidden">
            <BrandMark />
          </div>
          <div className="hidden group-data-[collapsible=icon]:block">
            <BrandMark compact />
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3 py-5">
          <p className="eyu-kicker px-2 pb-2 group-data-[collapsible=icon]:hidden">
            Workspace
          </p>
          <SidebarMenu>
            {navigation.map(item => {
              const active =
                item.path === "/" ? location === "/" : location === "/";
              return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    isActive={active}
                    onClick={() => {
                      if (item.path.startsWith("/#")) {
                        document
                          .querySelector(item.path.slice(1))
                          ?.scrollIntoView({ behavior: "smooth" });
                        return;
                      }
                      setLocation(item.path);
                    }}
                    tooltip={item.label}
                    className="h-11 rounded-xl px-3 font-medium"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring group-data-[collapsible=icon]:justify-center">
                <Avatar className="h-9 w-9 border border-border bg-background">
                  <AvatarFallback className="bg-secondary text-xs font-semibold text-secondary-foreground">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {user?.name || "Signed-in user"}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {user?.email || "Account active"}
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              <DropdownMenuItem
                onClick={logout}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="bg-transparent">
        {isMobile ? (
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-xl">
            <SidebarTrigger className="h-9 w-9 rounded-xl border border-border bg-card" />
            <BrandMark />
          </header>
        ) : null}
        <main className="min-h-screen p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </>
  );
}
