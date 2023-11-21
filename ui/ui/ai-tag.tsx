import React from "react";

interface AiTagProps {
  children: React.ReactNode;
  aiType?: "gpt" | "claude";
}

const AiTag: React.FC<AiTagProps> = ({ children, aiType }) => {
  let bgColor;
  switch (aiType) {
    case "gpt":
      bgColor = "bg-[#75A99C] text-white";
      break;
    case "claude":
      bgColor = "bg-[#cc785c] text-white";
      break;
    default:
      bgColor = "bg-neutral-100 text-neutral-600";
  }
  return (
    <p className={`mx-2 inline-block rounded-md ${bgColor} px-1 py-px text-xs`}>
      {children}
    </p>
  );
};

export default AiTag;
