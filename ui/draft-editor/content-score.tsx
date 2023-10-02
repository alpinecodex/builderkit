"use client";

// const data = {
//   status: 200,
//   score: 2.75,
//   sentences: [
//     {
//       text: "IX. Relationship between the French and Haitian RevolutionsThe French Revolution was a key inspiration for rebellious slaves and free people of color in Saint-Domingue. They embraced the rhetoric of liberty, equality and brotherhood to demand their own rights.",
//       score: 3.44,
//     },
//     {
//       text: "Some Haitian rebel leaders, like Louverture, also adopted the French revolutionary calendar, vocabulary and uniforms.However, the Haitian Revolution also exposed contradictions within French revolutionary ideals about universal human rights. French abolitionists and black delegates pushed for slavery's abolition during the Revolution.",
//       score: 2.22,
//     },
//     // {
//     //   text: "But French political leaders compromised on gradual abolition to maintain Caribbean colonies. X. Debates and Responses Historians have long debated the Haitian Revolution's causes, nature and impact. C.L.R. James seminal work The Black Jacobins (1938) first brought scholarly attention to the revolution and Louverture's leadership. Revisionist scholars later emphasized the role of internal class divisions and broader Atlantic world dynamics rather than singular heroic leaders.",
//     //   score: 65.5,
//     // },
//     {
//       text: "Contemporary observers often denigrated the rebels. But some abolitionists like William Wordsworth praised the revolution's anti-slavery message. Haitian nationalists and black activists worldwide celebrated the revolution as a symbol of resistance against slavery and colonialism.",
//       score: 0.26,
//     },
//   ],
//   credits_used: 181,
//   credits_remaining: 2143,
// };

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

  function highlightText(searchText: string) {
    let index = editor.state.doc.textContent.indexOf(searchText);
    if (index !== -1) {
      // Add a highlight mark to the found text
      editor
        .chain()
        .focus()
        .setTextSelection({
          from: index + 1,
          to: index + searchText.length + 4,
        })
        .setHighlight({ color: "#ffcc00" })
        .run();
    }

    // editor.state.doc.descendants((node, pos: number) => {
    //   if (node.isText) {
    //     console.log(node.text);
    //     let index = node.text.indexOf(searchText);
    //     if (index !== -1) {
    //       // Add a highlight mark to the found text
    //       editor
    //         .chain()
    //         .focus()
    //         .setTextSelection({
    //           from: pos + index,
    //           to: pos + index + searchText.length,
    //         })
    //         .setHighlight({ color: "#ffcc00" })
    //         .run();
    //     }
    //   }
    // });
  }

  const parseContentScore = (scoreData) => {
    scoreData?.sentences?.forEach((sentence) => {
      const { text } = sentence;
      console.log(text);
      // const startPosition = findIndex(editor.state.doc, text);
      // console.log("start position: ", startPosition);
      // const endPosition = startPosition + text.length;
      highlightText(text);
    });
  };

  // const testClick = async () => {
  //   parseContentScore(data);
  // };

  const getEditorText = async () => {
    let textNodes = [];
    editor.state.doc.descendants((node, pos) => {
      if (node.isText) {
        textNodes.push(node.text);
      }
    });
    let text = textNodes.join(" ");
    console.log(text);
    return text;
  };

  const onClick = async () => {
    const apiCall = new Promise(async (resolve, reject) => {
      try {
        setLoading(true);
        const content = await getEditorText();
        const response = await fetch("/api/content-score", {
          method: "POST",
          body: JSON.stringify({ content: content }),
        });

        const data = await response.json();
        if (response.status === 200) {
          parseContentScore(data);
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
