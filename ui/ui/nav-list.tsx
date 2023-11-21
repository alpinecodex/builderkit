"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Archive,
  Pencil,
  Settings,
  File,
  Bug,
  ExternalLink,
} from "lucide-react";

const links = [
  {
    title: "Editor",
    href: "/",
    icon: <Pencil />,
  },
  {
    title: "Drafts",
    href: "/drafts",
    icon: <Archive />,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings />,
  },
];

const outsideLinks = [
  {
    title: "Documentation",
    href: "https://alpinecodex.notion.site/BuilderKit-606cfdb918ea401aab21e0ec7109c595?pvs=4",
    icon: <File />,
  },
  {
    title: "Report an Issue",
    href: "https://tally.so/r/n9ZaBQ",
    icon: <Bug />,
  },
];

export default function NavList() {
  const pathname = usePathname();
  return (
    <div className="mt-12 flex flex-col justify-between gap-4">
      {links.map((link) => (
        <Link
          className={`group flex items-center justify-between rounded-lg border border-stone-300 p-2 text-stone-600 hover:bg-stone-300 hover:text-stone-900 ${
            (pathname.includes("drafts") && link.href === "/drafts") ||
            pathname === link.href
              ? "cursor-default bg-stone-300 text-stone-900"
              : ""
          }`}
          href={link.href}
          key={link.title}
        >
          <div className="flex items-center gap-2">
            {link.icon}
            {link.title}
          </div>
        </Link>
      ))}
      {outsideLinks.map((link) => (
        <Link
          className={`group flex items-center justify-between rounded-lg border border-stone-300 p-2 text-stone-600 hover:bg-stone-300 hover:text-stone-900 ${
            (pathname.includes("drafts") && link.href === "/drafts") ||
            pathname === link.href
              ? "cur bg-stone-300 text-stone-900"
              : ""
          }`}
          href={link.href}
          key={link.title}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex items-center gap-2">
            {link.icon}
            {link.title}
          </div>
          <ExternalLink className="hidden w-4 text-stone-400 group-hover:block" />
        </Link>
      ))}
    </div>
  );
}
