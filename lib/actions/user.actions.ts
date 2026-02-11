"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import Activity from "../models/activity.model";
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
      query.$or = [{ username: { $regex: regex } }, { name: { $regex: regex } }];
    }

    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query).sort(sortOptions).skip(skipAmount).limit(pageSize);

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
    await connectToDB();

    const activities = await Activity.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate({ path: "targetUser", model: User, select: "name image id" })
      .populate({ path: "thread", model: Thread, select: "_id parentId text" });

    return activities;
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

export async function followUser(currentUserId: string, targetUserId: string, path: string) {
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

export async function unfollowUser(currentUserId: string, targetUserId: string, path: string) {
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

export async function likeThread(userId: string, threadId: string, path: string) {
  try {
    connectToDB();

    const user = await fetchUser(userId);
    const thread = await Thread.findById(threadId);

    if (!thread) {
      throw new Error("Thread not found");
    }

    let isLiked = thread.likes.includes(user._id);

    if (isLiked) {
      thread.likes = thread.likes.filter((like: any) => like.toString() !== user._id.toString());
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

    // Activity tracking — fire-and-forget so it never breaks the like
    try {
      if (!isLiked) {
        await Activity.deleteOne({ type: "like", user: user._id, thread: thread._id });
      } else if (user._id.toString() !== thread.author.toString()) {
        await Activity.create({
          type: "like",
          user: user._id,
          thread: thread._id,
          targetUser: thread.author,
        });
      }
    } catch (e) {
      console.error("Activity tracking (like) failed:", e);
    }

    revalidatePath(path);

    return isLiked;
  } catch (error: any) {
    throw new Error(`Failed to like thread: ${error.message}`);
  }
}

export async function repostThread(userId: string, threadId: string, path: string) {
  try {
    await connectToDB();

    const user = await fetchUser(userId);
    const thread = await Thread.findById(threadId);

    if (!thread || !user) {
      throw new Error("Thread or user not found");
    }

    const reposts = thread.reposts ?? [];
    const isReposted = reposts.some((id: any) => id.toString() === user._id.toString());

    if (isReposted) {
      await Thread.findByIdAndUpdate(threadId, {
        $pull: { reposts: user._id },
      });
      await User.findByIdAndUpdate(user._id, {
        $pull: { repostedThreads: thread._id },
      });
      try {
        await Activity.deleteOne({ type: "repost", user: user._id, thread: thread._id });
      } catch (e) {
        console.error("Activity tracking (unrepost) failed:", e);
      }
    } else {
      await Thread.findByIdAndUpdate(threadId, {
        $addToSet: { reposts: user._id },
      });
      await User.findByIdAndUpdate(user._id, {
        $addToSet: { repostedThreads: thread._id },
      });
      if (user._id.toString() !== thread.author.toString()) {
        try {
          await Activity.create({
            type: "repost",
            user: user._id,
            thread: thread._id,
            targetUser: thread.author,
          });
        } catch (e) {
          console.error("Activity tracking (repost) failed:", e);
        }
      }
    }

    revalidatePath(path);

    return !isReposted;
  } catch (error: any) {
    throw new Error(`Failed to repost thread: ${error.message}`);
  }
}

export async function fetchRepostByUser(userId: string, threadId: string) {
  try {
    await connectToDB();

    const user = await fetchUser(userId);
    if (!user) return false;

    const thread = await Thread.findOne({ _id: threadId, reposts: user._id });
    return !!thread;
  } catch (error: any) {
    throw new Error(`Failed to fetch repost by user: ${error.message}`);
  }
}
