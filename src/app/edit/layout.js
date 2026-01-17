'use client'

import Link from "next/link";
import { usePathname } from 'next/navigation'

export default function RootLayout({ children }) {
  const pathname = usePathname()

  const navs = [
    {"label": "Edit Profile", "href": "/edit/profile"},
    {"label": "Setting","href": "/edit/setting"}
  ]

  return (
    <main className="relative">
      <nav className="flex capitalize gap-5 text-xl text-center sticky top-22 z-50 bg-bg-main w-full">
        {
          navs.map((nav, i) => (
          <Link
            key={i}
            href={nav.href}
            className={`px-5 py-3 ${pathname === nav.href ? 'bg-bg-second text-text-main rounded-t-xl rounded-b-none' : 'text-text-second hover:text-text-main'}`}
          >
            {nav.label}
          </Link>
          ))
        }
      </nav>
      {children}
    </main>
  )
}
