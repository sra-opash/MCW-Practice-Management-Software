"use client";

import { cn } from "@mcw/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

type AccordionChild = {
  label: string;
  href: string;
  description?: string;
};

type AccordionItem = {
  title: string;
  value: string;
  content?: React.ReactNode;
  children?: AccordionChild[]; // <-- new
};

type AccordionProps = {
  items: AccordionItem[];
  className?: string;
  allowMultipleOpen?: boolean;
};

export function Accordion({
  items,
  className,
  allowMultipleOpen = true,
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (value: string) => {
    setOpenItems((prev) =>
      allowMultipleOpen
        ? prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value]
        : prev.includes(value)
          ? []
          : [value],
    );
  };

  return (
    <div className={cn("w-full", className)}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.value);
        return (
          <div key={item.value}>
            <button
              onClick={() => toggleItem(item.value)}
              className="w-full flex justify-between items-center p-4 text-left font-medium hover:bg-muted transition"
            >
              <span className="text-[16px] font-medium text-[#374151]">
                {item.title}
              </span>
              <ChevronDown
                className={
                  isOpen
                    ? "w-4 h-4 text-gray-500 transition-transform rotate-180"
                    : "w-4 h-4 text-gray-500 transition-transform"
                }
              />
              {/* <span className="transition-transform group-data-[state=open]:rotate-180">{"<"}</span> */}
            </button>

            {isOpen && (
              <div className="p-4 border-t bg-muted/20 animate-in fade-in-10 space-y-3">
                {/* If `children` are passed, render links */}
                {item.children && item.children.length > 0
                  ? item.children.map((child) => (
                      <div
                        key={child.href}
                        className="p-3 rounded-md hover:bg-muted cursor-pointer"
                        onClick={() => (window.location.href = child.href)} // or use router
                      >
                        <p className="text-[16px] font-semibold">
                          {child.label}
                        </p>
                        {child.description && (
                          <p className="text-sm text-muted-foreground">
                            {child.description}
                          </p>
                        )}
                      </div>
                    ))
                  : item.content // fallback to `content` if no `children`
                }
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
