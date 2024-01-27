import authConfig from "./auth.config";
import NextAuth from "next-auth";
import { apiAuthPrefix,DEFAULT_LOGIN_REDIRECT,authRoutes,publicRoutes } from "./routes";


const {auth} = NextAuth(authConfig)

export default auth((req) => {
  const {nextUrl} = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoutes = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoutes = authRoutes.includes(nextUrl.pathname);

  if(isApiAuthRoute){
    return null;
  }
  if(isAuthRoutes){
    if(isLoggedIn){
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT,nextUrl))
    }
    return null;
  }

  if(!isLoggedIn && !isPublicRoutes){

    let callBackUrl = nextUrl.pathname;
    if(nextUrl.search){
      callBackUrl += nextUrl.search;
    }

    const encodedCallBackUrl = encodeURIComponent(callBackUrl);

    return Response.redirect(new URL(`/auth/login?callbackurl=${encodedCallBackUrl}`,nextUrl))
  }

  return null

})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}






// const isLoggedIn = !!req.auth;
// // req.auth
// console.log("pathname",req.nextUrl.pathname);
// console.log("loggen ?", isLoggedIn);