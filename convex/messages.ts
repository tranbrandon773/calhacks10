import { api, internal } from "./_generated/api";
import { internalMutation, mutation, action, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { v } from "convex/values";
import { OpenAI } from "openai";

export const summarizeChat = action({
  handler: async (ctx) => {
    const apiKey = process.env.OPENAI_API_KEY!;
    const openai = new OpenAI({ apiKey });

    const messages = await ctx.runQuery(api.messages.list)
    const prompt = "Please give a summary in 3 to 5 bullet points about the conversation we just had, specifically what the main takeaways for me are. Immediatley start to list them, do not add any other text other than the list. Always provide left-justified text and always use numbered list. Do not add any extra text."
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", 
        messages: [
          {
            role: "system",
            content: "You are empathetic and responding to questions your long-time friend has about their medical report. You give succint responses but are open to explaining more if the user asks you to elaborate. Your friend is anxious about the healthcare system and so do not give information with too much medical jargon.",
          },
          ...messages.map(({ body, author }) => ({
            role:
              author === "Dr. Pepe" ? ("assistant" as const) : ("user" as const),
            content: body,
          })),
          {
            role: "user",
            content: prompt,
          }
        ],
        max_tokens: 220
      });
      const res: string  = completion.choices[0].message.content!
      return res
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

export const list = query({
  handler: async (ctx): Promise<Doc<"messages">[]> => {
    // Grab the most recent messages.
    const messages = await ctx.db.query("messages").order("desc").take(100);
    // Reverse the list so that it's in chronological order.
    return messages.reverse();
  },
});

export const send = mutation({
  args: { body: v.string(), author: v.string() },
  handler: async (ctx, { body, author }) => {
    // Send our message.
    await ctx.db.insert("messages", { body, author });

    if (author !== "Dr. Pepe") {
      // Fetch the latest n messages to send as context.
      // The default order is by creation time.
      const messages = await ctx.db.query("messages").order("desc").take(10);
      // Reverse the list so that it's in chronological order.
      messages.reverse();
      // Insert a message with a placeholder body.
      const messageId = await ctx.db.insert("messages", {
        author: "Dr. Pepe",
        body: "...",
      });
      // Schedule an action that calls ChatGPT and updates the message.
      ctx.scheduler.runAfter(0, internal.openai.chat, { messages, messageId });
    }
  },
});

// Updates a message with a new body.
export const update = internalMutation({
  args: { messageId: v.id("messages"), body: v.string() },
  handler: async (ctx, { messageId, body }) => {
    await ctx.db.patch(messageId, { body });
  },
});
