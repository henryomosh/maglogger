"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sql from "@/lib/db";
import bcrypt from "bcryptjs";
import { fetchUser, fetchUserById } from "@/lib/data";
import { formatDateToLocal } from "./utils";
import { DateTime } from "luxon";

export async function createStaff(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const role = formData.get("role") as string;
  const specialities = formData.get("specialities") as string;
  const status = formData.get("status") as string;
  const bio = formData.get("bio") as string;
  const login = formData.get("login") as string;
  const logout = formData.get("logout") as string;

  const password = formData.get("password") as string;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await fetchUser(email);
  if (user) {
    return { success: false, message: "A user with that email exists!" };
  }

  // Saving to a database

  try {
    await sql`
      INSERT INTO users (role, name, email, phone, specialities, status, bio, password, login, logout)
      VALUES (${role}, ${name}, ${email}, ${phone}, ${specialities}, ${status}, ${bio}, ${hashedPassword}, ${login}, ${logout})
    `;
  } catch (error: any) {
    if (error) {
      return { success: false, message: "Server error occured" };
    }
  }
  revalidatePath("/dashboard/staff");
  return { success: true, message: "" };
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
  const password = formData.get("password") as string;
  const login = formData.get("login") as string;
  const logout = formData.get("logout") as string;

  const user = await fetchUserById(id);
  let setPassword = user?.password;

  if (user.email !== email) {
    const checkEmail = await fetchUser(email);
    if (checkEmail) {
      return { success: false, message: "A user with that email exist!" };
    }
  }

  if (password !== "") {
    const hashedPassword = await bcrypt.hash(password, 10);
    setPassword = hashedPassword;
  }

  try {
    await sql`
      UPDATE users
      SET role = ${role}, name = ${name} , email = ${email} , phone = ${phone},
      specialities = ${specialities}, status = ${status}, bio = ${bio} , password=${setPassword}, login= ${login}, logout=${logout}
      WHERE id = ${id}
    `;
  } catch (error: any) {
    if (error) {
      console.log(error);
      return { success: false, message: "Server error occured" };
    }
  }
  revalidatePath("/dashboard/staff");
  return { success: true, message: "Form submitted successfully!" };
}

export async function deleteStaff(id: string) {
  await sql`DELETE FROM users WHERE id = ${id}`;
  await sql`DELETE FROM scheduling WHERE staff = ${id}`;
  await sql`DELETE FROM logs WHERE staff = ${id}`;
  revalidatePath("/dashboard/staff");
}

export async function createScheduling(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const color = formData.get("color") as string;
  const startTime = formData.get("startTime") as string;
  const endTime = formData.get("endTime") as string;
  const date = formData.get("date") as string;
  const recurring = formData.get("isRecurring");
  const staffId = formData.get("staffId") as string;
  let days = formData.get("days") as string;
  const standIn = formData.get("stand-in") as string;

  // Saving to a database

  const created = new Date();
  const isRecurring = recurring ? true : false;

  if (!isRecurring) {
    const daysParsed = JSON.parse(days);
    const dayValue = new Date(date).getDay();
    daysParsed[dayValue].value = true;
    days = JSON.stringify(daysParsed);
  }

  try {
    await sql` INSERT INTO scheduling (title, standin, description, days, color, start, ends, recurring, created, date,  staff)
    VALUES (${title}, ${standIn},  ${description}, ${days},  ${color}, ${startTime}, ${endTime}, ${isRecurring}, ${created}, ${date}, ${staffId} )
    `;
    revalidatePath("/dashboard/schedulindg");
  } catch (error: any) {
    if (error) {
      console.log(error);
      return { success: false, message: "Opps! Something went wrong." };
    }
  }
}

export async function updateScheduling(formData: FormData) {
  const title = formData.get("title") as string;
  const staffId = formData.get("staffId") as string;
  const description = formData.get("description") as string;
  const color = formData.get("color") as string;
  const startTime = formData.get("startTime") as string;
  const endTime = formData.get("endTime") as string;
  const date = formData.get("date") as string;
  const recurring = formData.get("isRecurring");
  const id = formData.get("id") as string;
  let days = formData.get("days") as string;
  const standIn = formData.get("stand-in") as string;

  // Saving to a database

  const isRecurring = recurring ? true : false;

  if (!isRecurring) {
    const daysParsed = JSON.parse(days);
    const dayValue = new Date(date).getDay();
    daysParsed[dayValue].value = true;
    days = JSON.stringify(daysParsed);
  }

  try {
    await sql` UPDATE 
     scheduling SET title=${title}, standin=${standIn}, description= ${description}, days=${days}, color=${color}, 
     start=${startTime}, ends=${endTime}, recurring=${isRecurring}, date = ${date}, staff = ${staffId}
     WHERE id= ${id}
    `;
  } catch (error) {
    if (error) {
      console.log(error);
      return { success: false, message: "Opss server error" };
    }
  }
  revalidatePath("/dashboard/scheduling");
  return { success: true, message: "Form submitted successfully!" };
}

export async function deleteSchedule(id: string) {
  try {
    await sql`DELETE FROM scheduling WHERE id = ${id}`;
    await sql`DELETE FROM logs WHERE show = ${id}`;
  } catch (error) {
    if (error) {
      return { success: false };
    }
  }
  revalidatePath("/dashboard/scheduling");
}

export async function createLog(formData: FormData) {
  const show = formData.get("show") as string;
  const segments = formData.get("segments") as string;
  const guests = formData.get("guests") as string;
  const adverts = formData.get("adverts") as string;
  const staff = formData.get("staff") as string;
  const status = formData.get("status")
    ? (formData.get("status") as string)
    : "pending";

  const created = new Date();

  // Saving to a database

  try {
    await sql`
      INSERT INTO logs (staff, show, segments, guests, adverts, status, created)
      VALUES (${staff}, ${show},  ${segments}, ${guests}, ${adverts}, ${status}, ${created} )
    `;
  } catch (error: any) {
    if (error) {
      console.log(error?.detail);
    }
  }
  revalidatePath("/dashboard/logs");
}

export async function updateLog(formData: FormData) {
  const logId = formData.get("logId") as string;
  const segments = formData.get("segments") as string;
  const guests = formData.get("guests") as string;
  const adverts = formData.get("adverts") as string;
  const status = formData.get("status")
    ? (formData.get("status") as string)
    : "pending";

  // Saving to a database

  try {
    await sql`
       UPDATE logs SET segments=${segments}, guests=${guests}, adverts = ${adverts}, status=${status} WHERE id=${logId}
    `;
  } catch (error: any) {
    if (error) {
    }
    throw error;
  }
  revalidatePath("/dashboard/logs");
}

export async function deleteLog(id: string) {
  try {
    await sql`DELETE FROM logs WHERE id = ${id}`;
  } catch (error) {
    if (error) {
      return { success: false };
    }
  }
  revalidatePath("/dashboard/scheduling");
}
