"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import Image from "next/image";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ThreadValidation } from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.actions";
import { useOrganization, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useThreadDialog } from "@/context/thread-dialog-context";
import { useUploadThing } from "@/lib/uploadthing";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { ImagePlus, Loader2, X } from "lucide-react";

function CreateThreadDialog() {
  const pathname = usePathname();
  const { organization } = useOrganization();
  const { user } = useUser();
  const { isOpen, close } = useThreadDialog();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { startUpload } = useUploadThing("media");

  const form = useForm<z.infer<typeof ThreadValidation>>({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
      image: "",
      accountId: user?.id || "",
    },
  });

  const threadValue = form.watch("thread");

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.includes("image")) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result?.toString() || "");
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    form.setValue("image", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    form.reset();
    removeImage();
    close();
  };

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    setIsSubmitting(true);
    try {
      let imageUrl = "";

      if (imageFile) {
        const uploadResult = await startUpload([imageFile]);
        if (uploadResult && uploadResult[0]?.url) {
          imageUrl = uploadResult[0].url;
        }
      }

      await createThread({
        text: values.thread,
        author: values.accountId,
        communityId: organization ? organization.id : null,
        path: pathname,
        image: imageUrl,
      });

      handleClose();
    } catch (error) {
      console.error("Failed to create thread:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>New Thread</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-3">
              <Image
                src={user.imageUrl}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full object-cover h-10 w-10 shrink-0"
              />
              <FormField
                control={form.control}
                name="thread"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Textarea
                        placeholder="What's on your mind?"
                        className="no-focus border-none bg-transparent resize-none min-h-[80px] text-foreground p-0"
                        disabled={isSubmitting}
                        {...field}
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = "auto";
                          target.style.height = target.scrollHeight + "px";
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {imagePreview && (
              <div className="relative rounded-xl overflow-hidden max-h-80">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={480}
                  height={320}
                  className="w-full object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-background/80 rounded-full p-1 hover:bg-background"
                >
                  <X className="size-4" />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSubmitting}
                >
                  <ImagePlus className="size-5 text-muted-foreground" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelect}
                />
                <span
                  className={`text-xs ${
                    threadValue.length > 260
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }`}
                >
                  {threadValue.length}/280
                </span>
              </div>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting || threadValue.length < 3}
              >
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Post"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateThreadDialog;
