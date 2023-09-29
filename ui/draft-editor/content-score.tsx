"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { Editor } from "@tiptap/react";

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

export default function ContentScore({ editor }: { editor: Editor }) {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const content = editor.state.doc.textContent;
  const onClick = async () => {
    const apiCall = new Promise(async (resolve, reject) => {
      try {
        setLoading(true);
        const response = await fetch("/api/content-score", {
          method: "POST",
          body: JSON.stringify(content),
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
      loading: "Generating content score...",
      success: (data) => "Successfully analyzed.",
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
      <AlertDialogTrigger className="hover:underline-hover">
        Generate Content Score
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Analyze content for AI score?</AlertDialogTitle>
          <AlertDialogDescription>
            Please confirm to analyze content.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onClick} disabled={loading}>
            Analyze
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
