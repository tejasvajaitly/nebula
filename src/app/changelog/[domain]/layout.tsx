export default function Layout({
  params,
  children,
}: {
  params: { domain: string };
  children: React.ReactNode;
}) {
  const domain = decodeURIComponent(params.domain);
  return (
    <div>
      <p>{domain}</p>
      {children}
    </div>
  );
}
