export function AppSkeleton() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-base">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-accent/15 animate-pulse" />
        <div className="space-y-2">
          <div className="h-3 w-40 rounded bg-base-elevated animate-pulse" />
          <div className="h-3 w-28 rounded bg-base-elevated animate-pulse mx-auto" />
        </div>
      </div>
    </div>
  );
}
