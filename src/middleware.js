import { withAuth } from "next-auth/middleware";

// Routes listed in the matcher require a logged-in user.
// Anyone without a session is redirected to the login page.
export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/appointments/:path*", "/profile/:path*"],
};
