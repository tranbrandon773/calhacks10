import { internal } from "./_generated/api";
import { OpenAI } from "openai";
import { internalMutation, action } from "./_generated/server";
import { v } from "convex/values";

export const createSeedMessage = action({
  args: { extractedText: v.string() },
  handler: async (ctx, args) => {
    try {
      const apiKey = process.env.OPENAI_API_KEY!;
      const openai = new OpenAI({ apiKey });

      const prompt = "Attached is my medical report, please give me a one sentence summary of my condition and such and give me a 2 to 3 questions I can ask to probe into the medical report deeper, like ask about recommendations on how to improve my medical wellbeing and health conditions, or ask about what my numbers and measurements were, or ask about next steps according to the doctor." + args.extractedText
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are empathetic and responding to questions your long-time friend has about their medical report. You give succint responses but are open to explaining more if the user asks you to elaborate. Your friend is anxious about the healthcare system and so do not give information with too much medical jargon.",
          },
          {
            role: "user",
            content: prompt
          }
        ],
      });
      const seedMessage = completion.choices[0].message.content!
      await ctx.runMutation(internal.init.seed, { seedMessage })
      } catch (e) {
        if (e instanceof OpenAI.APIError) {
          console.error(e.status);
          console.error(e.message);
          console.error(e);
        } else {
          throw e;
        }
      }
  },
});

if (!process.env.OPENAI_API_KEY) {
  const deploymentName = process.env.CONVEX_CLOUD_URL?.slice(8).replace(
    ".convex.cloud",
    ""
  );
  throw new Error(
    "\n  Missing OPENAI_API_KEY in environment variables.\n\n" +
      "  Get one at https://openai.com/ and paste it on the Convex dashboard:\n" +
      `  https://dashboard.convex.dev/d/${deploymentName}/settings?var=OPENAI_API_KEY`
  );
}

export const seed = internalMutation({
  args: {seedMessage: v.string()},
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      author: "Dr. Pepe",
      body: args.seedMessage,
    });
  },
});

export default internalMutation({
  handler: async (ctx) => {
    //do something
  },
});
