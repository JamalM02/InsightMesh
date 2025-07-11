"use client";

import { useAuth } from "@clerk/nextjs";
import { memo, useState } from "react";
import { Eye, EyeOff, Copy, KeyRound, Shield } from "lucide-react";
import { revealApiKey, getSecret } from "@/actions";
import { useTransition, useCallback } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const HIDDEN_KEY = "•".repeat(32);

const RevealKeyPanel = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { orgId } = useAuth();

  const handleReveal = useCallback(() => {
    if (!orgId) {
      toast.error("No organization ID found");
      return;
    }

    if (apiKey) {
      setApiKey(null);
      return;
    }

    startTransition(async () => {
      try {
        const { secretId } = await getSecret({ appId: orgId });
        const key = await revealApiKey({ accountId: orgId, secretId });
        setApiKey(key);
      } catch (err) {
        console.error(err);
        toast.error("Failed to reveal API key");
      }
    });
  }, [orgId, apiKey]);

  const copyToClipboard = (text?: string | null) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("API key copied to clipboard", { id: "copy_api_key" });
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-zinc-900/90 rounded-2xl border border-white/10 shadow-2xl p-6 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <KeyRound className="w-6 h-6 text-indigo-400" />
        <h2 className="text-xl font-semibold text-white">API Key</h2>
      </div>

      {/* Key Actions */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleReveal}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors duration-200 text-zinc-400 hover:text-white cursor-pointer disabled:cursor-auto"
          title={apiKey ? "Hide API Key" : "Show API Key"}
          disabled={isPending}
        >
          {isPending ? (
            <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
          ) : apiKey ? (
            <EyeOff size={20} />
          ) : (
            <Eye size={20} />
          )}
        </button>

        <button
          onClick={() => copyToClipboard(apiKey)}
          disabled={!apiKey}
          className={cn(
            "p-2 hover:bg-white/5 rounded-lg transition-colors duration-200 cursor-pointer",
            "disabled:hidden",
            "text-zinc-400 hover:text-white"
          )}
          title="Copy to Clipboard"
        >
          <Copy size={20} />
        </button>
      </div>

      {/* API Key Display */}
      <div className="bg-black/30 rounded-lg p-4 font-mono text-sm border border-white/5">
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-indigo-400" />
          <p className="text-white truncate">
            API_KEY={apiKey ? apiKey : HIDDEN_KEY}
          </p>
        </div>
      </div>
    </div>
  );
};

export default memo(RevealKeyPanel);
