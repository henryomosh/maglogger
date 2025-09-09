"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sql from "@/lib/db";
import bcrypt from "bcryptjs";

function getItemsByPrefix(obj: any, prefix: string) {
  const result: any = {};
  for (const [key, value] of obj.entries()) {
    if (key.startsWith(prefix)) {
      result[key] = value;
    }
  }
  return result;
}

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
  revalidatePath("/dashboard/staff");
  redirect("/dashboard/staff");
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
      UPDATE users 
      SET role = ${role}, name = ${name} , email = ${email} , phone = ${phone},
      specialities = ${specialities}, status = ${status}, bio = ${bio}
      WHERE id = ${id}
    `;
  } catch (error: any) {
    if (error) {
      console.log(error?.detail);
    }
  }
  revalidatePath("/dashboard/staff");
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
  const recurring = formData.get("isRecurring");
  const status = formData.get("status") as string;
  const staffId = formData.get("userId") as string;

  // Saving to a database

  const created = new Date();
  const isRecurring = recurring ? true : false;

  try {
    await sql` INSERT INTO scheduling (title, category, description, day, host, color, start, ends, recurring, created, date, status, staff)
    VALUES (${title}, ${category}, ${description}, ${day}, ${host}, ${color}, ${startTime}, ${endTime}, ${isRecurring}, ${created}, ${date},${status}, ${staffId} )
    `;
    revalidatePath("/dashboard/schedulindg");
  } catch (error: any) {
    if (error) {
      return { success: false, message: "dsasa" };
    }
  }
}

export async function updateScheduling(formData: FormData) {
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const day = formData.get("day") as string;
  const color = formData.get("color") as string;
  const startTime = formData.get("startTime") as string;
  const endTime = formData.get("endTime") as string;
  const date = formData.get("date") as string;
  const recurring = formData.get("isRecurring");
  const status = formData.get("status") as string;
  const id = formData.get("id") as string;

  // Saving to a database

  const isRecurring = recurring ? true : false;

  try {
    await sql` UPDATE 
     scheduling SET title=${title},category = ${category},description= ${description}, day=${day}, color=${color}, 
     start=${startTime}, ends=${endTime}, recurring=${isRecurring}, date = ${date},status=${status}
     WHERE id= ${id}
    `;
  } catch (error) {
    if (error) {
      return { success: false, message: "dsasa" };
    }
  }
  revalidatePath("/dashboard/scheduling");
  return { success: true, message: "Form submitted successfully!" };
}

export async function deleteSchedule(id: string) {
  try {
    await sql`DELETE FROM scheduling WHERE id = ${id}`;
  } catch (error) {
    if (error) {
      return { success: false };
    }
  }
  revalidatePath("/dashboard/scheduling");
}

export async function createLog(formData: FormData) {
  const show = formData.get("show") as string;
  const startTimeItems = getItemsByPrefix(formData, "startTime_");
  const endTimeItems = getItemsByPrefix(formData, "endTime_");
  const descriptionItems = getItemsByPrefix(formData, "description_");

  const guestName = formData.get("guestName")
    ? getItemsByPrefix(formData, "guestName_")
    : null;
  const topic = formData.get("topic")
    ? getItemsByPrefix(formData, "topic_")
    : null;
  const phone = formData.get("phone")
    ? getItemsByPrefix(formData, "phone_")
    : null;

  const startTimeJson = JSON.stringify(startTimeItems);
  const endTimeJson = JSON.stringify(endTimeItems);
  const descriptionJson = JSON.stringify(descriptionItems);

  const guestNameJson = JSON.stringify(guestName);
  const topicJson = JSON.stringify(topic);
  const phoneJson = JSON.stringify(phone);

  const created = new Date();

  // Saving to a database

  try {
    await sql`
      INSERT INTO logs (show, start_time, end_time, description, guest_name, topic, phone, created)
      VALUES (${show}, ${startTimeJson}, ${endTimeJson}, ${descriptionJson}, ${guestNameJson}, ${topicJson}, ${phoneJson}, ${created})
    `;
  } catch (error: any) {
    if (error) {
      console.log(error?.detail);
    }
  }
  revalidatePath("/dashboard/logs");
}
