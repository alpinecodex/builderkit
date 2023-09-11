import Image from "next/image";
import Link from "next/link";

import { Archive, Pencil, Settings, ArrowRight } from "lucide-react";

const links = [
  {
    title: "Editor",
    href: "/",
    icon: <Pencil />,
  },
  {
    title: "Drafts",
    href: "/",
    icon: <Archive />,
  },
  {
    title: "Settings",
    href: "/",
    icon: <Settings />,
  },
];

export default function Nav() {
  return (
    <nav className="fixed left-0 top-0 flex h-screen w-1/4 flex-col justify-between bg-neutral-200 shadow-inner md:p-8">
      <div>
        <div>
          <Image
            src="./logo.svg"
            alt="Builder Kit Logo"
            width={200}
            height={100}
          ></Image>
          <p className="mt-2">
            <small>AI-Powered Copy Writing</small>
          </p>
        </div>
        <div className="mt-12 flex flex-col justify-between gap-4 text-lg">
          {links.map((link) => (
            <Link
              className="group flex items-center justify-between rounded-lg border border-stone-300 px-3 py-2 text-stone-600 hover:bg-stone-300 hover:text-stone-900"
              href={link.href}
              key={link.title}
            >
              <div className="flex items-center gap-2">
                {link.icon}
                {link.title}
              </div>
              <ArrowRight className="hidden text-stone-400 group-hover:block" />
            </Link>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {/* Put Account Information Here */}
        <p className="underline">Account Information</p>
        <p className="text-sm text-neutral-500">
          Created by <a href="https://alpinecodex.com">Alpine Codex</a>.
        </p>
        <p className="text-sm text-neutral-500">
          © Builder Kit, 2023. All Rights Reserved.
        </p>
      </div>
    </nav>
  );
}
