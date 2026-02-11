"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreHorizontal, Loader2, Trash2, EyeOff, Flag, Pencil } from "lucide-react";
import { deleteThread } from "@/lib/actions/thread.actions";
import { usePathname } from "next/navigation";

interface Props {
  threadId: string;
  currentUserId: string;
  authorId: string;
}

const PopupThread = ({ threadId, currentUserId, authorId }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const pathname = usePathname();
  const isOwner = currentUserId === authorId;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteThread(threadId, pathname);
    } catch (error) {
      console.error("Failed to delete thread:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-xs" className="shrink-0">
          <MoreHorizontal className="size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isOwner ? (
          <>
            <DropdownMenuItem disabled>
              <Pencil className="size-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-destructive focus:text-destructive"
            >
              {isDeleting ? (
                <Loader2 className="size-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="size-4 mr-2" />
              )}
              Delete
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem disabled>
              <EyeOff className="size-4 mr-2" />
              Hide
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <Flag className="size-4 mr-2" />
              Report
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PopupThread;
