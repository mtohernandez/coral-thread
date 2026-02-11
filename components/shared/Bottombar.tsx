"use client";

import { bottomBarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Home, Search, CirclePlus, Heart, User } from "lucide-react";
import { useThreadDialog } from "@/context/thread-dialog-context";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Search,
  CirclePlus,
  Heart,
  User,
};

function Bottombar() {
  const { user } = useUser();
  const pathname = usePathname();
  const { open } = useThreadDialog();

  return (
    <section className="bottombar">
      <div className="bottombar_container">
        {bottomBarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

          const Icon = iconMap[link.icon];

          if (link.route === "create") {
            return (
              <button
                key={link.label}
                onClick={open}
                className={`bottombar_link text-muted-foreground hover:text-foreground`}
              >
                <Icon className="size-6" />
              </button>
            );
          }

          const href =
            link.route === "/profile" ? `/profile/${user?.id}` : link.route;

          return (
            <Link
              href={href}
              key={link.label}
              className={`bottombar_link ${
                isActive
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="size-6" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default Bottombar;
