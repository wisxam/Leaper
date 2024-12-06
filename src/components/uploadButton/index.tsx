"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import { Button } from "../ui/button";
import { DialogDescription } from "@radix-ui/react-dialog";
import UploadDropzone from "../uploadDropzone";

type Props = {
  text: boolean;
};

const UploadButton = ({ text }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        if (isOpen) setIsOpen((prev) => !prev);
      }}
    >
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        {text ? (
          <p className="cursor-pointer">
            Let&apos;s upload your vert first PDF.
          </p>
        ) : (
          <Button>Upload pdf</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Example</DialogTitle>
        <DialogDescription>Hello mate fuck you</DialogDescription>
        <UploadDropzone />
      </DialogContent>
    </Dialog>
  );
};
export default UploadButton;
