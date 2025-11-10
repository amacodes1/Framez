import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

// User hooks
export const useCreateUser = () => useMutation(api.users.createUser);
export const useGetCurrentUser = (clerkId: string) => useQuery(api.users.getCurrentUser, clerkId ? { clerkId } : "skip");

// Post hooks
export const useCreatePost = () => useMutation(api.posts.createPost);
export const useGetAllPosts = () => useQuery(api.posts.getAllPosts);
export const useGetUserPosts = (userId: Id<"users"> | undefined) => useQuery(api.posts.getUserPosts, userId ? { userId } : "skip");