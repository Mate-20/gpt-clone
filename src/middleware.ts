// import type { NextRequest } from "next/server";
// import { NextResponse } from 'next/server';
// import { v4 as uuid } from "uuid";

// export async function middleware(request: NextRequest) {
//   const response = NextResponse.next();
//   let userId = request.cookies.get("user_id")?.value;
//   if (!userId) {
//     userId = uuid();
//     response.cookies.set("user_id", userId);
//   }
//   return response;
// }

import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};