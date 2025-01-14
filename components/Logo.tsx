import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
        <div className="font-mono text-2xl font-black bg-black text-white px-3 py-1 rounded">FEED</div>
    </div>
  )
}