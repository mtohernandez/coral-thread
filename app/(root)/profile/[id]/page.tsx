import ProfileHeader from "@/components/shared/ProfileHeader";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import { fetchFollowStatus, fetchUserWithFollowCounts } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUserWithFollowCounts(id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const isFollowing = user.id !== id
    ? await fetchFollowStatus(user.id, id)
    : false;

  return (
    <section>
      <ProfileHeader
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
        followersCount={userInfo.followersCount}
        followingCount={userInfo.followingCount}
        threadsCount={userInfo.threadsCount}
        isFollowing={isFollowing}
      />

      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab p-0">
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <p className="max-sm:hidden">{tab.label}</p>
                {tab.label === "Threads" && (
                  <p className="rounded-sm bg-muted px-2 py-1 text-tiny-medium! text-foreground">
                    {userInfo?.threads?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="threads" className="w-full text-foreground">
            <ThreadsTab
              currentUserId={user.id}
              accountId={userInfo.id}
              accountType="User"
            />
          </TabsContent>
          <TabsContent value="replies" className="w-full text-foreground">
            <ThreadsTab
              currentUserId={user.id}
              accountId={userInfo.id}
              accountType="Replies"
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

export default Page;
