import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from 'Zod'
import { User } from "./app/lib/definitions";
import { sql } from "@vercel/postgres";
import bcrypt from 'bcrypt'

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`
    console.log(user, 'userrrrr');
    return user.rows[0]
  } catch (error) {
    console.error('Failed to fetch user', error)
    throw new Error('Failed to fetch user')
  }
}

// File untuk hashing password menggunakan bcrypt package dibuat terpisah karena bcrypt mengandalkan Node.js API yg tidak ada di Next.js Middleware
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // providers: [Credentials({
  //   // async authorize(credentials) {
  //   //   console.log('mamakkkk');
      
  //   //   const parsedCredentials = z.
  //   //     object({ email: z.string().email(), password: z.string().min(6) })
  //   //     .safeParse(credentials)
  //   //   console.log(parsedCredentials, 'parsedCredentials');

  //   //   if (parsedCredentials.success) {
  //   //     const { email, password } = parsedCredentials.data
  //   //     const user = await getUser(email)
  //   //     if (!user) return null
  //   //     const passwordMatch = await bcrypt.compare(password, user.password) // membandingkan password yg diinput user dg yg ada di database

  //   //     if (passwordMatch) return user
  //   //   }

  //   //   console.log('Invalid credentials');

  //   //   return null
  //   // }
  // }),
  // ] // Credentials provider mengizinkan users untuk login dg username dan password
})
