import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  BadgeCheckIcon,
  BellIcon,
  CreditCardIcon,
  LogOutIcon,
} from "lucide-react"
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";


export function DropdownAccountSwitcher() {

  const { user, logout } = useAuth();
  const router = useRouter();
  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    router.replace("/authentication/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="w-full justify-start">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
          {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-full md:w-48">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheckIcon />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCardIcon />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BellIcon />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOutIcon />
          <button onClick={handleLogout}>Logout</button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
