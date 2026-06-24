import Link from 'next/link';
import { siteConfig } from '@/lib/site';

const footerLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Cart', href: '/cart' },
  { label: 'Profile', href: '/profile' },
  { label: 'Admin', href: '/admin' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200/60 bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-12 sm:py-16">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold text-green-700">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              {siteConfig.name}
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              {siteConfig.description}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 hover:text-green-700 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Connect
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Fresh, organic products delivered to your door across Bangladesh. Follow us for updates and seasonal specials.
            </p>
            <div className="flex items-center gap-3">
              <span className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 hover:bg-green-200 transition-colors cursor-pointer">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
              </span>
              <span className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 hover:bg-green-200 transition-colors cursor-pointer">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </span>
              <span className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 hover:bg-green-200 transition-colors cursor-pointer">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>&copy; {year} {siteConfig.name}. All rights reserved.</p>
          <p>
            Built with{' '}
            <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 transition-colors">
              Next.js
            </a>
            {' '}&amp;{' '}
            <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 transition-colors">
              Tailwind CSS
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
