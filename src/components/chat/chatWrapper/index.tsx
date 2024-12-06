"use client";

import { trpc } from "@/app/_trpc/client";
import ChatInput from "../chatInput";
import Messages from "../messages";
import { ChevronLeft, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { myBackButtonTextStyle } from "@/app/constants";
import { ChatContextProvider } from "../chatContext";

type Props = {
  fileId: string;
};

const ChatWrapper = ({ fileId }: Props) => {
  const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
    {
      fileId,
    },
    {
      refetchInterval: (data) =>
        data?.state.status === "success" || data?.state.status === "pending"
          ? false
          : 500,
    },
  );
  if (isLoading) {
    return (
      <div className="relative flex min-h-full flex-col justify-between gap-2 divide-y divide-zinc-200 bg-zinc-50">
        <div className="mb-28 flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-navy-700" />
            <h3 className="flex items-center gap-1.5 text-xl font-semibold">
              Loading
              <div className="mt-2 h-1 w-1 animate-bounce-delay-1 rounded-full bg-black" />
              <div className="mt-2 h-1 w-1 animate-bounce-delay-2 rounded-full bg-black" />
              <div className="mt-2 h-1 w-1 animate-bounce-delay-3 rounded-full bg-black" />
            </h3>
            <p className="text-sm text-zinc-500">
              We&apos;re preparing your PDF!
            </p>
          </div>
        </div>
        <ChatInput isDisabled />
      </div>
    );
  }

  if (data?.status === "PROCESSING")
    return (
      <div className="relative flex min-h-full flex-col justify-between gap-2 divide-y divide-zinc-200 bg-zinc-50">
        <div className="mb-28 flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <h3 className="flex items-center gap-1.5 text-xl font-semibold">
              Processing PDF
              <div className="mt-2 h-1 w-1 animate-bounce-delay-1 rounded-full bg-black" />
              <div className="mt-2 h-1 w-1 animate-bounce-delay-2 rounded-full bg-black" />
              <div className="mt-2 h-1 w-1 animate-bounce-delay-3 rounded-full bg-black" />
            </h3>
            <p className="text-sm text-zinc-500">This won&apos;t take long.</p>
          </div>
        </div>
        <ChatInput isDisabled />
      </div>
    );

  if (data?.status === "FAILED") {
    return (
      <div className="relative flex min-h-full flex-col justify-between gap-2 divide-y divide-zinc-200 bg-zinc-50">
        <div className="mb-28 flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <XCircle className="h-8 w-8 text-red-500" />
            <h3 className="flex items-center gap-1.5 text-xl font-semibold">
              Too many pages
            </h3>
            <p className="text-sm text-zinc-500">
              All <span className="font-bold underline">PDFS</span> should be up
              to 5 pages max
            </p>
            <Link
              href="/dashboard"
              className={buttonVariants({
                variant: "secondary",
                className:
                  "group mt-4 bg-zinc-100 shadow-black hover:bg-zinc-200",
              })}
            >
              <ChevronLeft className="mr-1.5 h-4 w-4 text-zinc-500" />
              <p className={myBackButtonTextStyle}>Back</p>
            </Link>
          </div>
        </div>
        <ChatInput isDisabled />
      </div>
    );
  }
  return (
    <ChatContextProvider fileId={fileId}>
      <div className="relative flex min-h-full flex-col justify-between gap-2 divide-y divide-zinc-200 bg-zinc-50">
        <div className="mb-28 flex flex-1 flex-col justify-between">
          <Messages fileId={fileId} />
        </div>
        <ChatInput />
      </div>
    </ChatContextProvider>
  );
};

export default ChatWrapper;
