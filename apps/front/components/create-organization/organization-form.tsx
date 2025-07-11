"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useClerk, useOrganizationList } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { memo, useCallback, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  CreateOrganizationParams,
  CreateOrganizationSchema,
} from "@/components/create-organization/schema";
import FormInput from "@/components/form-input";
import { completeOnboarding } from "@/actions/complete-onboard";
import { createAccount } from "@/actions/create-account";
import { toast } from "sonner";

const OrganizationForm = () => {
  const router = useRouter();
  const clerk = useClerk();
  const { createOrganization } = useOrganizationList();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = useCallback(
    async (values: CreateOrganizationParams) => {
      startTransition(async () => {
        try {
          const org = await createOrganization?.({
            name: values.name,
            slug: values.slug || undefined,
          });
          if (!org) return;
          await createAccount({
            id: org.id,
            name: org.name,
            slug: org.slug || undefined,
          });
          await completeOnboarding();
          await clerk.session?.touch();
          router.push("/dashboard");
        } catch (error) {
          const e = error as { message?: string };
          toast.error(e.message || "Failed to create organization", {
            duration: 3000,
          });
        }
      });
    },
    [createOrganization, router, clerk.session]
  );

  const form = useForm<CreateOrganizationParams>({
    resolver: zodResolver(CreateOrganizationSchema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <FormInput
            control={form.control}
            label="Organization Name"
            placeholder="Enter a name"
            name="name"
          />
          <FormInput
            control={form.control}
            label="Organization Slug (optional)"
            placeholder="your-org-url"
            name="slug"
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                "Creating..."
              ) : (
                <span className="flex items-center gap-2">
                  Create Organization <ChevronRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </div>
        </motion.div>
      </form>
    </Form>
  );
};
export default memo(OrganizationForm);
