import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center min-h-[50vh]">
      <div className="relative">
        <div className="absolute inset-0 animate-ping opacity-10 rounded-full border-2 border-current scale-150" />
        <div className="absolute inset-0 animate-ping opacity-20 rounded-full border-2 border-current scale-125 animation-delay-300" />
        <div className="absolute inset-0 animate-ping opacity-30 rounded-full border-2 border-current animation-delay-600" />
        <div className="relative z-10 flex items-center justify-center p-6">
          <Loader2 className="h-10 w-10 animate-spin text-current" />
        </div>
      </div>

      <div className="mt-8 text-center">
        <div className="relative overflow-hidden">
          <div className="text-xl font-medium animate-pulse">Loading</div>
        </div>

        <div className="flex justify-center mt-2 space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-2 w-2 rounded-full bg-current opacity-70 animate-bounce"
              style={{
                animationDelay: `${i * 0.15}s`,
                animationDuration: "1s",
              }}
            />
          ))}
        </div>
      </div>

      <div className="w-full max-w-3xl mt-12 px-4">
        <div className="space-y-6">
          <div className="h-8 w-3/4 rounded-md bg-current opacity-10 animate-pulse" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <div
                  className="h-32 rounded-lg bg-current opacity-10 animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
                <div
                  className="h-4 w-3/4 rounded-md bg-current opacity-10 animate-pulse"
                  style={{ animationDelay: `${i * 0.1 + 0.1}s` }}
                />
                <div
                  className="h-3 rounded-md bg-current opacity-10 animate-pulse"
                  style={{ animationDelay: `${i * 0.1 + 0.2}s` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
