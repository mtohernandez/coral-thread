"use client";

import { Button } from "../ui/button";
import Link from "next/link";
import { likeThread } from "@/lib/actions/user.actions";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Heart, MessageCircle, Repeat2, Send } from "lucide-react";

const ThreadsActions = ({
  currentUserId,
  threadId,
  isLiked,
}: {
  currentUserId: string;
  threadId: string;
  isLiked: boolean;
}) => {
  const pathname = usePathname();
  const [liked, setLiked] = useState(isLiked);
  const [animating, setAnimating] = useState(false);

  const parsedThreadId = JSON.parse(threadId);

  const handleLike = async () => {
    setLiked(!liked);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 150);
    try {
      await likeThread(currentUserId, parsedThreadId, pathname);
    } catch (error) {
      setLiked(liked);
    }
  };

  return (
    <div className="flex gap-1">
      <Button
        onClick={handleLike}
        variant="ghost"
        size="icon-xs"
        className="hover:bg-accent"
      >
        <Heart
          className={`size-5 transition-all duration-200 ${
            animating ? "scale-125" : "scale-100"
          } ${
            liked
              ? "fill-red-500 text-red-500"
              : "text-muted-foreground"
          }`}
        />
      </Button>
      <Button variant="ghost" size="icon-xs" asChild>
        <Link href={`/thread/${parsedThreadId}`}>
          <MessageCircle className="size-5 text-muted-foreground" />
        </Link>
      </Button>
      <Button variant="ghost" size="icon-xs">
        <Repeat2 className="size-5 text-muted-foreground" />
      </Button>
      <Button variant="ghost" size="icon-xs">
        <Send className="size-5 text-muted-foreground" />
      </Button>
    </div>
  );
};

export default ThreadsActions;
