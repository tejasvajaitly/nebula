import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import { useState } from "react";
import { useGithubRepositories } from "@/hooks/github";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CloudAlert, RotateCcw } from "lucide-react";
import { Spinner } from "@/components/21dev/spinner";

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
    <div className="flex flex-col justify-start items-start gap-2">
      Select GitHub Repository
      <Select onValueChange={setActiveRepository}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a repository" />
        </SelectTrigger>
        <SelectContent>
          {repositories?.map((repository: any) => (
            <SelectItem
              key={repository.id.toString()}
              value={repository.id.toString()}
            >
              {repository.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
