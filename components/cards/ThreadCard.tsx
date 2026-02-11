import { formatRelativeTime } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { fetchLikeByUser } from "@/lib/actions/user.actions";
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
  image,
  comments,
  isComment,
  isMain,
}: Props) => {
  const isLiked = await fetchLikeByUser(currentUserId, id);

  return (
    <article
      className={`flex w-full flex-col py-7 ${isComment && "px-0 xs:px-7"} ${
        isMain ? "border-b border-border" : "border-t border-border"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image
                src={author.image}
                alt="Profile image"
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>
            <div className="thread-card_bar" />
          </div>
          <div className="flex w-full flex-col">
            <div className="flex items-center gap-1">
              <Link href={`/profile/${author.id}`}>
                <h4 className="text-base-semibold text-foreground">
                  {author.name}
                </h4>
              </Link>
              <Link href={`/profile/${author.id}`}>
                <span className="text-small-medium text-muted-foreground">
                  @{author.username}
                </span>
              </Link>
              <span className="text-small-medium text-muted-foreground">
                · {formatRelativeTime(createdAt)}
              </span>
            </div>
            <p className="mt-2 text-small-regular text-foreground">{content}</p>

            {image && (
              <div className="mt-3 rounded-xl overflow-hidden max-h-80 bg-muted">
                <Image
                  src={image}
                  alt="Thread image"
                  width={480}
                  height={320}
                  sizes="(max-width: 640px) 100vw, 480px"
                  className="w-full object-cover transition-opacity duration-300"
                />
              </div>
            )}

            <div className="mt-5 flex flex-col gap-3">
              <ThreadsActions
                currentUserId={currentUserId}
                threadId={JSON.stringify(id)}
                isLiked={isLiked}
              />
              <div className="flex items-center gap-3.5">
                {likes && likes > 0 ? (
                  <p className="text-small-regular text-muted-foreground">
                    {likes} likes
                  </p>
                ) : (
                  <></>
                )}
                {comments.length > 0 && (
                  <Link href={`/thread/${id}`}>
                    <p className="text-small-regular text-muted-foreground">
                      {comments.length} replies
                    </p>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
        <PopupThread
          threadId={id.toString()}
          currentUserId={currentUserId}
          authorId={author.id}
        />
      </div>

      {!isComment && community && (
        <Link
          href={`/communities/${community.id}`}
          className="mt-5 flex items-center"
        >
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
