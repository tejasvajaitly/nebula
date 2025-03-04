import Tiptap from "@/components/editor/tiptap";
import { ModeToggle } from "@/components/mode-toggle";

export default function Page() {
  return (
    <div>
      Dashboard
      <ModeToggle />
      <Tiptap />
    </div>
  );
}
