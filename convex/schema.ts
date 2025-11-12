import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    avatar: v.optional(v.string()),
    bio: v.optional(v.string()),
    clerkId: v.string(),
  }).index("by_clerk_id", ["clerkId"]).index("by_email", ["email"]),

  posts: defineTable({
    userId: v.id("users"),
    content: v.string(),
    image: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]).index("by_created_at", ["createdAt"]),

  likes: defineTable({
    userId: v.id("users"),
    postId: v.id("posts"),
    createdAt: v.number(),
  }).index("by_post", ["postId"]).index("by_user_post", ["userId", "postId"]),

  follows: defineTable({
    followerId: v.id("users"),
    followingId: v.id("users"),
    createdAt: v.number(),
  }).index("by_follower", ["followerId"]).index("by_following", ["followingId"]),

  comments: defineTable({
    postId: v.id("posts"),
    userId: v.id("users"),
    content: v.string(),
    createdAt: v.number(),
  }).index("by_post", ["postId"]).index("by_user", ["userId"]),
});