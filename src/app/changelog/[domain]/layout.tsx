// import { use } from "react";

// export default async function Layout({
//   params,
//   children,
// }: {
//   params: Promise<{ domain: string }>;
//   children: React.ReactNode;
// }) {
//   const { domain } = use(params);
//   const decodedDomain = decodeURIComponent(domain);
//   return (
//     <div>
//       <p>{decodedDomain}</p>
//       {children}
//     </div>
//   );
// }

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
