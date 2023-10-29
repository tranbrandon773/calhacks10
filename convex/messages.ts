import { api, internal } from "./_generated/api";
import { internalMutation, mutation, action } from "./_generated/server";
import { query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { v } from "convex/values";
import { OpenAI } from "openai";

export const summarizeChat = action({
  handler: async (ctx) => {
    // implementation goes here
    const apiKey = process.env.OPENAI_API_KEY!;
    const openai = new OpenAI({ apiKey });

    const messages = await ctx.runQuery(api.messages.list)
    console.log(messages)
    // const prompt = "Please summarize the following conversation about my health in 3 to 5 bullet points." + history
    // console.log(prompt)
    // const history = messages.map(message => message.body).join(' ')
    // const sysMess = history + "Please summarize the following conversation about my health in 3 to 5 bullet points."
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // "gpt-4" also works, but is so slow!
        // stream: true,
        messages: [
          {
            role: "system",
            content: "You are a master doctor who can summarize any given conversation about a medical report etc into a around 5 bullet points"
          },
          ...messages.map(({ body, author }) => ({
            role:
              author === "ChatGPT" ? ("assistant" as const) : ("user" as const),
            content: body,
          })),
        ],
      });
      const res: string  = completion.choices[0].message.content!
      console.log(res)
      return res
    } catch (e) {
      if (e instanceof OpenAI.APIError) {
        console.error(e.status);
        console.error(e.message);
        // await ctx.runMutation(internal.messages.update, {
        //   messageId,
        //   body: "OpenAI call failed: " + e.message,
        // });
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

    if (author !== "ChatGPT") {
      // Fetch the latest n messages to send as context.
      // The default order is by creation time.
      const messages = await ctx.db.query("messages").order("desc").take(10);
      // Reverse the list so that it's in chronological order.
      messages.reverse();
      // Insert a message with a placeholder body.
      const messageId = await ctx.db.insert("messages", {
        author: "ChatGPT",
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
