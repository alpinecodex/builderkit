"use client";

import { FC } from "react";
import { Loader2 } from "lucide-react";

export default function LoadingPage() {
  return <Loading />;
}

const Loading: FC = () => {
  return (
    <div className="flex h-screen w-full animate-pulse flex-col items-center justify-center rounded-lg border p-8">
      <Loader2 className="animate-spin"></Loader2>
    </div>
  );
};
