import Menu from "../menu";
import Nav from "../navigation";
import { getServerSession, Session } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import SettingsForm from "../../ui/settings/settings-form";

export default async function Page() {
  const session = (await getServerSession(authOptions)) as Session;

  if (!session) {
    redirect("/login");
  }
  return (
    <>
      <div className="flex">
        <Nav />
        {/* @ts-expect-error Server Component */}
        <SettingsForm />
      </div>
      <Menu />
    </>
  );
}
