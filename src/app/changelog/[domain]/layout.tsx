export default async function Layout({
  params,
  children,
}: {
  params: { domain: string };
  children: React.ReactNode;
}) {
  const domain = decodeURIComponent((await params).domain);
  return (
    <div>
      <p>{domain}</p>
      {children}
    </div>
  );
}
