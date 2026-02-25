"use client";
import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { LogOut, User as UserIcon } from "lucide-react";
import LogoutButton from "./logout-button";
import { useCurrentUser } from "../hooks/use-current-user";

const UserButton = () => {
    // Just use the client hook.
    const user = useCurrentUser();

    if (!user) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <div className={cn("relative rounded-full")}>
                    <Avatar>
                        <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
                        <AvatarFallback className="bg-purple-900 border border-purple-500/50">
                            <UserIcon className="text-purple-300" />
                        </AvatarFallback>
                    </Avatar>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-4 bg-[#0a0014] border-purple-900/30 text-zinc-300">
                <DropdownMenuItem className="focus:bg-purple-900/40 focus:text-purple-300">
                    <span>{user?.email}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-purple-900/20" />
                <LogoutButton>
                    <DropdownMenuItem className="text-red-400 focus:bg-red-500/10 focus:text-red-300 cursor-pointer">
                        <LogOut className="h-4 w-4 mr-2" />
                        LogOut
                    </DropdownMenuItem>
                </LogoutButton>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserButton;