import Image from "next/image";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import SignIn from "@/ui/auth/sign-in";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }
  return (
    <>
      <div className="flex items-center justify-center">
        <div className="space-y-10 p-8 md:p-20">
          <Image
            src="./logo.svg"
            alt="Builder Kit Logo"
            width={200}
            height={100}
          ></Image>
          <div className="flex flex-col items-center space-y-6">
            <p className="text-center">Login to access</p>
            <SignIn />
          </div>
        </div>
      </div>
    </>
  );
}
