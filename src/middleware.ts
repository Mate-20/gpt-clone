import type { NextRequest } from "next/server";
import { NextResponse } from 'next/server';
import { v4 as uuid } from "uuid";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  let userId = request.cookies.get("user_id")?.value;
  if (!userId) {
    userId = uuid();
    response.cookies.set("user_id", userId);
  }
  return response;
}
