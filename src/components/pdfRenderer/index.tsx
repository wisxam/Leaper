"use client";

import { useToast } from "@/hooks/use-toast";
import { Document, Page, pdfjs } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  RotateCcw,
  SearchIcon,
} from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { cn } from "@/lib/utils";
import SimpleBar from "simplebar-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import PdfFullScreen from "../pdfFullScreen";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

type Props = {
  url: string;
};

const PdfRenderer = ({ url }: Props) => {
  const { toast } = useToast();

  const [numPages, setNumPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageScale, setPageScale] = useState<number>(1);
  const [pageRotation, setPageRotation] = useState<number>(0);
  const [renderedScale, setRenderedScale] = useState<number | null>(null);

  const isLoading = renderedScale !== pageScale;

  const {
    width: containerWidth,
    ref,
    height: containerHeight,
  } = useResizeDetector();

  const pageSchema = z.object({
    page: z
      .string()
      .regex(/^\d+$/, "Must be a valid number")
      .refine(
        (value) => {
          const page = Number(value);
          return page > 0 && page <= (numPages ?? 1);
        },
        { message: `Must be between 1 and ${numPages ?? "xx"}` },
      ),
  });

  type PageForm = z.infer<typeof pageSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PageForm>({
    defaultValues: { page: "1" },
    resolver: zodResolver(pageSchema),
  });

  const onSubmit = (data: PageForm) => {
    const newPage = Number(data.page);
    setCurrentPage(newPage);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setValue("page", String(newPage));
  };

  return (
    <div className="flex h-full w-full flex-col rounded-md bg-white shadow">
      <div className="flex h-14 w-full items-center justify-between border-b border-zinc-200 px-2">
        <div className="flex items-center gap-1.5">
          <Button
            disabled={currentPage <= 1}
            aria-label="previous page"
            variant="ghost"
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center gap-1.5"
          >
            <Input
              {...register("page")}
              className={cn(
                "h-8 w-12",
                errors.page && "focus-visible:ring-rose-500",
              )}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit(onSubmit)(e);
              }}
            />
            <p className="space-x-1 text-sm text-zinc-700">
              <span>/</span>
              <span className="font-medium">{numPages ?? "xx"}</span>
            </p>
          </form>

          <Button
            disabled={numPages === undefined || currentPage >= numPages}
            aria-label="next page"
            variant="ghost"
            onClick={() =>
              handlePageChange(Math.min(numPages ?? 1, currentPage + 1))
            }
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" aria-label="zoom" className="gap-1.5">
                <SearchIcon className="h-4 w-4" />
                {pageScale * 100}%
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setPageScale(1)}>
                100%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setPageScale(1.5)}>
                150%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setPageScale(2)}>
                200%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setPageScale(2.5)}>
                250%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            aria-label="rotate"
            className="gap-1.5"
            onClick={() => setPageRotation((prev) => prev + 90)}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <PdfFullScreen fileUrl={url} numPages={numPages!} />
        </div>
      </div>

      <div className="max-h-screen w-full flex-1">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
          <div ref={ref}>
            <Document
              loading={
                <div className="my-24 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              }
              onLoadSuccess={({ numPages }) => {
                setNumPages(numPages);
              }}
              onLoadError={() => {
                toast({
                  title: "Error loading PDF",
                  description: "Please try again later",
                  variant: "destructive",
                });
              }}
              file={url}
            >
              {isLoading && renderedScale ? (
                <Page
                  pageNumber={currentPage}
                  width={containerWidth}
                  height={containerHeight}
                  loading={
                    <div className="flex items-center justify-center">
                      <Loader2 className="my-24 h-6 w-6 animate-spin" />
                    </div>
                  }
                  scale={pageScale}
                  rotate={pageRotation}
                  key={"@" + renderedScale}
                />
              ) : null}
              <Page
                pageNumber={currentPage}
                width={containerWidth}
                height={containerHeight}
                loading={
                  <div className="flex items-center justify-center">
                    <Loader2 className="my-24 h-6 w-6 animate-spin" />
                  </div>
                }
                key={"@" + pageScale}
                scale={pageScale}
                rotate={pageRotation}
                className={cn(isLoading ? "hidden" : "")}
                onRenderSuccess={() => {
                  setRenderedScale(pageScale);
                }}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};

export default PdfRenderer;
