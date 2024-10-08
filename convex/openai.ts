import { OpenAI } from "openai";
import { internalAction } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";

type ChatParams = {
  messages: Doc<"messages">[];
  messageId: Id<"messages">;
};
export const chat = internalAction({
  handler: async (ctx, { messages, messageId }: ChatParams) => {
    const apiKey = process.env.OPENAI_API_KEY!;
    const openai = new OpenAI({ apiKey });

    try {
      const stream = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", 
        stream: true,
        messages: [
          {
            role: "system",
            content: "You are empathetic and responding to questions your long-time friend has about their medical report. You give succint responses but are open to explaining more if the user asks you to elaborate. Your friend is anxious about the healthcare system and so do not give information with too much medical jargon. ",
          },
          ...messages.map(({ body, author }) => ({
            role:
              author === "Dr. Pepe" ? ("assistant" as const) : ("user" as const),
            content: body,
          })),
        ],
        max_tokens: 150,
      });
      let body = "";
      for await (const part of stream) {
        if (part.choices[0].delta?.content) {
          body += part.choices[0].delta.content;
          // Alternatively you could wait for complete words / sentences.
          // Here we send an update on every stream message.
          await ctx.runMutation(internal.messages.update, {
            messageId,
            body,
          });
        }
      }
    } catch (e) {
      if (e instanceof OpenAI.APIError) {
        console.error(e.status);
        console.error(e.message);
        await ctx.runMutation(internal.messages.update, {
          messageId,
          body: "OpenAI call failed: " + e.message,
        });
        console.error(e);
      } else {
        throw e;
      }
    }
  },
});
