import { SidebarProvider } from "@/components/ui/sidebar"
import { UserSidebar } from "@/components/shared/UserSidebar";
import { RequireAuth } from "@/components/shared/RequireAuth";
import "../globals.css";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="p-10">
    <RequireAuth>
      <SidebarProvider
        defaultOpen={true}
        >
        <UserSidebar />
          {children}
      </SidebarProvider>
    </RequireAuth>
    </div>
  );
}
