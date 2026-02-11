import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import { formatRelativeTime } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { Heart, MessageCircle, Repeat2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const activityConfig = {
  like: {
    icon: Heart,
    color: "text-red-500",
    fill: "fill-red-500",
    label: "Liked a thread by",
  },
  reply: {
    icon: MessageCircle,
    color: "text-blue-500",
    fill: "",
    label: "Replied to a thread by",
  },
  repost: {
    icon: Repeat2,
    color: "text-green-500",
    fill: "",
    label: "Reposted a thread by",
  },
} as const;

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const activity = await getActivity(userInfo._id);

  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>
      <section className="mt-10 flex flex-col gap-5">
        {activity.length > 0 ? (
          <>
            {activity.map((item: any) => {
              const config = activityConfig[item.type as keyof typeof activityConfig];
              if (!config || !item.thread) return null;

              const Icon = config.icon;
              const href =
                item.type === "reply"
                  ? `/thread/${item.thread.parentId}`
                  : `/thread/${item.thread._id}`;

              return (
                <Link key={item._id} href={href}>
                  <article className="activity-card">
                    <div className="relative">
                      <Image
                        src={item.targetUser?.image || "/assets/profile.svg"}
                        alt="Profile Picture"
                        width={24}
                        height={24}
                        className="rounded-full object-cover size-6"
                      />
                      <div className="absolute -bottom-1 -right-1 rounded-full bg-card p-0.5">
                        <Icon className={`size-3 ${config.color} ${config.fill}`} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-small-regular! text-foreground">
                        {config.label}{" "}
                        <span className="font-semibold text-foreground">
                          {item.targetUser?.name || "a user"}
                        </span>
                      </p>
                      {item.thread.text && (
                        <p className="mt-0.5 text-[13px] text-muted-foreground line-clamp-1">
                          {item.thread.text}
                        </p>
                      )}
                    </div>
                    <span className="text-[13px] text-muted-foreground shrink-0">
                      {formatRelativeTime(item.createdAt)}
                    </span>
                  </article>
                </Link>
              );
            })}
          </>
        ) : (
          <p className="text-base-regular! text-muted-foreground">No activity yet</p>
        )}
      </section>
    </section>
  );
}

export default Page;
