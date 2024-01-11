import type { NextAuthConfig } from 'next-auth'

export const authConfig = { // This object will contain the configuration options for NextAuth.js
  // TODO: coba nanti comment ini signIn kalo sudah isi authorization
  // by adding signIn: '/login' into our pages option, the user will be redirected to our custom login page, rather than the NextAuth.js default page
  pages: {
    signIn: '/login'
  },
  callbacks: {
    // callback authorized digunakan untuk verify request yg mengakses page tertentu, dipanggil sebelum request selesai dan menerima object dg "auth" & "request" properties
    // auth property > berisi session user
    // request property > berisi request yg datang
    authorized({ auth, request: { nextUrl } }) {
      console.log(auth, ';reqqq');
      
      console.log(!!auth?.user, 'auth');
      const isLoggedIn = !!auth?.user // ini simplenya dia validasi (in condition) sekaligus lempar hasil validasinya
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      if (isOnDashboard) {
        console.log('on dashboard')
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }
      console.log('neither');

      return true // ini kondisi ketika tidak di page dashboard dan dia belum login tapi ngakses page login
    }
  },
  // providers ini adalah sebuah array yg mana kita melakukan list opsi login yg berbeda kayak : Google or Github
  providers: [], // Add providers with an empty array for now to satisfy NextAuth config
} satisfies NextAuthConfig
