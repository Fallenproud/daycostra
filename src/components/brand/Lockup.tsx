import { RingMark } from "./RingMark";
import { Wordmark } from "./Wordmark";
import { cn } from "@/lib/utils";

export function Lockup({
  className,
  markSize = 34,
}: {
  className?: string;
  markSize?: number;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <RingMark size={markSize} title="" />
      <Wordmark />
    </span>
  );
}
