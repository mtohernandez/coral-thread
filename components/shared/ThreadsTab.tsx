import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";
import { fetchCommunityPosts } from "@/lib/actions/community.actions";

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const ThreadsTab = async ({ currentUserId, accountId, accountType }: Props) => {
  let result: any;

  if (accountType === "Community") result = await fetchCommunityPosts(accountId);
  else if (accountType === "Replies") result = await fetchUserPosts(accountId, true);
  else result = await fetchUserPosts(accountId);

  if (!result) redirect("/home");

  return (
    <section className="mt-9 flex flex-col sm:gap-3">
      {result.threads.map((thread: any) => (
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={currentUserId}
          parentId={thread.parentId}
          content={thread.text}
          author={
            accountType === "User"
              ? {
                  name: result.name,
                  username: result.username,
                  image: result.image,
                  id: result.id,
                }
              : {
                  name: thread.author.name,
                  image: thread.author.image,
                  username: thread.author.username,
                  id: thread.author.id,
                }
          }
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
          likes={thread.likes?.length ?? 0}
          reposts={thread.reposts?.length ?? 0}
          image={thread.image}
        />
      ))}
    </section>
  );
};

export default ThreadsTab;
