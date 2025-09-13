"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { LogOut, Rocket, User } from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

/**
 * Authenticated user dropdown menu for the navbar.
 * Shows avatar trigger with glassmorphism dropdown panel.
 */
export function UserMenu() {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  const { name, email, image } = session.user;
  const sessionId = (session as { id?: string }).id;
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative rounded-full outline-none ring-1 ring-neutral-200 dark:ring-white/10 transition-all duration-200 hover:ring-pink-500/40 focus-visible:ring-2 focus-visible:ring-pink-500/60"
          type="button"
        >
          <Avatar className="size-8">
            <AvatarImage src={image ?? undefined} alt={name ?? "User"} />
            <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-xs font-semibold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-white dark:border-neutral-950 bg-emerald-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-56 rounded-xl border-neutral-200 dark:border-white/10 bg-white/95 dark:bg-neutral-900/95 p-1.5 text-neutral-900 dark:text-white shadow-2xl shadow-black/10 dark:shadow-black/40 backdrop-blur-xl"
      >
        {/* User info header */}
        <DropdownMenuLabel className="px-2 py-2.5 font-normal">
          <div className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarImage src={image ?? undefined} alt={name ?? "User"} />
              <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-xs font-semibold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-0.5">
              <p className="truncate text-sm font-medium text-neutral-900 dark:text-white">
                {name ?? "User"}
              </p>
              {email && (
                <p className="truncate text-xs text-neutral-400 dark:text-white/40">
                  {email}
                </p>
              )}
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-neutral-100 dark:bg-white/5" />

        <DropdownMenuGroup>
          <DropdownMenuItem
            asChild
            className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-neutral-500 dark:text-white/70 transition-colors hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white focus:bg-neutral-100 dark:focus:bg-white/5 focus:text-neutral-900 dark:focus:text-white"
          >
            <Link href={`/user/${sessionId}`}>
              <User className="size-4 text-neutral-400 dark:text-white/40" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-neutral-500 dark:text-white/70 transition-colors hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white focus:bg-neutral-100 dark:focus:bg-white/5 focus:text-neutral-900 dark:focus:text-white"
          >
            <Link href="/startup/create">
              <Rocket className="size-4 text-pink-400/70" />
              Create Pitch
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-neutral-100 dark:bg-white/5" />

        <DropdownMenuItem
          className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-neutral-500 dark:text-white/70 transition-colors hover:bg-red-500/10 hover:text-red-400 focus:bg-red-500/10 focus:text-red-400"
          onClick={() => signOut()}
        >
          <LogOut className="size-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
