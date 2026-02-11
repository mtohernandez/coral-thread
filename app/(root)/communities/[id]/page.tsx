import UserCard from "@/components/cards/UserCard";
import ProfileHeader from "@/components/shared/ProfileHeader";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { communityTabs } from "@/constants";
import { fetchCommunityDetails } from "@/lib/actions/community.actions";
import { currentUser } from "@clerk/nextjs/server";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await currentUser();
  if (!user) return null;

  const communityDetails = await fetchCommunityDetails(id);

  return (
    <section>
      <ProfileHeader
        accountId={communityDetails.id}
        authUserId={user.id}
        name={communityDetails.name}
        username={communityDetails.username}
        imgUrl={communityDetails.image}
        bio={communityDetails.bio}
        type="Community"
      />

      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {communityTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <p className="max-sm:hidden">{tab.label}</p>

                {tab.label === "Threads" && (
                  <p className="ml-1 rounded-sm bg-muted px-2 py-1 text-tiny-medium! text-foreground">
                    {communityDetails?.threads?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="threads" className="w-full text-foreground">
            <ThreadsTab
              currentUserId={user.id}
              accountId={communityDetails.id}
              accountType="User"
            />
          </TabsContent>
          <TabsContent value="members" className="w-full text-foreground">
            <section className="mt-9 flex flex-col gap-10">
                  {
                    communityDetails?.members.map((member: any) => (
                      <UserCard
                        key={member.id}
                        id={member.id}
                        name={member.name}
                        username={member.username}
                        imgUrl={member.image}
                        personType="User"
                      />
                    ))
                  }
            </section>
          </TabsContent>
          <TabsContent value="requests" className="w-full text-foreground">
            <ThreadsTab
              currentUserId={user.id}
              accountId={communityDetails.id}
              accountType="User"
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

export default Page;
