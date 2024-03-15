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
    <section className="mx-4 h-auto max-w-2xl pt-24 sm:mx-auto">
      <h1 className="mb-8 text-3xl">Settings</h1>
      <h2 className="mb-2 text-xl text-muted-foreground">API Keys</h2>
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

      <h2 className="mb-2 mt-8 text-xl text-muted-foreground">
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

      <h2 className="mb-2 mt-8 text-xl text-muted-foreground">
        GPT Default Model
      </h2>
      <hr className="mb-4" />
      <SettingsSelect defaultValue={data?.gptModel} />
    </section>
  );
}
