import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export default function GithubCard({
  activeStep,
  setActiveStep,
}: {
  activeStep: number;
  setActiveStep: (step: number) => void;
}) {
  return (
    <Card
      onClick={() => setActiveStep(2)}
      className={`w-full text-sm cursor-pointer ${
        activeStep === 2
          ? `border border-neutral-950 dark:border-neutral-50`
          : ``
      }`}
    >
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <ConnectGithub />
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
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
      Connect GitHub
    </Button>
  );
}
