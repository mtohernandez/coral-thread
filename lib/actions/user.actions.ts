"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  bio,
  name,
  path,
  username,
  image,
}: Params): Promise<void> {
  try {
    connectToDB();

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();

    return await User.findOne({ id: userId });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function fetchUserPosts(userId: string, replies?: boolean) {
  try {
    connectToDB();

    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: {
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "name image id",
        },
      },
    });

    

    if (replies) {
      threads.threads = threads.threads.reduce((acc: any, thread: any) => {
        return acc.concat(thread.children);
      }, []);
    }

    return threads;
  } catch (error: any) {
    throw new Error(`Failed to fetch user posts: ${error.message}`);
  }
}

export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString: string;
  pageNumber: number;
  pageSize: number;
  sortBy: SortOrder;
}) {
  try {
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    const regex = new RegExp(searchString, "i");

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };

    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUserCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    const isNext = totalUserCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error: any) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
}

export async function getActivity(userId: string) {
  try {
    connectToDB();

    const userThreads = await Thread.find({ author: userId });

    const childThreadsIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    const replies = await Thread.find({
      _id: { $in: childThreadsIds },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    return replies;
  } catch (error: any) {
    throw new Error(`Failed to fetch activity: ${error.message}`);
  }
}

export async function fetchLikeByUser(userId: string, threadId: string) {
  try {
    connectToDB();

    const user = await fetchUser(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return user.likedThreads.includes(threadId);
  } catch (error: any) {
    throw new Error(`Failed to fetch like by user: ${error.message}`);
  }
}

export async function followUser(
  currentUserId: string,
  targetUserId: string,
  path: string
) {
  try {
    connectToDB();

    const currentUser = await User.findOne({ id: currentUserId });
    const targetUser = await User.findOne({ id: targetUserId });

    if (!currentUser || !targetUser) {
      throw new Error("User not found");
    }

    await User.findByIdAndUpdate(currentUser._id, {
      $addToSet: { following: targetUser._id },
    });

    await User.findByIdAndUpdate(targetUser._id, {
      $addToSet: { followers: currentUser._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to follow user: ${error.message}`);
  }
}

export async function unfollowUser(
  currentUserId: string,
  targetUserId: string,
  path: string
) {
  try {
    connectToDB();

    const currentUser = await User.findOne({ id: currentUserId });
    const targetUser = await User.findOne({ id: targetUserId });

    if (!currentUser || !targetUser) {
      throw new Error("User not found");
    }

    await User.findByIdAndUpdate(currentUser._id, {
      $pull: { following: targetUser._id },
    });

    await User.findByIdAndUpdate(targetUser._id, {
      $pull: { followers: currentUser._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to unfollow user: ${error.message}`);
  }
}

export async function fetchFollowStatus(
  currentUserId: string,
  targetUserId: string
): Promise<boolean> {
  try {
    connectToDB();

    const currentUser = await User.findOne({ id: currentUserId });
    const targetUser = await User.findOne({ id: targetUserId });

    if (!currentUser || !targetUser) return false;

    return currentUser.following.includes(targetUser._id);
  } catch (error: any) {
    throw new Error(`Failed to fetch follow status: ${error.message}`);
  }
}

export async function fetchUserWithFollowCounts(userId: string) {
  try {
    connectToDB();

    const user = await User.findOne({ id: userId });

    if (!user) {
      throw new Error("User not found");
    }

    return {
      ...user.toObject(),
      followersCount: user.followers?.length || 0,
      followingCount: user.following?.length || 0,
      threadsCount: user.threads?.length || 0,
    };
  } catch (error: any) {
    throw new Error(`Failed to fetch user with follow counts: ${error.message}`);
  }
}

export async function likeThread(
  userId: string,
  threadId: string,
  path: string
) {
  try {
    connectToDB();

    const user = await fetchUser(userId);
    const thread = await Thread.findById(threadId);

    if (!thread) {
      throw new Error("Thread not found");
    }

    let isLiked = thread.likes.includes(user._id);

    console.log("isLiked", isLiked);

    if (isLiked) {
      thread.likes = thread.likes.filter(
        (like: any) => like.toString() !== user._id.toString()
      );
      user.likedThreads = user.likedThreads.filter(
        (likedThread: any) => likedThread.toString() !== thread._id.toString()
      );
      isLiked = false;
    } else {
      thread.likes.push(user._id);
      user.likedThreads.push(threadId);
      isLiked = true;
    }

    await thread.save();

    await user.save();

    revalidatePath(path);

    return isLiked;
  } catch (error: any) {
    throw new Error(`Failed to like thread: ${error.message}`);
  }
}
