import { getOpenAIConfig } from "@/utils/getOpenAIConfig";
import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import { OpenAIVoiceProvider } from "@/components/OpenAIVoiceProvider";

const Chat = dynamic(() => import("@/components/Chat"), { ssr: false });

export default async function Page() {
  const { apiKey } = getOpenAIConfig();
  const voice = process.env["NEXT_PUBLIC_OPENAI_VOICE"] || "onyx";

  if (!apiKey) throw new Error("Unable to get OpenAI API key");

  return (
    <OpenAIVoiceProvider>
      <div className="flex flex-col">
        <Hero apiKey={apiKey} voice={voice} />
        <Chat apiKey={apiKey} />
      </div>
    </OpenAIVoiceProvider>
  );
}
