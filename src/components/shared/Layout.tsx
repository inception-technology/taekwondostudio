import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Toaster } from "sonner";
import "@/styles/components.css";

const Layout = ({children }: { children: React.ReactNode }) => {

  return (
      <>
      <Header />
        <main className="flex min-h-screen flex-col items-center p-24">
          <Toaster richColors />
          {children}
        </main>
      <Footer />
    </>
  );
}

export default Layout;