import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

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

export default ConnectGithub;
