export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="p-24 flex flex-col justify-start items-center">
      {children}
    </div>
  );
}
