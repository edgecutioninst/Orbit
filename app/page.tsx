import { Button } from "@/components/ui/button";
import LogoutButton from "@/modules/auth/components/logout-button";
import UserButton from "@/modules/auth/components/user-button";
import Image from "next/image";

export default async function Home() {
  return (
    <div>
      <Button>Click</Button>
      <UserButton />
    </div>
  )
}
