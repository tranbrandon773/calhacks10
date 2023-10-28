import { api } from "./_generated/api";
import { internalMutation } from "./_generated/server";

const seedMessages = [
  ["ChatGPT", "Hardcoded test message", 0],
] as const;

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
  handler: async (ctx) => {
    let totalDelay = 0;
    for (const [author, body, delay] of seedMessages) {
      totalDelay += delay;
      await ctx.scheduler.runAfter(totalDelay, api.messages.send, {
        author,
        body,
      });
    }
  },
});

export default internalMutation({
  handler: async (ctx) => {
    const anyMessage = await ctx.db.query("messages").first();
    if (anyMessage) return;
    await seed(ctx, {});
  },
});
