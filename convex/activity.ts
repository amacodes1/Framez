import { v } from "convex/values";
import { query } from "./_generated/server";

export const getUserActivity = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // Get likes on user's posts
    const userPosts = await ctx.db
      .query("posts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const postIds = userPosts.map(post => post._id);
    
    const likes = await Promise.all(
      postIds.map(async (postId) => {
        const postLikes = await ctx.db
          .query("likes")
          .withIndex("by_post", (q) => q.eq("postId", postId))
          .order("desc")
          .take(10);
        
        return Promise.all(
          postLikes.map(async (like) => {
            const liker = await ctx.db.get(like.userId);
            const post = await ctx.db.get(like.postId);
            
            return {
              id: like._id,
              type: "like" as const,
              user: liker,
              post,
              createdAt: like.createdAt,
            };
          })
        );
      })
    );

    return likes.flat().sort((a, b) => b.createdAt - a.createdAt);
  },
});