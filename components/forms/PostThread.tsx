"use client";

import Image from "next/image";
import { useThreadDialog } from "@/context/thread-dialog-context";

function PostThread({
  currentUserImg,
  hasImage,
  children,
}: {
  userId: string;
  currentUserImg: string;
  hasImage: boolean;
  children: React.ReactNode;
}) {
  const { open } = useThreadDialog();

  return (
    <div className="flex items-center gap-3 w-full py-7">
      {hasImage && (
        <Image
          src={currentUserImg}
          alt="Profile image"
          width={48}
          height={48}
          className="rounded-full object-cover"
        />
      )}
      <button
        onClick={open}
        className="text-muted-foreground outline-none bg-transparent border-none cursor-pointer text-left"
      >
        {children}
      </button>
    </div>
  );
}

export default PostThread;
