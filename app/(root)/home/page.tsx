import { currentUser } from "@clerk/nextjs/server";
import { fetchPosts } from "@/lib/actions/thread.actions";
import ThreadCard from "@/components/cards/ThreadCard";
import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Home() {
  const result = await fetchPosts(1, 30);
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <>
      <PostThread userId={JSON.stringify(userInfo._id)} currentUserImg={userInfo.image} hasImage>
        Start thread...
      </PostThread>
      <section className="flex flex-col sm:gap-3">
        {result.posts.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          <>
            {result.posts.map((post: any) => (
              <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={user.id}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
                likes={post.likes.length}
                reposts={post.reposts?.length ?? 0}
                image={post.image}
              />
            ))}
          </>
        )}
      </section>
    </>
  );
}
