"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Pen } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/ui/ui/alert-dialog";

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

export default function EditDraft({
  id,
  title,
}: {
  id: string | undefined;
  title: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const formSchema = z.object({
    title: z.string().nonempty({
      message: "Required",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    // @ts-ignore
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: title || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const formData = {
      ...values,
      id: id,
    };

    const apiCall = new Promise(async (resolve, reject) => {
      try {
        setLoading(true);
        const response = await fetch("/api/drafts", {
          method: "PUT",
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
        } else {
          reject(new Error("Something went wrong."));
        }
        setLoading(false);
        router.refresh();
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
      }
    });
    toast.promise(apiCall, {
      loading: "Deleting draft...",
      success: (data) => "Successfully edited draft.",
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
    <AlertDialog>
      <AlertDialogTrigger
        className="ml-2 rounded-md border-2 p-1 transition-all hover:bg-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        <Pen className="transition-all hover:text-stone-500" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Property</AlertDialogTitle>
          <AlertDialogDescription>
            Change how often you receive reports and if a property is active.
          </AlertDialogDescription>
        </AlertDialogHeader>
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
            <AlertDialogFooter>
              <AlertDialogAction type="submit" disabled={loading}>
                Submit
              </AlertDialogAction>

              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
