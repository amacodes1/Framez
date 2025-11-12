import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

// User hooks
export const useCreateUser = () => useMutation(api.users.createUser);
export const useGetCurrentUser = (clerkId: string) => useQuery(api.users.getCurrentUser, clerkId ? { clerkId } : "skip");
export const useUpdateUser = () => useMutation(api.users.updateUser);
export const useCheckEmailExists = (email: string) => useQuery(api.users.checkEmailExists, email ? { email } : "skip");

// Post hooks
export const useCreatePost = () => useMutation(api.posts.createPost);
export const useGetAllPosts = () => useQuery(api.posts.getAllPosts);
export const useGetUserPosts = (userId: Id<"users"> | undefined) => useQuery(api.posts.getUserPosts, userId ? { userId } : "skip");
export const useEditPost = () => useMutation(api.posts.editPost);
export const useDeletePost = () => useMutation(api.posts.deletePost);

// Search hooks
export const useSearchPosts = (query: string) => useQuery(api.search.searchPosts, query ? { query } : "skip");
export const useSearchUsers = (query: string) => useQuery(api.search.searchUsers, query ? { query } : "skip");

// Likes hooks
export const useToggleLike = () => useMutation(api.likes.toggleLike);
export const useGetPostLikes = (postId: Id<"posts">) => useQuery(api.likes.getPostLikes, { postId });
export const useIsPostLiked = (userId: Id<"users"> | undefined, postId: Id<"posts">) => 
  useQuery(api.likes.isPostLiked, userId ? { userId, postId } : "skip");

// Activity hooks
export const useGetUserActivity = (userId: Id<"users"> | undefined) => 
  useQuery(api.activity.getUserActivity, userId ? { userId } : "skip");

// Follow hooks
export const useFollowUser = () => useMutation(api.follows.followUser);
export const useIsFollowing = (followerId: Id<"users"> | undefined, followingId: Id<"users">) => 
  useQuery(api.follows.isFollowing, followerId ? { followerId, followingId } : "skip");
export const useGetFollowCounts = (userId: Id<"users"> | undefined) => 
  useQuery(api.follows.getFollowCounts, userId ? { userId } : "skip");

// Comment hooks
export const useGetCommentCount = (postId: Id<"posts">) => 
  useQuery(api.comments.getCommentCount, { postId });

// Share hooks
export const useSharePost = () => useMutation(api.shares.sharePost);
export const useGetShareCount = (postId: Id<"posts">) => 
  useQuery(api.shares.getShareCount, { postId });