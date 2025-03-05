"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/21dev/spinner";
import { OnboardingStep } from "./page";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useOrganizationList } from "@clerk/nextjs";
import { UserMembershipParams } from "@/utils/organizations";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
const formSchema = z.object({
  organizationName: z.string().min(2, {
    message: "Organization name must be at least 2 characters.",
  }),
  asActive: z.boolean().optional(),
});

export default function CreateOrgForm({
  setActiveOnboardingStep,
}: {
  setActiveOnboardingStep: (step: OnboardingStep) => void;
}) {
  const {
    isLoaded: isOrgListLoaded,
    createOrganization: createOrg,
    setActive: setActiveOrg,
    userMemberships,
  } = useOrganizationList(UserMembershipParams);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: "",
      asActive: false,
    },
  });

  async function createOrgMutation(organizationName: string) {
    if (!isOrgListLoaded) {
      throw new Error("createOrg is not loaded");
    }

    try {
      const organization = await createOrg({
        name: organizationName,
      });
      void userMemberships?.revalidate();

      setActiveOrg({ organization });

      setActiveOnboardingStep(2);
    } catch (error) {
      console.error(error);
    }
  }

  const { mutate, isPending, isError, isSuccess, data, error } = useMutation({
    mutationFn: createOrgMutation,
    onSuccess: () => {
      toast.success("Organization created");
    },
    onError: () => {
      toast.error("Failed to create organization");
    },
  });

  const onSubmit = async (data: { organizationName: string }) => {
    if (!isOrgListLoaded) {
      return;
    }

    mutate(data.organizationName);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <FormField
          control={form.control}
          name="organizationName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Acme Co"
                  disabled={isPending}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                This is your organization's display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full"
          type="submit"
          disabled={isPending || !isOrgListLoaded || !form.formState.isValid}
        >
          {isPending ? (
            <>
              <Spinner /> <p>Creating organization...</p>
            </>
          ) : (
            "Create organization"
          )}
        </Button>
      </form>
    </Form>
  );
}
