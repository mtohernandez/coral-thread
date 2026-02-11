import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import AccountProfile from "@/components/forms/AccountProfile";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const userData = {
    id: user.id,
    objectId: userInfo._id.toString(),
    username: userInfo.username,
    name: userInfo.name,
    bio: userInfo.bio || "",
    image: userInfo.image,
  };

  return (
    <section>
      <h1 className="head-text mb-10">Edit Profile</h1>
      <div className="bg-card p-10 rounded-lg">
        <AccountProfile user={userData} btnTitle="Save" />
      </div>
    </section>
  );
}

export default Page;
