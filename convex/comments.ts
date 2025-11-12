import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createComment = mutation({
  args: {
    postId: v.id("posts"),
    userId: v.id("users"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("comments", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const getCommentsByPost = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .order("desc")
      .collect();

    return await Promise.all(
      comments.map(async (comment) => {
        const user = await ctx.db.get(comment.userId);
        return {
          ...comment,
          user,
        };
      })
    );
  },
});

export const deleteComment = mutation({
  args: { 
    commentId: v.id("comments"),
    userId: v.id("users")
  },
  handler: async (ctx, args) => {
    const comment = await ctx.db.get(args.commentId);
    if (!comment || comment.userId !== args.userId) {
      throw new Error("Unauthorized to delete this comment");
    }
    
    // Delete associated likes first
    const likes = await ctx.db
      .query("commentLikes")
      .withIndex("by_comment", (q) => q.eq("commentId", args.commentId))
      .collect();
    
    for (const like of likes) {
      await ctx.db.delete(like._id);
    }
    
    await ctx.db.delete(args.commentId);
  },
});

export const getCommentCount = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();
    return comments.length;
  },
});

export const toggleCommentLike = mutation({
  args: {
    commentId: v.id("comments"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const existingLike = await ctx.db
      .query("commentLikes")
      .withIndex("by_user_comment", (q) => 
        q.eq("userId", args.userId).eq("commentId", args.commentId)
      )
      .first();

    if (existingLike) {
      await ctx.db.delete(existingLike._id);
    } else {
      await ctx.db.insert("commentLikes", {
        ...args,
        createdAt: Date.now(),
      });
    }
  },
});

export const getCommentLikes = query({
  args: { commentId: v.id("comments") },
  handler: async (ctx, args) => {
    const likes = await ctx.db
      .query("commentLikes")
      .withIndex("by_comment", (q) => q.eq("commentId", args.commentId))
      .collect();
    return likes.length;
  },
});

export const isCommentLiked = query({
  args: {
    userId: v.id("users"),
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const like = await ctx.db
      .query("commentLikes")
      .withIndex("by_user_comment", (q) => 
        q.eq("userId", args.userId).eq("commentId", args.commentId)
      )
      .first();
    return !!like;
  },
});