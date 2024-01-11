import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Middleware > untuk menjaga agar route tidak mulai rendering sampai middleware memverifikasi authentication, meningkatkan keamanan dan performa aplikasi
export default NextAuth(authConfig).auth

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  // metcher option dari Middleware untuk specify bahwa ini harus run pada path" yg spesifik
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
}