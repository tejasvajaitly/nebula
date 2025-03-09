import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/21dev/spinner";
import { useGithubRepositories } from "@/hooks/github";
import {
  CloudAlert,
  RotateCcw,
  Check,
  ChevronsUpDown,
  LockKeyhole,
  Clock,
  Dot,
} from "lucide-react";
import {
  formatDistanceToNow,
  format,
  isThisYear,
  differenceInDays,
} from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

type Repositories =
  RestEndpointMethodTypes["repos"]["listForAuthenticatedUser"]["response"]["data"];

type Repository = Repositories[number];

export default function ChangelogCard({
  activeStep,
  setActiveStep,
  activeGithubProfile,
}: {
  activeStep: number;
  setActiveStep: (step: number) => void;
  activeGithubProfile: string | undefined;
}) {
  const [activeRepository, setActiveRepository] = useState<string | undefined>(
    undefined
  );

  const {
    data: repositories,
    isPending: repositoriesIsPending,
    isError: repositoriesIsError,
    refetch: refetchRepositories,
  } = useGithubRepositories(activeGithubProfile);
  return (
    <Card
      onClick={() => setActiveStep(3)}
      className={`w-full text-sm cursor-pointer ${
        activeStep === 3
          ? `border border-neutral-950 dark:border-neutral-50`
          : ``
      }`}
    >
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <SelectRepositories
          activeRepository={activeRepository}
          setActiveRepository={setActiveRepository}
          repositories={repositories}
          repositoriesIsPending={repositoriesIsPending}
          repositoriesIsError={repositoriesIsError}
          refetchRepositories={refetchRepositories}
        />
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
}

function SelectRepositories({
  activeRepository,
  setActiveRepository,
  repositories,
  repositoriesIsPending,
  repositoriesIsError,
  refetchRepositories,
}: {
  activeRepository: string | undefined;
  setActiveRepository: (id: string) => void;
  repositories: Repositories;
  repositoriesIsPending: boolean;
  repositoriesIsError: boolean;
  refetchRepositories: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  if (repositoriesIsPending) {
    return (
      <div className="flex flex-col justify-start items-start gap-2">
        Select GitHub Repository
        <Skeleton className="w-full h-6" />
      </div>
    );
  }
  if (repositoriesIsError) {
    return (
      <div className="flex flex-col justify-start items-start gap-2">
        Select GitHub Repository
        <div className="flex flex-row justify-start items-center gap-2 text-destructive">
          <p>Error fetching Github profiles</p>
          <CloudAlert className="w-4 h-4" />
        </div>
        <Button
          className="w-full flex flex-row gap-2"
          onClick={refetchRepositories}
          disabled={repositoriesIsPending}
        >
          {repositoriesIsPending ? (
            <Spinner className="w-4 h-4" />
          ) : (
            <RotateCcw className="w-4 h-4" />
          )}
          Retry
        </Button>
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? repositories.find((repository) => repository.name === value)?.name
            : "Select repository..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No repository found.</CommandEmpty>
            <CommandGroup>
              {repositories.map((repository) => (
                <CommandItem
                  className="flex flex-row justify-between"
                  key={repository.name}
                  value={repository.name}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2 items-center justify-start">
                      <LockKeyhole
                        className={repository.private ? `` : `opacity-0`}
                      />
                      <p>{repository.name}</p>
                    </div>

                    <div className="flex flex-row gap-2 items-center justify-start">
                      <Clock className="opacity-0" />
                      <p className="text-xs text-muted-foreground">
                        {formatUpdatedAt(repository.updated_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row gap-4">
                    <div className="flex flex-row gap-2 items-center">
                      <Avatar className="w-4 h-4">
                        <AvatarImage src={repository.owner.avatar_url} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <p>{repository.owner.login}</p>
                    </div>

                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === repository.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function formatUpdatedAt(updatedAt: string | null) {
  if (!updatedAt) return "";
  const date = new Date(updatedAt);
  const daysDifference = differenceInDays(new Date(), date);

  if (daysDifference < 7) {
    return formatDistanceToNow(date, { addSuffix: true });
  } else if (daysDifference < 365 && isThisYear(date)) {
    return format(date, "MMMM d");
  } else {
    return format(date, "MM/dd/yy");
  }
}
