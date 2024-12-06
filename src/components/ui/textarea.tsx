import * as React from "react";
import TextAreaAutoSize, {
  TextareaAutosizeProps,
} from "react-textarea-autosize";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaAutosizeProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextAreaAutoSize
        className={cn(
          "flex w-full rounded-md border border-black border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
