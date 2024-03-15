import { Button } from "../ui/button";

const Stats = ({ editor }) => {
  if (!editor) {
    return null;
  }

  // Function to get the word count
  const getWordCount = () => {
    const content = editor.getText();
    const words = content.split(/\s+/); // Split by spaces, tabs, or line breaks
    const wordCount = words.length;
    return wordCount;
  };

  const wordCount = getWordCount() - 1;

  return (
    <Button
      asChild
      className="cursor-default hover:!bg-background"
      variant="outline"
      size="sm"
    >
      <a>Word Count: {wordCount}</a>
    </Button>
  );
};

export default Stats;
