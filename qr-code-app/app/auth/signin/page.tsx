import { signIn } from "@/auth"
import PageTitle from "@/components/PageTitle"

export default function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>
}) {
  return <SignInContent searchParams={searchParams} />
}

async function SignInContent({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>
}) {
  const params = await searchParams
  const isAccessDenied = params.error === "AccessDenied"

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <PageTitle fontSize={44}>Admin Access</PageTitle>
          <p className="text-white/40 text-sm mt-1">HackaBull check-in dashboard</p>
        </div>

        <a
          href="/"
          className="flex items-center gap-1.5 text-sm text-white/35 hover:text-white/65 transition-colors mb-5"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </a>

        <div className="rounded-lg p-6 glass-panel">
          {isAccessDenied && (
            <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-300 text-sm">
              Access denied. Your account is not on the approved list.
            </div>
          )}

          <form
            action={async () => {
              "use server"
              await signIn("google", {
                redirectTo: params.callbackUrl ?? "/admin",
              })
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-slate-900 rounded-md text-sm font-semibold hover:bg-white/90 transition-colors"
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.583c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.583 9 3.583z"
      />
    </svg>
  )
}
