import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

const allowedEmails = (process.env.ALLOWED_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  pages: { signIn: "/auth/signin" },
  callbacks: {
    signIn({ user }) {
      if (allowedEmails.length === 0) return false
      return allowedEmails.includes(user.email?.toLowerCase() ?? "")
    },
  },
})
