import Link from "next/link";

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
    icon: <Pencil size={20} />,
  },
  {
    title: "Drafts",
    href: "/drafts",
    icon: <Archive size={20} />,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings size={20} />,
  },
];

const outsideLinks = [
  // {
  //   title: "Documentation",
  //   href: "https://alpinecodex.notion.site/BuilderKit-606cfdb918ea401aab21e0ec7109c595?pvs=4",
  //   icon: <File size={20} />,
  // },
  {
    title: "Report an Issue",
    href: "https://tally.so/r/n9ZaBQ",
    icon: <Bug size={20} />,
  },
];

export default function NavList() {
  return (
    <div className="mt-12 flex flex-col justify-between gap-2 text-sm">
      {links.map((link) => (
        <Link
          className={`group flex items-center justify-between rounded-lg border p-2 transition-all hover:pl-3`}
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
          className={`group flex items-center justify-between rounded-lg border p-2 transition-all hover:pl-3`}
          href={link.href}
          key={link.title}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex items-center gap-2">
            {link.icon}
            {link.title}
          </div>
          <ExternalLink className="hidden h-4 w-4 text-accent-foreground group-hover:block" />
        </Link>
      ))}
    </div>
  );
}
