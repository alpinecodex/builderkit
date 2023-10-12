import SettingsInput from "./settings-input";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SettingsSelect from "./settings-select";

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
    attribute: "winstonAiKey",
    title: "WinstonAI API Key",
    placeholder: "WinstonAI API Key...",
    description: "Enter your WinstonAI API Key.",
  },
  {
    attribute: "winstonAiToken",
    title: "WinstonAI API Token",
    placeholder: "WinstonAI API Token...",
    description: "Enter your WinstonAI API Token.",
  },
  {
    attribute: "serpApiKey",
    title: "SERP API Key",
    placeholder: "SERP API Key...",
    description: "Enter your SERP API Key.",
  },
];

const wpInputs = [
  {
    attribute: "wordpressUrl",
    title: "WordPress URL",
    placeholder: "WordPress URL...",
    description: "Enter your WordPress URL.",
  },
  {
    attribute: "wordpressUsername",
    title: "WordPress Username",
    placeholder: "WordPress Username...",
    description: "Enter your WordPress Username.",
  },
  {
    attribute: "wordpressPassword",
    title: "WordPress Password",
    placeholder: "WordPress Password...",
    description: "Enter your WordPress Password.",
  },
];

export default async function SettingsForm() {
  const session = (await getServerSession(authOptions)) as Session;
  const { email } = session?.user;

  const data = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  return (
    <div
      suppressHydrationWarning
      className="absolute right-0 top-0 flex min-h-screen w-3/4 justify-center border-neutral-200 sm:mb-[calc(20vh)]"
    >
      <div className="mx-auto w-full max-w-md py-24">
        <h1 className="mb-8 text-3xl">Settings</h1>
        <h2 className="mb-2 text-xl text-stone-400">API Keys</h2>
        <hr className="mb-4" />
        {inputs.map((input, index) => (
          <SettingsInput
            key={index}
            attribute={input?.attribute}
            title={input?.title}
            placeholder={input?.placeholder}
            description={input?.description}
            defaultValue={data?.[input?.attribute]}
          />
        ))}

        <h2 className="mb-2 mt-8 text-xl text-stone-400">
          Wordpress Credentials
        </h2>
        <hr className="mb-4" />
        {wpInputs.map((input, index) => (
          <SettingsInput
            key={index}
            attribute={input?.attribute}
            title={input?.title}
            placeholder={input?.placeholder}
            description={input?.description}
            defaultValue={data?.[input?.attribute]}
          />
        ))}

        <h2 className="mb-2 mt-8 text-xl text-stone-400">GPT Default Model</h2>
        <hr className="mb-4" />
        <SettingsSelect defaultValue={data?.gptModel} />
      </div>
    </div>
  );
}
