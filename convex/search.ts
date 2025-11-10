import { v } from "convex/values";
import { query } from "./_generated/server";

export const searchPosts = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    if (!args.query.trim()) return [];
    
    const posts = await ctx.db.query("posts").collect();
    const users = await ctx.db.query("users").collect();
    
    const filteredPosts = posts.filter(post => 
      post.content.toLowerCase().includes(args.query.toLowerCase())
    );
    
    return await Promise.all(
      filteredPosts.map(async (post) => {
        const author = users.find(user => user._id === post.userId);
        return {
          ...post,
          author,
        };
      })
    );
  },
});

export const searchUsers = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    if (!args.query.trim()) return [];
    
    const users = await ctx.db.query("users").collect();
    const query = args.query.toLowerCase();
    
    return users.filter(user => 
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  },
});