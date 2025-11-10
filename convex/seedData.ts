import { mutation } from "./_generated/server";

export const seedInitialData = mutation({
  handler: async (ctx) => {
    // Create initial users
    const users = [
      {
        email: "sarah@example.com",
        name: "Sarah Johnson",
        clerkId: "user_sarah_123",
        avatar: "https://picsum.photos/100/100?random=1",
      },
      {
        email: "alex@example.com", 
        name: "Alex Chen",
        clerkId: "user_alex_456",
      },
      {
        email: "mike@example.com",
        name: "Mike Rodriguez", 
        clerkId: "user_mike_789",
        avatar: "https://picsum.photos/100/100?random=2",
      },
      {
        email: "emma@example.com",
        name: "Emma Wilson",
        clerkId: "user_emma_101",
        avatar: "https://picsum.photos/100/100?random=3",
      },
    ];

    const userIds = [];
    for (const user of users) {
      const userId = await ctx.db.insert("users", user);
      userIds.push(userId);
    }

    // Create initial posts
    const initialPosts = [
      {
        userId: userIds[0],
        content: "Just had an amazing day at the beach! The sunset was absolutely breathtaking 🏖️✨",
        image: "https://picsum.photos/400/400?random=1",
        createdAt: Date.now() - 3600000,
      },
      {
        userId: userIds[1], 
        content: "Working on some exciting new projects. Innovation never stops! Can't wait to share more details soon 🚀",
        createdAt: Date.now() - 7200000,
      },
      {
        userId: userIds[2],
        content: "Beautiful morning vibes ☀️",
        image: "https://picsum.photos/400/400?random=2", 
        createdAt: Date.now() - 10800000,
      },
      {
        userId: userIds[3],
        content: "Coffee and code - the perfect combination for a productive day! ☕️💻",
        image: "https://picsum.photos/400/400?random=3",
        createdAt: Date.now() - 14400000,
      },
      {
        userId: userIds[0],
        content: "Exploring new hiking trails this weekend. Nature is the best therapy! 🥾🌲",
        image: "https://picsum.photos/400/400?random=4",
        createdAt: Date.now() - 18000000,
      },
      {
        userId: userIds[2],
        content: "Late night coding session with some good music. The flow state is real! 🎵💻",
        createdAt: Date.now() - 21600000,
      },
    ];

    for (const post of initialPosts) {
      await ctx.db.insert("posts", post);
    }

    return { message: "Initial data seeded successfully", usersCreated: userIds.length, postsCreated: initialPosts.length };
  },
});