"use client";

import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { SignInModal } from "./sign-in-modal";
import { UserMenu } from "./user-menu";

/**
 * Auth controls for the navbar.
 * Shows UserMenu when authenticated, Sign In button when not.
 */
export function NavbarAuth() {
  const { data: session, status } = useSession();
  const [showModal, setShowModal] = useState(false);

  if (status === "loading") {
    return (
      <Skeleton className="size-8 rounded-full bg-neutral-100 dark:bg-white/5" />
    );
  }

  if (session?.user) {
    return <UserMenu />;
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setShowModal(true)}
        className="rounded-lg border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-white/5 text-xs text-neutral-500 dark:text-white/70 hover:border-pink-500/30 hover:bg-pink-500/10 hover:text-pink-300"
      >
        Sign In
      </Button>
      <SignInModal open={showModal} onOpenChange={setShowModal} />
    </>
  );
}
