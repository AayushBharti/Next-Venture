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
        className="h-8 rounded-lg text-xs"
      >
        Sign In
      </Button>
      <SignInModal open={showModal} onOpenChange={setShowModal} />
    </>
  );
}
