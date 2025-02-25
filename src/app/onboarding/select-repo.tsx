import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectItem } from "@/components/ui/select";

export default function SelectRepo({
  repoList,
  setSelectedRepo,
}: {
  repoList: any;
  selectedRepo: string | null;
  setSelectedRepo: (repo: string | null) => void;
}) {
  if (!repoList) {
    return null;
  }

  return (
    <div>
      Select GitHub Repository
      <Select onValueChange={setSelectedRepo}>
        <SelectTrigger>
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
