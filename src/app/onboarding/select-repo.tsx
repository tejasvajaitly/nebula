import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCcw } from "lucide-react";
import { SelectItem } from "@/components/ui/select";
import { CloudAlert } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/21dev/spinner";

export default function SelectRepo({
  repoList,
  repoListLoading,
  repoListError,
  setSelectedRepo,
  repoListRefetch,
  repoListIsFetching,
}: {
  repoList: any;
  repoListLoading: boolean;
  repoListError: boolean;
  setSelectedRepo: (repo: string | null) => void;
  repoListRefetch: () => void;
  repoListIsFetching: boolean;
}) {
  if (repoListLoading) {
    return (
      <div className="flex flex-col justify-start items-start gap-2">
        Select GitHub Repository
        <Skeleton className="w-full h-6" />
      </div>
    );
  }

  if (repoListError) {
    return (
      <div className="flex flex-col justify-start items-start gap-2">
        Select GitHub Repository
        <div className="flex flex-row justify-start items-center gap-2 text-destructive">
          <p>Error fetching Github profiles</p>
          <CloudAlert className="w-4 h-4" />
        </div>
        <Button
          className="w-full flex flex-row gap-2"
          onClick={repoListRefetch}
          disabled={repoListIsFetching}
        >
          {repoListIsFetching ? (
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
      <Select onValueChange={setSelectedRepo}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a repository" />
        </SelectTrigger>
        <SelectContent>
          {repoList?.repos?.map((repo: any) => (
            <SelectItem key={repo.id} value={repo}>
              {repo.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
