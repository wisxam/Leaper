import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";
import { Document, Page } from "react-pdf";
import { Expand, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import SimpleBar from "simplebar-react";
import { useToast } from "@/hooks/use-toast";
import { useResizeDetector } from "react-resize-detector";

type Props = {
  fileUrl: string;
  numPages: number;
};

const PdfFullScreen = ({ fileUrl, numPages }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const {
    ref,
    width: containerWidth,
    height: containerHeight,
  } = useResizeDetector();
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) setIsOpen(v);
      }}
    >
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button
          aria-label="expand full screen"
          variant="ghost"
          className="gap-1.5"
        >
          <Expand className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-7xl" aria-describedby={undefined}>
        <DialogTitle className="tracking-widest">Full Screen view</DialogTitle>
        <SimpleBar autoHide={false} className="mt-6 max-h-[calc(100vh-10rem)]">
          <div ref={ref}>
            <Document
              loading={
                <div className="my-24 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              }
              onLoadError={() => {
                toast({
                  title: "Error loading PDF",
                  description: "Please try again later",
                  variant: "destructive",
                });
              }}
              file={fileUrl}
            >
              {new Array(numPages).fill(0).map((_, i) => (
                <Page
                  key={i}
                  pageNumber={i + 1}
                  width={containerWidth}
                  height={containerHeight}
                  loading={
                    <div className="flex items-center justify-center">
                      <Loader2 className="my-24 h-6 w-6 animate-spin" />
                    </div>
                  }
                />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
};

export default PdfFullScreen;
