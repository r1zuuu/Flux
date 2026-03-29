export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 font-sans">
      <div className="w-full max-w-100 p-4">
        {children}
      </div>
    </div>
  )
}