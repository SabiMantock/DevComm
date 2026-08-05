import Sidebar from "@/components/Sidebar";

export default function RootGroupLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
