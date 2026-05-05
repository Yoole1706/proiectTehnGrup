import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	const session = request.cookies.get("__session");

	if (!session) {
		const authUrl = new URL("/auth", request.url);
		return NextResponse.redirect(authUrl);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/"],
};
