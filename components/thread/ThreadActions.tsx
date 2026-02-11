"use client";

import Link from "next/link";
import { likeThread, repostThread } from "@/lib/actions/user.actions";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Heart, MessageCircle, Repeat2, Send } from "lucide-react";

const ThreadsActions = ({
  currentUserId,
  threadId,
  isLiked,
  likesCount = 0,
  commentsCount = 0,
  isReposted,
  repostsCount = 0,
}: {
  currentUserId: string;
  threadId: string;
  isLiked: boolean;
  likesCount?: number;
  commentsCount?: number;
  isReposted: boolean;
  repostsCount?: number;
}) => {
  const pathname = usePathname();
  const [liked, setLiked] = useState(isLiked);
  const [likes, setLikes] = useState(likesCount);
  const [animating, setAnimating] = useState(false);

  const [reposted, setReposted] = useState(isReposted);
  const [reposts, setReposts] = useState(repostsCount);
  const [repostAnimating, setRepostAnimating] = useState(false);

  const handleLike = async () => {
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikes((prev) => (wasLiked ? prev - 1 : prev + 1));
    setAnimating(true);
    setTimeout(() => setAnimating(false), 150);
    try {
      await likeThread(currentUserId, threadId, pathname);
    } catch {
      setLiked(wasLiked);
      setLikes((prev) => (wasLiked ? prev + 1 : prev - 1));
    }
  };

  const handleRepost = async () => {
    const wasReposted = reposted;
    setReposted(!wasReposted);
    setReposts((prev) => (wasReposted ? prev - 1 : prev + 1));
    setRepostAnimating(true);
    setTimeout(() => setRepostAnimating(false), 150);
    try {
      await repostThread(currentUserId, threadId, pathname);
    } catch {
      setReposted(wasReposted);
      setReposts((prev) => (wasReposted ? prev + 1 : prev - 1));
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handleLike}
        className={`flex items-center gap-1 transition-colors duration-200 ${
          liked ? "text-red-500" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Heart
          className={`size-5 transition-transform duration-200 ${
            animating ? "scale-125" : "scale-100"
          } ${liked ? "fill-red-500" : ""}`}
        />
        {likes > 0 && <span className="text-[13px] tabular-nums">{likes}</span>}
      </button>

      <Link
        href={`/thread/${threadId}`}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors duration-200"
      >
        <MessageCircle className="size-5" />
        {commentsCount > 0 && <span className="text-[13px] tabular-nums">{commentsCount}</span>}
      </Link>

      <button
        onClick={handleRepost}
        className={`flex items-center gap-1 transition-colors duration-200 ${
          reposted ? "text-green-500" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Repeat2
          className={`size-5 transition-transform duration-200 ${
            repostAnimating ? "scale-125" : "scale-100"
          }`}
        />
        {reposts > 0 && <span className="text-[13px] tabular-nums">{reposts}</span>}
      </button>

      <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors duration-200">
        <Send className="size-[18px]" />
      </button>
    </div>
  );
};

export default ThreadsActions;
