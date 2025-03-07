import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Building, Check } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UserMembershipParams } from "@/utils/organizations";
import { useOrganizationList, useOrganization } from "@clerk/nextjs";

export default function OrgCard({
  activeStep,
  setActiveStep,
}: {
  activeStep: number;
  setActiveStep: (step: number) => void;
}) {
  const { isLoaded: isOrgListLoaded, userMemberships } =
    useOrganizationList(UserMembershipParams);

  const { isLoaded: isCurrentOrgLoaded, organization: currentOrg } =
    useOrganization();

  if (!isOrgListLoaded || !isCurrentOrgLoaded) {
    return (
      <Card className="w-full text-sm">
        <CardHeader>
          <CardTitle className="flex flex-row justify-between items-center">
            <div className="flex flex-row items-center gap-4">
              <p>1. Organization Profile</p>
              <Skeleton className="w-16 h-4" />
            </div>

            <Skeleton className="w-6 h-6 rounded-full" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-6" />
        </CardContent>
      </Card>
    );
  }

  if (userMemberships.count === 0) {
    return (
      <Card
        onClick={() => setActiveStep(1)}
        className={`w-full text-sm cursor-pointer ${
          activeStep === 1
            ? "border border-neutral-950 dark:border-neutral-50"
            : ""
        }`}
      >
        <CardHeader>
          <CardTitle>1. Organization Profile</CardTitle>
          <CardDescription>
            You need to be a part of an org to continue.
          </CardDescription>
        </CardHeader>
        {activeStep === 1 && (
          <CardContent>
            <CreateOrgForm setActiveStep={setActiveStep} />
          </CardContent>
        )}
      </Card>
    );
  }

  return (
    <Card
      onClick={() => setActiveStep(1)}
      className={`w-full text-sm cursor-pointer ${
        activeStep === 1
          ? "border border-neutral-950 dark:border-neutral-50"
          : ""
      }`}
    >
      <CardHeader>
        <CardTitle className="flex flex-row justify-between items-center">
          <div className="flex flex-row items-center gap-4">
            <p>1. Current organization</p>
            <Badge className="flex gap-2">
              <Building width={14} height={14} /> {currentOrg?.name}
            </Badge>
          </div>

          <div className="top-0 right-0 rounded-full bg-green-600 dark:bg-green-500 text-white dark:text-zinc-950 p-0.5">
            <Check width={14} height={14} />
          </div>
        </CardTitle>
        <CardDescription>
          You need to be a part of an org to continue.
        </CardDescription>
      </CardHeader>
      {activeStep === 1 && (
        <>
          <CardContent>
            <SelectOrg />
          </CardContent>
          <CardContent>
            <CardDescription>OR</CardDescription>
          </CardContent>
          <CardFooter>
            <CreateOrgForm setActiveStep={setActiveStep} />
          </CardFooter>
        </>
      )}
    </Card>
  );
}

function SelectOrg() {
  const {
    isLoaded: isOrgListLoaded,
    setActive: setActiveOrg,
    userMemberships,
  } = useOrganizationList(UserMembershipParams);

  const { isLoaded: isCurrentOrgLoaded, organization: currentOrg } =
    useOrganization();

  if (!isOrgListLoaded || !isCurrentOrgLoaded) {
    return <Skeleton className="w-full h-6" />;
  }

  return (
    <Select
      onValueChange={async (value) => {
        await setActiveOrg({ organization: value });
        toast.success("Organization set");
      }}
      value={currentOrg?.id}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select an organization from the list" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {userMemberships.data?.map((mem: any) => (
            <SelectItem key={mem.organization.id} value={mem.organization.id}>
              {mem.organization.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

const formSchema = z.object({
  organizationName: z.string().min(2, {
    message: "Organization name must be at least 2 characters.",
  }),
  asActive: z.boolean().optional(),
});

function CreateOrgForm({
  setActiveStep,
}: {
  setActiveStep: (step: number) => void;
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

      setActiveStep(2);
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
