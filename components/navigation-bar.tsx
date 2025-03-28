import { HelpCircle, Home, LogOut, Plus, Puzzle, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { auth, signIn, signOut } from "@/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import logoImage from "@/public/images/logo.svg"

const navLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "Features", href: "/#features", icon: Zap },
  { label: "Integrations", href: "/#integrations", icon: Puzzle },
  { label: "FAQs", href: "/#faqs", icon: HelpCircle },
]

const Navbar = async () => {
  const session = await auth()

  return (
    <header className="fixed top-0 z-[100] w-full py-4 lg:py-6">
      <div className="container max-w-6xl">
        <nav className="rounded-full border border-white/10 bg-black/60 backdrop-blur-md">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <Link href="/" className="mr-6">
                <Image
                  src={logoImage}
                  alt="Next ventures logo"
                  width={120}
                  height={40}
                  className="h-6 w-auto"
                />
              </Link>
              <ul className="hidden gap-6 lg:flex">
                {navLinks.map(link => (
                  <li key={link.label}>
                    <NavLink href={link.href}>{link.label}</NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-4">
              {session && session.user ? (
                <UserMenu session={session} />
              ) : (
                <LoginButton />
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}

const NavLink = ({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) => (
  <Link
    href={href}
    className="text-sm font-medium text-white/80 transition-colors hover:text-white"
  >
    {children}
  </Link>
)

const UserMenu = ({ session }: { session: any }) => (
  <>
    <Link href="/startup/create" className="hidden md:block">
      <Button
        variant="secondary"
        size="sm"
        className="h-9 rounded-full bg-pink-400 px-4 text-base text-black hover:bg-pink-500"
      >
        <Plus className="mr-1 size-4" />
        Create
      </Button>
    </Link>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="size-9 rounded-full p-0"
          aria-label="User menu"
        >
          <Avatar className="size-9">
            <AvatarImage
              src={session.user.image || ""}
              alt={session.user.name || ""}
            />
            <AvatarFallback>
              {session.user.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="z-[100] w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <Link
            href={`/user/${session.id}`}
            className="flex flex-col space-y-1"
          >
            <p className="text-sm font-medium leading-none">
              {session.user.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user.email}
            </p>
          </Link>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/startup/create">
            <Plus className="mr-2 size-4" />
            <span>Create Pitch</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {navLinks.map(link => (
          <DropdownMenuItem key={link.label} asChild>
            <Link href={link.href}>
              <link.icon className="mr-2 size-4" />
              <span>{link.label}</span>
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/" })
            }}
          >
            <button
              type="submit"
              className="flex w-full items-center text-left"
            >
              <LogOut className="mr-2 size-4" />
              <span>Logout</span>
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </>
)

const LoginButton = () => (
  <form
    action={async () => {
      "use server"
      await signIn("github")
    }}
  >
    <Button
      type="submit"
      variant="secondary"
      size="sm"
      className="h-9 rounded-full bg-pink-400 px-4 text-base text-black hover:bg-pink-500"
    >
      Login
    </Button>
  </form>
)

export default Navbar
