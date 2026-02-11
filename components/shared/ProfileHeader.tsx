import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import FollowButton from "./FollowButton";
import { Separator } from "../ui/separator";

interface Props {
  accountId: string;
  authUserId: string;
  name: string;
  username: string;
  imgUrl: string;
  bio: string;
  type?: "User" | "Community";
  followersCount?: number;
  followingCount?: number;
  threadsCount?: number;
  isFollowing?: boolean;
}

const ProfileHeader = ({
  accountId,
  authUserId,
  name,
  username,
  imgUrl,
  bio,
  type,
  followersCount = 0,
  followingCount = 0,
  threadsCount = 0,
  isFollowing = false,
}: Props) => {
  const isOwnProfile = accountId === authUserId;

  return (
    <div className="flex w-full flex-col justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-20 w-20 object-cover">
            <Image
              src={imgUrl}
              alt="Profile image"
              fill
              className="rounded-full object-cover shadow-2xl"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-left text-heading3-bold text-foreground">
              {name}
            </h2>
            <p className="text-base-medium text-muted-foreground">@{username}</p>
          </div>
        </div>
        {type !== "Community" && (
          <div>
            {isOwnProfile ? (
              <Button variant="outline" size="sm" asChild>
                <Link href="/profile/edit">Edit Profile</Link>
              </Button>
            ) : (
              <FollowButton
                currentUserId={authUserId}
                targetUserId={accountId}
                isFollowing={isFollowing}
              />
            )}
          </div>
        )}
      </div>

      {bio && (
        <p className="mt-4 max-w-lg text-base-regular text-foreground">{bio}</p>
      )}

      {type !== "Community" && (
        <div className="mt-4 flex items-center gap-4 text-small-medium text-muted-foreground">
          <span>{threadsCount} threads</span>
          <span>{followersCount} followers</span>
          <span>{followingCount} following</span>
        </div>
      )}

      <Separator className="mt-6" />
    </div>
  );
};

export default ProfileHeader;
