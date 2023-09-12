import SettingsInput from "./settings-input";
import { getServerSession, Session } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const inputs = [
  {
    attribute: "openAiKey",
    title: "OpenAI API Key",
    placeholder: "OpenAI API Key...",
    description: "Enter your OpenAI API Key.",
  },
  {
    attribute: "anthropicKey",
    title: "Anthropic API Key",
    placeholder: "Claude API Key...",
    description: "Enter your Claude API Key.",
  },
  {
    attribute: "wordpressKey",
    title: "WordPress API Key",
    placeholder: "WordPress API Key...",
    description: "Enter your WordPress API Key.",
  },
  {
    attribute: "copyLeaksKey",
    title: "CopyLeaks API Key",
    placeholder: "CopyLeaks API Key...",
    description: "Enter your CopyLeaks API Key.",
  },
];

export default async function SettingsForm() {
  const session = (await getServerSession(authOptions)) as Session;
  const { email } = session?.user;

  if (!session) {
    redirect("/login?callbackUrl=/");
  }

  const data = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  return (
    <div className="absolute right-0 top-0 flex min-h-screen w-3/4 justify-center border-neutral-200 sm:mb-[calc(20vh)]">
      <div className="w-3/4 max-w-[500px] py-24">
        <h1 className="mb-6 text-3xl">Settings</h1>
        {inputs.map((input, index) => (
          <SettingsInput
            key={index}
            attribute={input.attribute}
            title={input.title}
            placeholder={input.placeholder}
            description={input.description}
            defaultValue={data[input.attribute]}
          />
        ))}
      </div>
    </div>
  );
}
