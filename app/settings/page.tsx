import Menu from "../menu";
import Nav from "../navigation";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import SettingsForm from "../../ui/settings/settings-form";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/");
  }
  return (
    <>
      <div className="flex">
        <Nav />
        <SettingsForm />
      </div>
      <Menu />
    </>
  );
}
