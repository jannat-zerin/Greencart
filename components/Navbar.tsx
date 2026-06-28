'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { siteConfig } from "@/lib/site";
import { useCart } from "@/contexts/CartContext";

const mainLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
 
];

export function Navbar() {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ email: string; role?: string } | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const refreshAuth = async () => {
    setCheckingAuth(true);
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' });
      const data = res.ok ? await res.json() : null;
      setUser(data?.authenticated ? data.user : null);
    } catch {
      setUser(null);
    } finally {
      setCheckingAuth(false);
    }
  };

  useEffect(() => {
    refreshAuth();
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-green-700">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          {siteConfig.name}
        </Link>

        <div className="hidden md:flex items-center gap-0.5 text-sm font-medium text-slate-600">
          {mainLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  isActive ? 'bg-green-50 text-green-700' : 'hover:text-green-700 hover:bg-green-50/50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <Link
            href="/cart"
            className={`relative px-3 py-2 rounded-lg transition-colors ${
              pathname === '/cart' ? 'bg-green-50 text-green-700' : 'hover:text-green-700 hover:bg-green-50/50'
            }`}
          >
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-green-600 text-white text-[11px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-sm ring-2 ring-white">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>

          {!checkingAuth && (
            <div className="ml-2 pl-2 border-l border-slate-200 flex items-center gap-1">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                      pathname === '/profile' ? 'bg-green-50 text-green-700' : 'hover:text-green-700 hover:bg-green-50/50'
                    }`}
                  >
                    Profile
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                        pathname === '/admin' ? 'bg-green-50 text-green-700' : 'hover:text-green-700 hover:bg-green-50/50'
                      }`}
                    >
                      Admin
                    </Link>
                  )}
                  <span className="text-xs text-slate-400 px-2 truncate max-w-28">{user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      pathname === '/login' ? 'bg-green-50 text-green-700' : 'hover:text-green-700 hover:bg-green-50/50'
                    }`}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors shadow-sm"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden relative p-2 rounded-lg text-slate-600 hover:text-green-700 hover:bg-green-50 transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
          {itemCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-green-600 text-white text-[10px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1 shadow-sm ring-2 ring-white">
              {itemCount > 99 ? '99+' : itemCount}
            </span>
          )}
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden border-t border-slate-200/60 bg-white/95 backdrop-blur-md animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {mainLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-green-50 text-green-700' : 'text-slate-600 hover:text-green-700 hover:bg-green-50/50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/cart"
              onClick={() => setMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/cart' ? 'bg-green-50 text-green-700' : 'text-slate-600 hover:text-green-700 hover:bg-green-50/50'
              }`}
            >
              Cart
              {itemCount > 0 && (
                <span className="bg-green-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">{itemCount}</span>
              )}
            </Link>
            <div className="border-t border-slate-100 pt-2 mt-2">
              {user ? (
                <div className="space-y-1">
                  <div className="px-3 py-2 text-xs text-slate-400">{user.email}</div>
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      pathname === '/profile' ? 'bg-green-50 text-green-700' : 'text-slate-600 hover:text-green-700 hover:bg-green-50/50'
                    }`}
                  >
                    Profile
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setMenuOpen(false)}
                      className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        pathname === '/admin' ? 'bg-green-50 text-green-700' : 'text-slate-600 hover:text-green-700 hover:bg-green-50/50'
                      }`}
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                    className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      pathname === '/login' ? 'bg-green-50 text-green-700' : 'text-slate-600 hover:text-green-700 hover:bg-green-50/50'
                    }`}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors text-center"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
