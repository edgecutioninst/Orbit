import NextAuth from "next-auth"

import {

    DEFAULT_LOGIN_REDIRECT,
    authRoutes,
    apiAuthPrefix,
    // protectedRoutes,
    publicRoutes

} from "@/routes"

import authConfig from "./auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const { nextUrl } = req
    const isLoggedIn = !!req.auth

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
    // const isProtectedRoute = protectedRoutes.some((route) => route === nextUrl.pathname)


    if (isApiAuthRoute) { return null }

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url))
        }
        return null
    }

    if (!isLoggedIn && !isPublicRoute) {
        return Response.redirect(new URL("/auth/sign-in", nextUrl))
    }

    return null;
})

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};