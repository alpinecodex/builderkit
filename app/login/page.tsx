import Image from "next/image";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import SignIn from "@/ui/auth/sign-in";
import Link from "next/link";
import Icon from "@/public/icon.svg";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center bg-neutral-100">
      <div className="flex flex-col items-center gap-8 rounded-lg border bg-neutral-50 p-8 shadow-sm md:p-12">
        <Image
          className="rounded-md border shadow-sm"
          src={Icon}
          alt="BuilderKit "
          width={50}
          height={72}
        ></Image>
        <Image
          src="./logo.svg"
          alt="Builder Kit Logo"
          width={200}
          height={100}
        ></Image>
        <p className="text-center">Login to access your account.</p>

        <div className="flex flex-col items-center gap-4">
          <SignIn />
          <p>
            <small className="opacity-60">
              You will be redirected to sign in with Google.
            </small>
          </p>
        </div>
      </div>
      <p className="mt-4 max-w-xs text-center text-sm md:mb-24">
        By signing up for BuilderKit you agree to our{" "}
        <Link className="underline underline-offset-4" href="/">
          Privacy Policy
        </Link>
        .
      </p>
    </main>
  );
}
