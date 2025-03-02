"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrganizationList } from "@clerk/nextjs";
import { useOrganization } from "@clerk/nextjs";
import { UserMembershipParams } from "@/utils/organizations";
import { toast } from "sonner";

export default function SelectOrg() {
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
