"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { followUser, unfollowUser } from "@/lib/actions/user.actions";
import { usePathname } from "next/navigation";

interface Props {
  currentUserId: string;
  targetUserId: string;
  isFollowing: boolean;
}

const FollowButton = ({ currentUserId, targetUserId, isFollowing: initialIsFollowing }: Props) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  const handleToggleFollow = async () => {
    setIsLoading(true);
    const previousState = isFollowing;
    setIsFollowing(!isFollowing);

    try {
      if (previousState) {
        await unfollowUser(currentUserId, targetUserId, pathname);
      } else {
        await followUser(currentUserId, targetUserId, pathname);
      }
    } catch (error) {
      setIsFollowing(previousState);
      console.error("Failed to toggle follow:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleToggleFollow}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      variant={isFollowing ? "outline" : "default"}
      size="sm"
      disabled={isLoading}
      className="transition-all duration-150 min-w-[100px]"
    >
      {isFollowing ? (isHovering ? "Unfollow" : "Following") : "Follow"}
    </Button>
  );
};

export default FollowButton;
