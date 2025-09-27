import { getOpenAIConfig } from "@/utils/getOpenAIConfig";
import dynamic from "next/dynamic";

const Chat = dynamic(() => import("@/components/Chat"), {
  ssr: false,
});

export default async function Page() {
  const { apiKey } = getOpenAIConfig();

  if (!apiKey) {
    throw new Error("Unable to get OpenAI API key");
  }

  return (
    <div className={"grow flex flex-col"}>
      <Chat apiKey={apiKey} />
    </div>
  );
}
