import Image from "next/image";
import AccountWidget from "@/ui/auth/account-widget";
import NavList from "@/ui/ui/nav-list";

export default function Nav() {
  return (
    <nav className="fixed left-0 top-0 flex h-screen w-1/4 flex-col justify-between bg-neutral-200 shadow-inner md:p-8">
      <div>
        <div>
          <Image
            src="/logo.svg"
            alt="Builder Kit Logo"
            width={200}
            height={100}
          ></Image>

          <p className="mt-2">
            <small className="mt-4 w-fit rounded-md bg-stone-300 px-1 py-px">
              Beta 0.1.4
            </small>
            <small> AI-Enhanced Copywriting</small>
          </p>
        </div>
        <NavList />
      </div>
      <div className="flex flex-col gap-2">
        {/* @ts-expect-error Server Component */}
        <AccountWidget />
        <p className="mt-4 text-xs text-neutral-500">
          Created by{" "}
          <a className="hover:underline" href="https://alpinecodex.com">
            Alpine Codex
          </a>
          .
        </p>
        <p className="text-xs text-neutral-500">
          ©{" "}
          <a className="hover:underline" href="https://builderkit.io">
            Builder Kit
          </a>{" "}
          | All Rights Reserved.
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
