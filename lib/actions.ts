"use server";

import { revalidatePath } from "next/cache";
import sql from "@/lib/db";
import bcrypt from "bcryptjs";

export async function createStaff(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const role = formData.get("role") as string;
  const specialities = formData.get("specialities") as string;
  const status = formData.get("status") as string;
  const bio = formData.get("bio") as string;

  const password = "pass1234";
  const hashedPassword = await bcrypt.hash(password, 10);
  // Saving to a database

  try {
    await sql`
      INSERT INTO users (role, name, email, phone, specialities, status, bio, password)
      VALUES (${role}, ${name}, ${email}, ${phone}, ${specialities}, ${status}, ${bio}, ${hashedPassword})
    `;
  } catch (error: any) {
    if (error) {
      console.log(error?.detail);
    }
  }
  revalidatePath("/dashbord/staff");
  return { success: true, message: "Form submitted successfully!" };
}

export async function updateStaff(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const role = formData.get("role") as string;
  const specialities = formData.get("specialities") as string;
  const status = formData.get("status") as string;
  const bio = formData.get("bio") as string;

  // Saving to a database

  try {
    await sql`
      Update users 
      SET role = ${role}, name = ${name} , email = ${email} , phone = ${phone},
      specialities = ${specialities}, status = ${status}, bio = ${bio}
      WHERE id = ${id}
    `;
  } catch (error: any) {
    if (error) {
      console.log(error?.detail);
    }
  }
  revalidatePath("/dashbord/staff");
  return { success: true, message: "Form submitted successfully!" };
}

export async function deleteStaff(id: string) {
  await sql`DELETE FROM users WHERE id = ${id}`;
  revalidatePath("/dashboard/staff");
}

export async function createScheduling(formData: FormData) {
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const day = formData.get("day") as string;
  const host = formData.get("host") as string;
  const color = formData.get("color") as string;
  const startTime = formData.get("startTime") as string;
  const endTime = formData.get("endTime") as string;
  const date = formData.get("date") as string;
  const recurring = formData.get("recurring") as string;

  // Saving to a database
  console.log(title, category, description, day, host, color, startTime, endTime, date, recurring)
  try {
    await sql`
     
    `;
  } catch (error: any) {
    if (error) {
      console.log(error?.detail);
    }
  }
  revalidatePath("/dashbord/staff");
  return { success: true, message: "Form submitted successfully!" };
}
