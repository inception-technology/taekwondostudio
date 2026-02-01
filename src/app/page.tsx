import Home from './authentication/page';
import { RequireGuest } from "@/components/shared/RequireGuest";
export default function Page() {
  
  return (
    <RequireGuest>
    <Home />
    </RequireGuest>
  );
}