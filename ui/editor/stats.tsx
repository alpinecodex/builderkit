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
    <div className="absolute bottom-0 right-0 z-10 hidden w-full rounded-lg p-4 text-sm shadow-sm lg:flex">
      <div className="flex w-full flex-wrap items-center justify-between gap-2 rounded-lg bg-stone-400 bg-opacity-80 px-4 py-2 text-white shadow-sm">
        <p>
          Word Count:{" "}
          <code className="rounded-md bg-stone-500 px-1 py-px">
            {wordCount}
          </code>
        </p>
      </div>
    </div>
  );
};

export default Stats;
