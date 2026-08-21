import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import {
  ArrowRight,
  Boxes,
  Database,
  LockKeyhole,
  Server,
  Sparkles,
} from "lucide-react";

const foundations = [
  {
    icon: Boxes,
    title: "One workspace",
    description:
      "Web, API, shared types, and database code in one clean src/ monorepo.",
    path: "src/apps · src/packages",
  },
  {
    icon: LockKeyhole,
    title: "Auth included",
    description:
      "OAuth, secure cookies, protected procedures, and role-ready access control.",
    path: "src/apps/api/src/_core",
  },
  {
    icon: Database,
    title: "Data ready",
    description:
      "Drizzle schemas, reviewed migrations, profiles, and an audit trail already wired.",
    path: "src/packages/database",
  },
];

export default function Home() {
  const { user } = useAuth();
  const statusQuery = trpc.bootstrap.status.useQuery(undefined, {
    enabled: Boolean(user),
    retry: false,
    staleTime: 60_000,
  });
  const isReady = statusQuery.data?.runtime.databaseConfigured;

  return (
    <DashboardLayout>
      <div className="container max-w-6xl space-y-14 pb-10">
        <section className="grid items-center gap-10 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <div className="max-w-2xl space-y-7">
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant="secondary"
                className="rounded-full px-3 py-1 text-xs font-semibold text-secondary-foreground"
              >
                TypeStack starter
              </Badge>
              <span className="text-xs font-medium text-muted-foreground">
                TypeScript · monorepo · ready to build
              </span>
            </div>
            <div className="space-y-5">
              <h1 className="font-serif text-5xl leading-[0.98] tracking-[-0.055em] text-foreground sm:text-6xl lg:text-7xl">
                Ship the idea.
                <br />
                <span className="text-primary">Keep the foundation.</span>
              </h1>
              <p className="max-w-xl text-lg leading-8 text-muted-foreground">
                A clean TypeScript starter with auth, data, APIs, security, and
                a focused workspace already wired for your next product.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-xl px-5 shadow-[var(--shadow-soft)]"
              >
                <a href="#stack" className="gap-2">
                  Explore the stack <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-xl border-border bg-card px-5"
              >
                <a href="#security">See the defaults</a>
              </Button>
            </div>
          </div>

          <Card className="eyu-card relative overflow-hidden rounded-[1.75rem] border-border bg-card/90">
            <div
              className="eyu-dot-grid absolute inset-y-0 right-0 w-1/2 opacity-70"
              aria-hidden="true"
            />
            <div
              className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[oklch(0.83_0.09_274_/_0.3)] blur-3xl"
              aria-hidden="true"
            />
            <CardContent className="relative space-y-8 p-8 sm:p-10">
              <div className="flex items-center justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-soft)]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground">
                  <span
                    className={`h-2 w-2 rounded-full ${isReady ? "bg-primary" : "bg-muted-foreground"}`}
                  />
                  {statusQuery.isLoading
                    ? "Checking"
                    : isReady
                      ? "Ready to build"
                      : "Starter online"}
                </span>
              </div>
              <div className="space-y-3">
                <p className="eyu-kicker">The short version</p>
                <h2 className="font-serif text-3xl leading-tight tracking-[-0.04em] text-foreground">
                  Less setup. More making.
                </h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  The boring-but-important parts are here, so your first commit
                  can be about the product.
                </p>
              </div>
              <div className="space-y-3 border-t border-border pt-5 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Frontend</span>
                  <code className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                    React + Vite
                  </code>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Backend</span>
                  <code className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                    Express + tRPC
                  </code>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Data</span>
                  <code className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                    Drizzle + MySQL
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="stack" className="scroll-mt-8 space-y-6">
          <div className="max-w-2xl space-y-2">
            <p className="eyu-kicker">The foundation</p>
            <h2 className="font-serif text-3xl tracking-[-0.04em] text-foreground sm:text-4xl">
              Everything important is already wired.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {foundations.map(item => (
              <Card
                key={item.title}
                className="eyu-card rounded-2xl border-border bg-card/90 transition-transform hover:-translate-y-0.5"
              >
                <CardHeader className="space-y-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base tracking-[-0.02em]">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <p className="text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                  <code className="inline-flex rounded-md bg-[var(--surface-soft)] px-2 py-1 text-[11px] font-medium text-[var(--content-subtle)]">
                    {item.path}
                  </code>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section
          id="security"
          className="scroll-mt-8 rounded-[1.5rem] border border-primary/15 bg-[var(--surface-tint)] p-7 sm:p-9"
        >
          <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-2xl space-y-3">
              <p className="eyu-kicker text-primary/80">
                Good defaults, visible choices
              </p>
              <h2 className="font-serif text-3xl tracking-[-0.04em] text-foreground">
                Start clean. Stay in control.
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Same-origin sessions, validated inputs, protected APIs, reviewed
                migrations, and rate limits scoped to the API—not the frontend.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-primary/15 bg-background/80 px-4 py-3 text-sm font-medium text-foreground">
              <Server className="h-4 w-4 text-primary" /> Secure by default
            </div>
          </div>
        </section>

        <footer className="flex flex-col justify-between gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <span>TypeStack — a calm place to start building.</span>
          <span className="font-medium text-foreground">
            Your product goes here.
          </span>
        </footer>
      </div>
    </DashboardLayout>
  );
}
