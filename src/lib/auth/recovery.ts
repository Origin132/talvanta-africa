import "server-only";
import { cookies } from "next/headers";

const RECOVERY_COOKIE = "talvanta-recovery-intent";

export async function setRecoveryIntent() {
  (await cookies()).set(RECOVERY_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 15 * 60,
  });
}

export async function hasRecoveryIntent() {
  return (await cookies()).get(RECOVERY_COOKIE)?.value === "1";
}

export async function clearRecoveryIntent() {
  (await cookies()).delete(RECOVERY_COOKIE);
}
