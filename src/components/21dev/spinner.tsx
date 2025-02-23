import { cn } from "@/lib/utils";
import { LoaderIcon, type LucideProps } from "lucide-react";

type SpinnerVariantProps = Omit<SpinnerProps, "variant">;

const Default = ({ className, ...props }: SpinnerVariantProps) => (
  <LoaderIcon className={cn("animate-spin", className)} {...props} />
);

export type SpinnerProps = LucideProps & {
  variant?: "default";
};

export const Spinner = ({ variant, ...props }: SpinnerProps) => {
  switch (variant) {
    default:
      return <Default {...props} />;
  }
};
