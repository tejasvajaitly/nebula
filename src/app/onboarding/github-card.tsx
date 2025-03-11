import {
  Card,
  CardContent,
  CardDescription,
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
import { Button } from "@/components/ui/button";
import { Github, CloudAlert, RotateCcw, Check } from "lucide-react";
import { useGithubProfiles } from "@/hooks/github";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useOrganization } from "@clerk/nextjs";
import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

type GitHubUser =
  RestEndpointMethodTypes["users"]["getAuthenticated"]["response"]["data"];

export default function GithubCard({
  activeStep,
  setActiveStep,
  activeGithubProfile,
  setActiveGithubProfile,
}: {
  activeStep: number;
  setActiveStep: (step: number) => void;
  activeGithubProfile: GitHubUser | undefined;
  setActiveGithubProfile: (profile: GitHubUser | undefined) => void;
}) {
  const { data, isError, isPending, refetch } = useGithubProfiles();

  const { organization: currentOrg } = useOrganization();

  if (isPending) {
    return (
      <Card className="w-full text-sm">
        <CardHeader>
          <CardTitle className="flex flex-row justify-between items-center">
            <div className="flex flex-row items-center gap-4">
              <p>2. Connect your Github</p>
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

  if (isError) {
    return (
      <Card className="w-full text-sm">
        <CardHeader>
          <CardTitle className="flex flex-row justify-between items-center">
            <div className="flex flex-row items-center gap-4">
              <p>2. Connect your Github</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {!isPending && (
            <div className="flex flex-row justify-start items-center gap-2 text-destructive">
              <p>Error fetching Github profiles</p>
              <CloudAlert className="w-4 h-4" />
            </div>
          )}

          <Button
            className="w-full flex flex-row gap-2"
            onClick={() => refetch()}
          >
            <RotateCcw className="w-4 h-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      onClick={() => {
        if (currentOrg) setActiveStep(2);
      }}
      className={`w-full text-sm cursor-pointer ${
        activeStep === 2
          ? `border border-neutral-950 dark:border-neutral-50`
          : ``
      } ${
        currentOrg === undefined || currentOrg === null
          ? `cursor-not-allowed`
          : ``
      }`}
    >
      <CardHeader>
        <CardTitle className="flex flex-row justify-between items-center">
          <div className="flex flex-row items-center gap-4">
            <div>2. Connect your Github</div>
            {activeGithubProfile && (
              <Badge className="flex gap-2">
                <Github width={16} height={16} />
                {
                  data?.find(
                    (profile: GitHubUser) =>
                      profile.id === activeGithubProfile.id
                  )?.login
                }
              </Badge>
            )}
          </div>

          {activeGithubProfile && (
            <div className="top-0 right-0 rounded-full bg-green-600 dark:bg-green-500 text-white dark:text-zinc-950 p-0.5">
              <Check width={14} height={14} />
            </div>
          )}
        </CardTitle>
        <CardDescription>
          We need access to your Github to read your repository commits.
        </CardDescription>
      </CardHeader>
      {activeStep === 2 && (
        <>
          {data.length > 1 && (
            <>
              <CardContent>
                <Select
                  onValueChange={(value) => {
                    const tmp = data.find(
                      (profile) => profile.id.toString() === value
                    );
                    setActiveGithubProfile(tmp);
                    setActiveStep(3);
                  }}
                  value={activeGithubProfile?.id.toString()}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a GitHub account from the list" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {data?.map((profile: GitHubUser) => (
                        <SelectItem
                          key={profile.id}
                          value={profile.id.toString()}
                        >
                          {profile.login}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </CardContent>

              <CardContent>
                <CardDescription>OR</CardDescription>
              </CardContent>
            </>
          )}
          <CardContent>
            <ConnectGithub />
          </CardContent>
        </>
      )}
    </Card>
  );
}

function ConnectGithub() {
  const connectGitHub = () => {
    window.location.href = "/api/github-integration/start";
  };
  return (
    <Button onClick={connectGitHub} className="w-full flex gap-2">
      <Github className="w-4 h-4" />
      Connect a GitHub Account
    </Button>
  );
}
