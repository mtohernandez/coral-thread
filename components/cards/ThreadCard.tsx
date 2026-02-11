import { formatRelativeTime } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { fetchLikeByUser, fetchRepostByUser } from "@/lib/actions/user.actions";
import ThreadsActions from "../thread/ThreadActions";
import PopupThread from "../thread/PopupThread";

interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    username: string;
    id: string;
  };
  community: {
    name: string;
    image: string;
    id: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  likes?: number;
  reposts?: number;
  image?: string;
  isComment?: boolean;
  isMain?: boolean;
}

const ThreadCard = async ({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  likes,
  reposts,
  image,
  comments,
  isComment,
  isMain,
}: Props) => {
  const isLiked = await fetchLikeByUser(currentUserId, id);
  const isReposted = await fetchRepostByUser(currentUserId, id);

  return (
    <article
      className={`flex w-full flex-col py-5 sm:rounded-xl sm:border sm:border-border sm:bg-card sm:px-5 sm:py-5 ${
        isComment ? "px-0 xs:px-7" : ""
      } ${isMain ? "border-b border-border" : "border-t border-border"}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-3">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative size-9 shrink-0">
              <Image
                src={author.image}
                alt="Profile image"
                fill
                className="cursor-pointer rounded-full object-cover"
              />
            </Link>
            <div className="thread-card_bar" />
          </div>
          <div className="flex w-full flex-col">
            <div className="flex items-center gap-1.5">
              <Link href={`/profile/${author.id}`}>
                <h4 className="text-[15px] font-semibold text-foreground leading-tight hover:underline">
                  {author.username}
                </h4>
              </Link>
              <span className="text-[13px] text-muted-foreground">
                {formatRelativeTime(createdAt)}
              </span>
            </div>
            <p className="mt-1 text-[15px] leading-snug text-foreground">{content}</p>

            {image && (
              <div className="mt-2.5 rounded-lg overflow-hidden border border-border">
                <Image
                  src={image}
                  alt="Thread image"
                  width={480}
                  height={320}
                  sizes="(max-width: 640px) 100vw, 480px"
                  className="w-full object-cover"
                />
              </div>
            )}

            <div className="mt-3">
              <ThreadsActions
                currentUserId={currentUserId}
                threadId={id.toString()}
                isLiked={isLiked}
                likesCount={likes ?? 0}
                commentsCount={comments.length}
                isReposted={isReposted}
                repostsCount={reposts ?? 0}
              />
            </div>
          </div>
        </div>
        <PopupThread threadId={id.toString()} currentUserId={currentUserId} authorId={author.id} />
      </div>

      {!isComment && community && (
        <Link href={`/communities/${community.id}`} className="mt-5 flex items-center">
          <p className="text-subtle-medium text-muted-foreground">
            {formatRelativeTime(createdAt)} - {community.name} Community
          </p>

          <Image
            src={community.image}
            alt="Community Name"
            width={14}
            height={14}
            className="ml-1 rounded-full object-cover"
          />
        </Link>
      )}
    </article>
  );
};

export default ThreadCard;
