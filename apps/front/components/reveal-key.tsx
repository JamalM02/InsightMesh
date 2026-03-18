"use client";

import { useAuth } from "@clerk/nextjs";
import { memo, useState } from "react";
import { Eye, EyeOff, Copy, KeyRound, Shield, Check } from "lucide-react";
import { revealApiKey, getSecret } from "@/actions";
import { useTransition, useCallback } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const HIDDEN_KEY = "•".repeat(40);

const RevealKeyPanel = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);
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

  const copyToClipboard = useCallback(
    (text?: string | null) => {
      if (!text) return;
      navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("API key copied to clipboard", { id: "copy_api_key" });
      setTimeout(() => setCopied(false), 2000);
    },
    []
  );

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-primary" />
          API Key
        </CardTitle>
        <CardDescription>
          Your secret API key for authenticating requests. Keep it safe and never
          share it publicly.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Display */}
        <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm border border-border">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-primary shrink-0" />
            <p className="text-foreground truncate">
              API_KEY={apiKey ? apiKey : HIDDEN_KEY}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReveal}
            disabled={isPending}
            className="cursor-pointer"
          >
            {isPending ? (
              <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
            ) : apiKey ? (
              <EyeOff size={16} />
            ) : (
              <Eye size={16} />
            )}
            {apiKey ? "Hide Key" : "Reveal Key"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(apiKey)}
            disabled={!apiKey}
            className={cn("cursor-pointer", !apiKey && "hidden")}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(RevealKeyPanel);
