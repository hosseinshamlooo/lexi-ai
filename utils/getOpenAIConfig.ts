import 'server-only';

export const getOpenAIConfig = () => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('Missing required environment variable: OPENAI_API_KEY');
  }

  return {
    apiKey: String(apiKey),
  };
};
