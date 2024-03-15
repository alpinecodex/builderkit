import Image from "next/image";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import SignIn from "@/ui/auth/sign-in";
import Link from "next/link";
import Icon from "@/public/icon.svg";
import MagicLinkForm from "@/ui/auth/magic-link-form";
import { Separator } from "@/ui/ui/separator";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }
  return (
    <section className="fixed left-0 right-0 top-0 flex h-screen w-full flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-8 rounded-lg border bg-accent p-8 shadow-sm md:p-12">
        <Image
          className="rounded-md border shadow-sm"
          src={Icon}
          alt="BuilderKit "
          width={50}
          height={50}
        ></Image>
        <Image
          src="./logo.svg"
          className="dark:invert"
          alt="Builder Kit Logo"
          width={200}
          height={33.3}
        ></Image>
        <p className="text-center">Login to access your account.</p>

        <div className="flex flex-col items-center gap-4">
          <SignIn />
          <p>
            <small className="opacity-60">
              You will be redirected to sign in with Google.
            </small>
          </p>
          <Separator />
          <MagicLinkForm />
        </div>
      </div>

      <p className="mt-4 max-w-xs text-center text-sm opacity-60 md:mb-24">
        By signing up for BuilderKit you agree to our{" "}
        <Link className="underline underline-offset-4" href="/">
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link className="underline underline-offset-4" href="/">
          Terms of Service
        </Link>
        .
      </p>
    </section>
  );
}
