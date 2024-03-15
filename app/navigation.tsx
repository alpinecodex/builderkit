import Image from "next/image";
import AccountWidget from "@/ui/auth/account-widget";
import NavList from "@/ui/ui/nav-list";

export default function Nav() {
  return (
    <nav className="flex h-screen flex-col justify-between bg-neutral-200 shadow-inner md:p-6">
      <div>
        <div>
          <Image
            src="/logo.svg"
            alt="Builder Kit Logo"
            className="dark:invert mb-8"
            width={144}
            height={24}
          ></Image>
          <div>
            <p className="text-sm"> AI-Enhanced Copywriting</p>
            <p className="mt-2 w-fit rounded-md bg-stone-300 px-1 py-px text-xs">
              Beta 0.2
            </p>
          </div>
        </div>
        <NavList />
      </div>
      <div className="flex flex-col gap-8">
        {/* @ts-expect-error Server Component */}
        <AccountWidget />
        <p className="text-xs text-neutral-500">
          ©{" "}
          <a className="hover:underline" href="https://builderkit.io">
            Builder Kit
          </a>{" "}
          /{" "}
          <a className="hover:underline" href="https://alpinecodex.com">
            ACX
          </a>
          , 2024
        </p>
        <p className="sr-only">
          Created by{" "}
          <a href="https://cameronyoungblood.com">Cameron Youngblood</a> and
          <a href="https://bridger.to">Bridger Tower</a>
        </p>
      </div>
    </nav>
  );
}
