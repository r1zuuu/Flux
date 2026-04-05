import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// if user not logged and tries to acces dashboard redirect to login page
// if user is logged in and tries to access login redirect to dashboard why would he try to login again? nonsense
export default withAuth(
  function middleware(req) {
    const isLoggedIn = !!req.nextauth.token;
    const { nextUrl } = req;

    // define paths that should be protected and require authentication
    const isDashboardRoute = nextUrl.pathname.startsWith("/transactions");

    if (isDashboardRoute && !isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};