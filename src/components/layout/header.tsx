"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Gauge,
  Store,
  CarFront,
  Home,
  ShoppingCart,
  Heart,
  GitCompareArrows,
  Building2,
  Menu,
  Shield,
  User as UserIcon,
  LogOut,
  Receipt,
} from "lucide-react"
import { useTienda } from "@/store/use-store"
import { useAuth } from "@/lib/auth/auth-context"
import { useFavoritesSync } from "@/lib/auth/use-favorites-sync"
import { useHydrated } from "@/hooks/use-hydrated"
import { ThemeToggle } from "./theme-toggle"
import { ThemeToggleMobile } from "./theme-toggle-mobile"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

// Todos los items de navegación (móvil y desktop comparten la misma lista).
const navItems = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/marketplace", label: "Marketplace", icon: Store },
  { href: "/marcas", label: "Marcas", icon: Building2 },
  { href: "/favoritos", label: "Favoritos", icon: Heart, badgeKey: "favoritos" as const },
  { href: "/comparar", label: "Comparar", icon: GitCompareArrows, badgeKey: "comparar" as const },
  { href: "/garaje", label: "Mi Garaje", icon: CarFront, badgeKey: "garaje" as const },
] as const

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const cantFavoritos = useTienda((s) => s.favoritos.length)
  const cantComparar = useTienda((s) => s.comparar.length)
  const cantGaraje = useTienda((s) => s.garaje.length)
  const cantCarrito = useTienda((s) => s.carrito.length)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const hidratado = useHydrated()
  const { user, isAuthenticated, logout } = useAuth()
  // Hydrate favorites from the DB when authenticated (DB is source of truth).
  useFavoritesSync()

  const cantidades: Record<string, number> = {
    favoritos: cantFavoritos,
    comparar: cantComparar,
    garaje: cantGaraje,
  }

  const estaActivo = (href: string) => {
    if (href === "/") return pathname === "/"
    if (href === "/marketplace") {
      return (
        pathname.startsWith("/marketplace") || pathname.startsWith("/vehiculos")
      )
    }
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5"
          aria-label="Ir al inicio"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/10 transition-transform duration-300 group-hover:scale-105">
            <Gauge className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <span className="hidden flex-col items-start leading-none sm:flex">
            <span className="text-[15px] font-semibold tracking-tight text-foreground">
              Digital <span className="text-gradient">Marketplace</span>
            </span>
            <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Alta Gama
            </span>
          </span>
        </Link>

        {/* Navegación central — desktop (md+): todos los items inline */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon
            const activo = estaActivo(item.href)
            const badge = "badgeKey" in item ? cantidades[item.badgeKey] : 0
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-2 rounded-full px-2.5 py-2 text-sm font-medium transition-colors duration-200 lg:px-3.5",
                  activo
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-label={item.label}
              >
                {activo && (
                  <motion.span
                    layoutId="nav-activo"
                    className="absolute inset-0 rounded-full bg-secondary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className="relative z-10 h-4 w-4" strokeWidth={2} />
                <span className="relative z-10 hidden lg:inline">
                  {item.label}
                </span>
                {badge > 0 && (
                  <span className="relative z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
                    {badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Lado derecho: Theme toggle + Admin + Carrito + Menú hamburguesa */}
        <div className="flex items-center gap-2">
          {/* Theme toggle — oculto en móvil muy pequeño */}
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {/* Admin */}
          <Link
            href={user?.role === "ADMIN" ? "/admin" : "/admin/login"}
            className={cn(
              "hidden h-10 shrink-0 items-center justify-center rounded-lg border border-border/70 px-3 text-sm font-medium transition-all duration-300 hover:text-foreground sm:flex",
              estaActivo("/admin")
                ? "border-border bg-secondary text-foreground"
                : "text-muted-foreground"
            )}
            aria-label="Panel administrativo"
          >
            <Shield className="h-4 w-4" strokeWidth={2} />
            <span className="ml-2 hidden lg:inline">Admin</span>
          </Link>

          {/* Cuenta / Autenticación */}
          {hidratado && isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-border/70 px-2.5 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground sm:px-3"
                  aria-label="Menú de cuenta"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[11px] font-bold uppercase text-primary-foreground">
                    {(user?.name ?? user?.email ?? "?").charAt(0)}
                  </span>
                  <span className="hidden max-w-[90px] truncate lg:inline">
                    {user?.name ?? "Cuenta"}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user?.name ?? "Cuenta"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/perfil" className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" /> Mi perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/pedidos" className="flex items-center gap-2">
                    <Receipt className="h-4 w-4" /> Mis pedidos
                  </Link>
                </DropdownMenuItem>
                {user?.role === "ADMIN" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" /> Panel admin
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => void logout().then(() => router.refresh())}
                  className="flex items-center gap-2 text-[var(--destructive)] focus:text-[var(--destructive)]"
                >
                  <LogOut className="h-4 w-4" /> Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/login"
              className={cn(
                "hidden h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-border/70 px-3 text-sm font-medium transition-all duration-300 hover:text-foreground sm:flex",
                estaActivo("/login")
                  ? "border-border bg-secondary text-foreground"
                  : "text-muted-foreground"
              )}
              aria-label="Iniciar sesión"
            >
              <UserIcon className="h-4 w-4" strokeWidth={2} />
              <span className="hidden lg:inline">Entrar</span>
            </Link>
          )}

          {/* Carrito (destacado a la derecha) */}
          <Link
            href="/carrito"
            className={cn(
              "group relative flex shrink-0 items-center gap-2 rounded-full border px-2.5 py-2 text-sm font-medium transition-all duration-200 sm:px-3.5",
              estaActivo("/carrito")
                ? "border-border bg-secondary text-foreground"
                : "border-border/70 text-muted-foreground hover:border-border hover:text-foreground"
            )}
            aria-label={`Carrito con ${cantCarrito} vehículo(s)`}
          >
            <div className="relative">
              <ShoppingCart className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={2} />
              <AnimatePresence>
                {cantCarrito > 0 && (
                  <motion.span
                    key={cantCarrito}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground"
                  >
                    {cantCarrito}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <span className="hidden xl:inline">Carrito</span>
          </Link>

          {/* Menú hamburguesa — solo móvil.
              Se renderiza solo tras la hidratación para evitar el mismatch
              de IDs generados por Radix entre servidor y cliente. */}
          {hidratado ? (
            <Sheet open={menuAbierto} onOpenChange={setMenuAbierto}>
              <SheetTrigger asChild>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:text-foreground md:hidden"
                  aria-label="Abrir menú de navegación"
                >
                  <Menu className="h-5 w-5" strokeWidth={2} />
                </button>
              </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[280px] border-border bg-background p-0 sm:w-[320px]"
            >
              <SheetHeader className="border-b border-border/60 px-6 py-5">
                <SheetTitle className="text-left text-base font-semibold tracking-tight">
                  Navegación
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 p-4">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const activo = estaActivo(item.href)
                  const badge = "badgeKey" in item ? cantidades[item.badgeKey] : 0
                  return (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                          activo
                            ? "bg-secondary text-foreground"
                            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                        )}
                      >
                        <Icon className="h-5 w-5" strokeWidth={2} />
                        <span className="flex-1">{item.label}</span>
                        {badge > 0 && (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
                            {badge}
                          </span>
                        )}
                      </Link>
                    </SheetClose>
                  )
                })}
                {/* Carrito también en el menú móvil */}
                <SheetClose asChild>
                  <Link
                    href="/carrito"
                    className={cn(
                      "mt-2 flex items-center gap-3 rounded-xl border-t border-border/60 px-4 pt-4 text-sm font-medium transition-colors",
                      estaActivo("/carrito")
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <ShoppingCart className="h-5 w-5" strokeWidth={2} />
                    <span className="flex-1">Carrito</span>
                    {cantCarrito > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
                        {cantCarrito}
                      </span>
                    )}
                  </Link>
                </SheetClose>

                {/* Admin en el menú móvil */}
                <SheetClose asChild>
                  <Link
                    href="/admin/login"
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                      estaActivo("/admin")
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    )}
                  >
                    <Shield className="h-5 w-5" strokeWidth={2} />
                    <span className="flex-1">Admin</span>
                  </Link>
                </SheetClose>

                {/* Cuenta / Pedidos en el menú móvil */}
                {isAuthenticated ? (
                  <>
                    <SheetClose asChild>
                      <Link
                        href="/perfil"
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                          estaActivo("/perfil")
                            ? "bg-secondary text-foreground"
                            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                        )}
                      >
                        <UserIcon className="h-5 w-5" strokeWidth={2} />
                        <span className="flex-1">Mi perfil</span>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/pedidos"
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                          estaActivo("/pedidos")
                            ? "bg-secondary text-foreground"
                            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                        )}
                      >
                        <Receipt className="h-5 w-5" strokeWidth={2} />
                        <span className="flex-1">Mis pedidos</span>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <button
                        onClick={() => void logout().then(() => { setMenuAbierto(false); router.refresh() })}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[var(--destructive)] transition-colors hover:bg-[var(--destructive)]/10"
                      >
                        <LogOut className="h-5 w-5" strokeWidth={2} />
                        <span className="flex-1">Cerrar sesión</span>
                      </button>
                    </SheetClose>
                  </>
                ) : (
                  <SheetClose asChild>
                    <Link
                      href="/login"
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                        estaActivo("/login")
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                      )}
                    >
                      <UserIcon className="h-5 w-5" strokeWidth={2} />
                      <span className="flex-1">Iniciar sesión</span>
                    </Link>
                  </SheetClose>
                )}

                {/* Theme toggle en el menú móvil */}
                <div className="mt-2 border-t border-border/60 px-4 pt-4">
                  <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Tema visual
                  </p>
                  <ThemeToggleMobile />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          ) : (
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 text-muted-foreground md:hidden"
              aria-label="Abrir menú de navegación"
            >
              <Menu className="h-5 w-5" strokeWidth={2} />
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
