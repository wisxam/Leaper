import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import React, { useContext, useRef } from "react";
import { ChatContext } from "../chatContext";

type Props = {
  isDisabled?: boolean;
};

const ChatInput = ({ isDisabled }: Props) => {
  const { addMessage, handleInputChange, isLoading, message } =
    useContext(ChatContext);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div
      className={`${isDisabled ? "hidden" : "block"} absolute bottom-0 left-0 w-full`}
    >
      <form className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex w-full flex-grow flex-col p-4">
            <div className="relative">
              <Textarea
                placeholder="Enter your query"
                rows={1}
                maxRows={4}
                ref={textareaRef}
                onChange={handleInputChange}
                value={message}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    addMessage();
                    textareaRef.current?.focus();
                  }
                }}
                autoFocus
                className="scrollbar-w-2 scrollbar-track-blue-lighter scrollbar-thumb-blue scrollbar-thumb-rounded resize-none pr-12 text-base shadow-black"
              />
              <Button
                aria-label="send message"
                className="absolute mt-1 h-auto w-[100%]"
                disabled={isLoading || isDisabled}
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  addMessage();
                  textareaRef.current?.focus();
                }}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
