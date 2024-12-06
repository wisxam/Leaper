import { CloudDownload, File, Loader2 } from "lucide-react";
import { useState } from "react";
import Dropzone from "react-dropzone";
import { Progress } from "@/components/ui/progress";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "@/hooks/use-toast";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";

const UploadDropzone = () => {
  const [fileTypeError, setFileTypeError] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const router = useRouter();

  const { toast } = useToast();

  const { mutate: startPolling } = trpc.getFile.useMutation({
    onSuccess: (file) => {
      router.push(`dashboard/${file.id}`);
    },
    retry: true,
    retryDelay: 1000,
  });

  const { startUpload } = useUploadThing("pdfUploader");

  const startSimulatedProgress = () => {
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval);
          return prevProgress;
        }
        return prevProgress + 5;
      });
    }, 500);

    return interval;
  };

  return (
    <Dropzone
      multiple={false}
      accept={{ "application/pdf": [] }}
      onDrop={async (acceptedFiles) => {
        console.log(acceptedFiles);
        setFileTypeError("");
        setIsUploading(true);
        const progressInterval = startSimulatedProgress();

        const res = await startUpload(acceptedFiles);

        if (!res) {
          return toast({
            title: "Something went wrong.",
            description: "Please try again later.",
            variant: "destructive",
          });
        }

        const [fileResponse] = res;

        const key = fileResponse.key;

        if (!key) {
          return toast({
            title: "Something went wrong.",
            description: "Please try again later.",
            variant: "destructive",
          });
        }

        clearInterval(progressInterval);
        setUploadProgress(100);
        startPolling({ key });
      }}
      onDropRejected={() => {
        setFileTypeError("Only PDF files are allowed.");
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="m-4 h-64 rounded-lg border border-dashed border-gray-300"
        >
          <div className="flex h-full w-full items-center justify-center">
            <label
              htmlFor="dropzone-file"
              className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pb-6 pt-5">
                <CloudDownload className="mb-2 h-8 w-8 text-navy-700" />

                <div className="flex h-auto items-center justify-center gap-1">
                  <p className="mb-2 text-sm text-zinc-700">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <div className="h-1 w-1 animate-bounce-delay-1 rounded-full bg-black" />
                  <div className="h-1 w-1 animate-bounce-delay-2 rounded-full bg-black" />
                  <div className="h-1 w-1 animate-bounce-delay-3 rounded-full bg-black" />
                </div>
                <p className="text-sm text-zinc-500">Up to 4mbs</p>
              </div>
              <input {...getInputProps()} />
              {acceptedFiles && acceptedFiles[0] ? (
                <div className="divide-zinc-400-200 flex max-w-xs items-center divide-x overflow-hidden rounded-md bg-white outline outline-[2px] outline-zinc-200">
                  <div className="grid h-full place-items-center px-3 py-2">
                    <File className="h-6 w-6 text-navy-500" />
                  </div>
                  <div className="h-full truncate px-3 py-2 text-sm">
                    {acceptedFiles[0].name}
                  </div>
                </div>
              ) : null}
              {fileTypeError && (
                <p className="text-red-500">Only pdf files are allowed</p>
              )}
              {isUploading ? (
                <div className="mx-auto mt-4 w-full max-w-xs">
                  <Progress
                    value={uploadProgress}
                    className="h-2 w-full bg-zinc-300"
                    indicatorColor={
                      uploadProgress === 100 ? "bg-green-500" : ""
                    }
                  />
                  {uploadProgress === 100 && (
                    <div className="flex items-center justify-center gap-1 pt-2 text-center text-sm text-zinc-700">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Redirecting{" "}
                      <div className="h-1 w-1 animate-bounce-delay-1 rounded-full bg-black" />
                      <div className="h-1 w-1 animate-bounce-delay-2 rounded-full bg-black" />
                      <div className="h-1 w-1 animate-bounce-delay-3 rounded-full bg-black" />
                    </div>
                  )}
                </div>
              ) : (
                ""
              )}
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

export default UploadDropzone;
