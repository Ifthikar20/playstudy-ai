// types/next-auth.d.ts
import { Session as DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string; // Ensure id is required
    };
  }
}