"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Editor } from "@tiptap/react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/ui/dialog";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/ui/form";

import { Input } from "@/ui/ui/input";
import { Button } from "../ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";

export default function DialogForm({ editor }: { editor: Editor }) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const formSchema = z.object({
    title: z.string().nonempty({
      message: "Required",
    }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "KeyS" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const content = editor?.getJSON() || "";
    const formData = {
      ...values,
      content,
    };

    const apiCall = new Promise(async (resolve, reject) => {
      setLoading(true);
      try {
        const response = await fetch("/api/drafts", {
          method: "POST",
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
          setOpen(false);
          router.push(`/drafts/${data?.id}`);
        } else if (response.status === 401) {
          reject(new Error("You are unauthorized to perform this action."));
        } else {
          reject(new Error("Something went wrong."));
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
        toast.error("An error occurred.");
      }
    });
    toast.promise(apiCall, {
      loading: "Saving the draft...",
      success: (data) => "Successfully saved the draft.",
      error: (err) => {
        if (err.message === "Something went wrong.") {
          return "You are unauthorized to perform this action.";
        } else {
          return "Something went wrong. Please try again later.";
        }
      },
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="fixed right-14 top-4 flex items-center gap-1 rounded-lg bg-stone-100 py-1 pl-1 pr-2 text-sm font-medium text-stone-600 hover:bg-stone-200">
        <Plus className="w-4" />
        Save Draft
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Draft</DialogTitle>
          <DialogDescription className="sr-only">
            Add a title and click &quot;save&quot; to save your draft.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Draft Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title..." {...field} />
                  </FormControl>
                  <FormDescription className="italic">
                    What do you want to title this draft?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
