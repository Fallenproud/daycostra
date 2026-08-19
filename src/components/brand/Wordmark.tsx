import { cn } from "@/lib/utils";

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("dc-wordmark", className)}>
      Daycostra
    </span>
  );
}
