import Image from "next/image";
import Link from "next/link";

export default function Nav() {
  return (
    <nav className="fixed left-0 top-0 flex h-screen w-1/4 flex-col justify-between bg-neutral-200 shadow-inner md:p-12">
      <div>
        <Image
          src="./logo.svg"
          alt="Builder Kit Logo"
          width={200}
          height={100}
        ></Image>
        <div className="mt-12 flex flex-col justify-between gap-2 text-lg">
          <Link
            href={"/"}
            className="group underline underline-offset-4 transition-all"
          >
            Editor
          </Link>
          <Link
            href={"/"}
            className="group transition-all hover:bg-neutral-300 hover:pl-1"
          >
            Drafts
            <span className="ml-2 hidden group-hover:inline">&rarr;</span>{" "}
          </Link>
          <Link
            href={"/"}
            className="group transition-all hover:bg-neutral-300 hover:pl-1"
          >
            Prompts
            <span className="ml-2 hidden group-hover:inline">&rarr;</span>{" "}
          </Link>
          <Link
            href={"/"}
            className="group transition-all hover:bg-neutral-300 hover:pl-1"
          >
            Account
            <span className="ml-2 hidden group-hover:inline">&rarr;</span>{" "}
          </Link>
          <Link
            href={"/"}
            className="group transition-all hover:bg-neutral-300 hover:pl-1"
          >
            Settings{" "}
            <span className="ml-2 hidden group-hover:inline">&rarr;</span>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-12">
        <div className="flex items-center gap-4 rounded-lg bg-neutral-300 p-4 hover:opacity-50">
          <div className="h-12 w-12 rounded-full bg-neutral-500"></div>
          <p>Account</p>
        </div>
        <p className="text-sm text-neutral-500">
          © Builder Kit, 2023. All Rights Reserved.
        </p>
      </div>
    </nav>
  );
}
