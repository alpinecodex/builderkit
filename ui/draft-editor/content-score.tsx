"use client";

// const data = {
//   status: 200,
//   score: 0.89,
//   sentences: [
//     {
//       text: "The propeller plane rose above the red dirt and spinifex grasslands, carrying me north across the vast Australian outback. As we flew over the Kimberley region, I gazed out the window in awe at the ancient landscape unfolding below.",
//       score: 52,
//     },
//     {
//       text: "This was the traditional homeland of the Kukatja people, one of many Aboriginal tribes that have inhabited Australia for over 50,000 years. I was embarking on a journey to meet the Kukatja and learn about their ancient culture. The Kukatja are custodians of some of the oldest continuous religious beliefs and cultural practices on Earth.",
//       score: 21.91,
//     },
//     {
//       text: "As we landed on a remote airstrip, I felt both excitement and trepidation about immersing myself in their world. A Kukatja elder named David greeted me at the airstrip. His warm smile and firm handshake assured me I was welcome. We bounced along rough dirt roads in David's old Land Cruiser, kicking up clouds of dust. After an hour, we arrived at a small settlement of tin-roofed houses and traditional wiltjas - temporary shelters made of branches and leaves.",
//       score: 0.03,
//     },
//     {
//       text: 'Children played in the dirt while women cooked kangaroo tails over open fires. I received curious looks but friendly greetings of "yawuru" (hello) from the Kukatja people.',
//       score: 99.99,
//     },
//   ],
//   credits_used: 198,
//   credits_remaining: 354,
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

  const highlight = (data) => {
    const result = data.sentences.flatMap((item) => {
      const sentences = splitIntoSentences(item.text);
      return sentences.map((sentence) => ({
        text: sentence as string,
        score: item.score,
      }));
    });
    result.forEach((sentence) => {
      const { text, score } = sentence;
      const range = findStringInEditor(editor, text);
      let color = "";
      if (score <= 25) {
        color = "#fdebeb";
      } else if (score > 25 && score <= 50) {
        color = "#fbf4a2";
      } else {
        color = "#00000000";
      }
      if (range) {
        editor
          .chain()
          .focus()
          .setTextSelection(range)
          .setHighlight({ color: color })
          .run();
      }
    });
  };

  const onClick = async () => {
    const apiCall = new Promise(async (resolve, reject) => {
      try {
        setLoading(true);
        const content = extractTextFromEditor(editor);
        const response = await fetch("/api/content-score", {
          method: "POST",
          body: JSON.stringify({ content: content }),
        });

        const data = await response.json();
        if (response.status === 200) {
          highlight(data);
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

function findStringInEditor(editor, searchString) {
  let startPosition = null;
  let endPosition = null;

  editor.state.doc.descendants((node, pos) => {
    if (node.isText) {
      if (startPosition === null) {
        // if start hasn't been found
        const startIdx = node.text.indexOf(searchString);
        if (startIdx !== -1) {
          startPosition = pos + startIdx;
          endPosition = startPosition + searchString.length;
          return endPosition <= pos + node.text.length; // stop if the entire string is within this node
        }
      } else if (startPosition !== null && pos < endPosition) {
        if (pos + node.text.length >= endPosition) {
          return true; // stop if this node contains the end of the string
        }
      }
    }
  });

  if (startPosition !== null) {
    return {
      from: startPosition as number,
      to: endPosition as number,
    };
  }

  return null;
}

function extractTextFromEditor(editor) {
  let texts = [];

  editor.state.doc.descendants((node, pos, parent) => {
    if (node.isText && parent.type.name === "paragraph") {
      texts.push(node.text);
    }
  });

  return texts.join("\n");
}

function splitIntoSentences(paragraph: string) {
  const sentences = paragraph.match(/[^.!?;:-]+[.!?;:-]?(?=\s|$)/g) || [];
  return sentences.map((sentence) => sentence.trim());
}
