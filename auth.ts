import NextAuth from "next-auth";
import PostgresAdapter from "@auth/pg-adapter";
import { Pool } from "@neondatabase/serverless";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import { authConfig } from "./auth.config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PostgresAdapter(pool),
  providers: [
    // Override Credentials with the full authorize logic (has DB access)
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const users = await sql`
          SELECT * FROM users WHERE email = ${credentials.email as string} LIMIT 1
        `;

        if (!users || users.length === 0) return null;
        const user = users[0];

        if (!user.password_hash) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password_hash as string
        );

        if (!isValid) return null;

        return { id: user.id as string, email: user.email as string, name: user.name as string };
      },
    }),
  ],
});
