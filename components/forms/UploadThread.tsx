"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import Image from "next/image";
import { Button } from "../ui/button";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ThreadValidation } from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.actions";
import { useOrganization, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useThreadDialog } from "@/context/thread-dialog-context";
import { useUploadThing } from "@/lib/uploadthing";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";
import { VisuallyHidden } from "radix-ui";
import { ImagePlus, Loader2, X } from "lucide-react";

function CreateThreadDialog() {
  const pathname = usePathname();
  const { organization } = useOrganization();
  const { user } = useUser();
  const { isOpen, close } = useThreadDialog();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { startUpload } = useUploadThing("media");

  const form = useForm<z.infer<typeof ThreadValidation>>({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
      image: "",
      accountId: "",
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
    setError("");
    close();
  };

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    if (!user?.id) return;
    setIsSubmitting(true);
    setError("");
    try {
      let imageUrl = "";

      if (imageFile) {
        const uploadResult = await startUpload([imageFile]);
        if (!uploadResult || !uploadResult[0]?.url) {
          setError("Image upload failed. Try again.");
          return;
        }
        imageUrl = uploadResult[0].url;
      }

      await createThread({
        text: values.thread,
        author: user.id,
        communityId: organization ? organization.id : null,
        path: pathname,
        image: imageUrl,
      });

      handleClose();
    } catch (err: any) {
      setError(err?.message || "Failed to post thread. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent showCloseButton={false} className="sm:max-w-[525px] gap-0 p-0">
        <VisuallyHidden.Root>
          <DialogTitle>New thread</DialogTitle>
          <DialogDescription>Create a new thread post</DialogDescription>
        </VisuallyHidden.Root>
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <button
            type="button"
            onClick={handleClose}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <h2 className="text-sm font-semibold text-foreground">New thread</h2>
          <div className="w-10" />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex gap-3 px-5 pt-4 pb-3">
              <div className="flex flex-col items-center gap-2">
                <Image
                  src={user.imageUrl}
                  alt="Profile"
                  width={36}
                  height={36}
                  className="rounded-full object-cover size-9 shrink-0"
                />
                <div className="thread-card_bar" />
              </div>
              <div className="flex-1 pt-0.5">
                <p className="text-sm font-semibold text-foreground">
                  {user.username ?? user.firstName}
                </p>
                <FormField
                  control={form.control}
                  name="thread"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <textarea
                          placeholder="What's on your mind?"
                          className="mt-1 w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                          rows={3}
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

                {imagePreview && (
                  <div className="relative mt-2 rounded-xl overflow-hidden max-h-72">
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
                      className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                )}

                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSubmitting}
                    className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                  >
                    <ImagePlus className="size-5" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                </div>
              </div>
            </div>

            {error && <p className="px-5 pb-2 text-xs text-destructive">{error}</p>}

            <div className="flex items-center justify-between border-t border-border px-5 py-3">
              <span
                className={`text-xs ${
                  threadValue.length > 260 ? "text-destructive" : "text-muted-foreground"
                }`}
              >
                {threadValue.length}/280
              </span>
              <Button
                type="submit"
                size="sm"
                className="px-5"
                disabled={isSubmitting || threadValue.length < 3 || !user?.id}
              >
                {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Post"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateThreadDialog;
