import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const sharePost = mutation({
  args: {
    postId: v.id("posts"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("shares", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const getShareCount = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const shares = await ctx.db
      .query("shares")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();
    return shares.length;
  },
});