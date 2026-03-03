import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"
import AdminDashboard from "@/components/AdminDashboard"

export default async function AdminPage() {
  const session = await auth()

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <main className="h-dvh flex flex-col p-4">
      <div className="max-w-lg mx-auto w-full flex flex-col flex-1 min-h-0">
        <div className="flex items-center justify-between mb-5 px-4 py-2.5 rounded-lg glass-panel shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {session.user?.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt=""
                width={26}
                height={26}
                className="rounded-full shrink-0 opacity-90"
              />
            )}
            <span className="text-sm text-white/50 truncate">
              {session.user?.email}
            </span>
          </div>
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/auth/signin" })
            }}
          >
            <button
              type="submit"
              className="ml-4 px-3 py-1 text-xs text-white/40 border border-white/[0.12] rounded-lg hover:text-white/70 hover:border-white/25 transition-colors shrink-0"
            >
              Sign out
            </button>
          </form>
        </div>

        <AdminDashboard userImage={session.user?.image ?? undefined} />
      </div>
    </main>
  )
}
