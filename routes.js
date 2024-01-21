// These routes do not require authentication

export const publicRoutes = [
    "/",
    "/auth/new-verification"
];


// These routes do  require authenticationi These routes will redirect logged in users to /setting

export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/auth/reset",
    "/auth/new-password"
];


// The prefix for api authentication routes.Routes tjat start with this prefix are used for api authentication purposes

export const apiAuthPrefix = "/api/auth"


//The default redirect path after logging in

export const DEFAULT_LOGIN_REDIRECT = "/settings"