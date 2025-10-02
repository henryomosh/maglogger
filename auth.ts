"use server";
import bcrypt from "bcryptjs";
import { fetchUser } from "@/lib/data";
import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await fetchUser(email);
  if (!user) {
    return { success: false, message: "", error: "Email does not exist!" };
  }

  const passwordMatch = await bcrypt.compare(password, user?.password);
  if (user && passwordMatch) {
    await createSession(user?.id);

    return { success: true, message: "Success", error: "", user: user };
  }
  return {
    success: false,
    message: "",
    error: "Invalid credentials!",
  };
}

export async function logoutUser() {
  await deleteSession();
  redirect("/login");
}
