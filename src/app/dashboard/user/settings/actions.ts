"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * Updates user profile details (Name and Email)
 */
export async function updateProfile(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { success: false, error: "Unauthorized access." };

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  if (!name || name.trim().length < 2) {
    return { success: false, error: "Name must be at least 2 characters long." };
  }

  if (!email || !email.includes("@")) {
    return { success: false, error: "Please enter a valid email address." };
  }

  try {
    // Check if email is being changed and if the new email is already taken
    if (email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return { success: false, error: "This email address is already in use." };
      }
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { name, email },
    });

    revalidatePath("/dashboard/user/settings");
    return { success: true, message: "Profile updated successfully." };
  } catch (error) {
    console.error("Profile update error:", error);
    return { success: false, error: "Failed to update profile statistics." };
  }
}

/**
 * Completely purges a user's account from the database
 */
export async function deleteAccount() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { success: false, error: "Unauthorized." };

  try {
    // Cascade settings in prisma schema will automatically clean up sessions, accounts, and orders
    await prisma.user.delete({
      where: { id: session.user.id },
    });

    return { success: true };
  } catch (error) {
    console.error("Account deletion error:", error);
    return { success: false, error: "Failed to securely wipe user data record." };
  }
}
