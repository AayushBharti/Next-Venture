import Navbar from "@/components/navigation-bar"

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="relative mx-auto">
      <Navbar />
      {children}
    </main>
  )
}
