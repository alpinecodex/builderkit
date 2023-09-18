"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

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

import { Trash } from "lucide-react";

export default function DeleteDraft({ id }: { id: string | undefined }) {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const onClick = async () => {
    const apiCall = new Promise(async (resolve, reject) => {
      try {
        setLoading(true);
        const response = await fetch("/api/drafts", {
          method: "DELETE",
          body: JSON.stringify({ id: id }),
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
      success: (data) => "Successfully deleted draft.",
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
        className="rounded-md border-2 p-1 transition-all hover:bg-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        <Trash className="transition-all hover:text-red-500" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will{" "}
            <span className="font-bold text-red-500">
              permanently delete this draft
            </span>{" "}
            and all its corresponding data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onClick} disabled={loading}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
