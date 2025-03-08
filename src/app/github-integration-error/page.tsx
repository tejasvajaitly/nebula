import Link from "next/link";

export default function Page() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-4">
      <h1 className="text-4xl">Sorry</h1>
      <h2>Something went wrong during GitHub OAuth process!</h2>
      <Link className="underline" href="/">
        Go back to homepage
      </Link>
    </div>
  );
}
