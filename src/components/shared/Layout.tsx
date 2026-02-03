import Footer from "@/components/shared/Footer";
import { Toaster } from "sonner";
import "@/styles/components.css";

const Layout = ({children }: { children: React.ReactNode }) => {

  return (
      <>
        <main className="flex flex-col w-full">
          <Toaster richColors />
          {children}
        </main>
      <Footer />
    </>
  );
}

export default Layout;