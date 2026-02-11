import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const thread = await fetchThreadById(id);

  return (
    <section className="relative">
      <div>
        <ThreadCard
          id={thread._id}
          currentUserId={user?.id || ""}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          likes={thread.likes.length}
          reposts={thread.reposts?.length ?? 0}
          comments={thread.children}
          image={thread.image}
          isMain
        />
      </div>

      <Comment
        threadId={thread.id}
        currentUserImg={userInfo.image}
        currentUserId={JSON.stringify(userInfo._id)}
      />

      <div className="flex flex-col sm:gap-3">
        {thread.children.map((childItem: any) => (
          <ThreadCard
            key={childItem._id}
            id={childItem._id}
            currentUserId={user?.id || ""}
            parentId={childItem.parentId}
            content={childItem.text}
            author={childItem.author}
            community={childItem.community}
            createdAt={childItem.createdAt}
            likes={childItem.likes.length}
            reposts={childItem.reposts?.length ?? 0}
            comments={childItem.children}
            image={childItem.image}
            isComment
          />
        ))}
      </div>
    </section>
  );
}

export default page;
