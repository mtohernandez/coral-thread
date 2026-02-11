"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
  name: string;
  username: string;
  imgUrl: string;
}

const UserCard = ({ id, name, username, imgUrl }: Props) => {
  const router = useRouter();

  return (
    <article className="user-card">
      <div className="user-card_avatar">
        <div className="relative size-12 shrink-0">
          <Image src={imgUrl} alt="logo" fill sizes="48px" className="rounded-full object-cover" />
        </div>
      </div>
      <div className="flex-1 text-ellipsis">
        <h4 className="text-base-semibold text-foreground">{name}</h4>
        <p className="text-small-medium text-muted-foreground">@{username}</p>
      </div>

      <Button className="user-card_btn" onClick={() => router.push(`/profile/${id}`)}>
        View
      </Button>
    </article>
  );
};

export default UserCard;
