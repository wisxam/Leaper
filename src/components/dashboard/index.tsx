"use client";

import { myEmptyFiles, myFilesStyle } from "@/app/constants";
import UploadButton from "../uploadButton";
import { trpc } from "@/app/_trpc/client";
import { Ghost, Loader2, MessageSquare, Plus, Trash2Icon } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { useState } from "react";

const Dashboard = () => {
  const utils = trpc.useContext();

  const [isFileBeingDelete, setIsFileBeingDelete] = useState<string | null>(
    null,
  );

  const { data: files, isLoading } = trpc.getUserFiles.useQuery();
  const { mutate: deleteFile, isPending } = trpc.deleteFile.useMutation({
    onSuccess: () => {
      utils.getUserFiles.invalidate();
    },
    onMutate: ({ id }) => {
      setIsFileBeingDelete(id);
    },
    onSettled() {
      setIsFileBeingDelete(null);
    },
  });

  return (
    <main className="mx-auto max-w-7xl transition-all md:p-10">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 px-3 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className={myFilesStyle}>My Files</h1>
        <UploadButton text={false} />
      </div>
      {files && files.length !== 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
          {files
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            )
            .map((file) => (
              <li
                key={file.id}
                className="col-span-1 divide-y divide-gray-100 rounded-lg bg-white shadow transition hover:shadow-lg"
              >
                <Link
                  href={`/dashboard/${file.id}`}
                  className="flex flex-col gap-2"
                >
                  <div className="flex w-full items-center justify-between space-x-6 px-6 pt-6">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="truncate px-3 text-lg font-medium text-zinc-900">
                          {file.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="mt-4 grid grid-cols-3 place-items-center gap-6 p-6 py-2 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {format(new Date(file.createdAt), "MMM dd yyyy")}
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Mocked
                  </div>
                  <Button
                    onClick={() =>
                      deleteFile({
                        id: file.id,
                      })
                    }
                    size={"sm"}
                    className="group w-full"
                    variant="destructive"
                    disabled={isPending && isFileBeingDelete === file.id}
                  >
                    {isPending && isFileBeingDelete === file.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2Icon className="transition-all group-hover:animate-shake_delete" />
                    )}
                  </Button>
                </div>
              </li>
            ))}
        </ul>
      ) : isLoading ? (
        <Skeleton height={100} className="my-2" count={3} />
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <Ghost className="h-8 w-8 text-zinc-800 transition-all hover:animate-shake" />
          <h3 className={myEmptyFiles}>Pretty empty around here...</h3>
          <UploadButton text={true} />
        </div>
      )}
    </main>
  );
};
export default Dashboard;
