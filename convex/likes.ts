import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const toggleLike = mutation({
  args: {
    userId: v.id("users"),
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const existingLike = await ctx.db
      .query("likes")
      .withIndex("by_user_post", (q) => 
        q.eq("userId", args.userId).eq("postId", args.postId)
      )
      .first();

    if (existingLike) {
      await ctx.db.delete(existingLike._id);
      return { liked: false };
    } else {
      await ctx.db.insert("likes", {
        userId: args.userId,
        postId: args.postId,
        createdAt: Date.now(),
      });
      return { liked: true };
    }
  },
});

export const getPostLikes = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const likes = await ctx.db
      .query("likes")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();
    
    return likes.length;
  },
});

export const isPostLiked = query({
  args: {
    userId: v.id("users"),
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const like = await ctx.db
      .query("likes")
      .withIndex("by_user_post", (q) => 
        q.eq("userId", args.userId).eq("postId", args.postId)
      )
      .first();
    
    return !!like;
  },
});