import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const storeUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    clerkId: v.string(),
    avatar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) {
      return existingUser._id;
    }

    return await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      clerkId: args.clerkId,
      avatar: args.avatar,
    });
  },
});