"use server";
import sql from "@/lib/db";
import { User } from "@/lib/definations";

export async function fetchStaff() {
  try {
    const data = await sql`
      SELECT 
        users.id,
        users.role,
        users.name,
        users.email,
        users.phone,
        users.specialities,
        users.status,
        users.bio

      FROM users `;
    const staff = data.map((member) => ({
      ...member,
      specialities: member?.specialities ? member.specialities.split(",") : [],
    }));

    return staff;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  }
}

export async function fetchUser(email: string) {
  try {
    const data = await sql<User[]>`
      SELECT 
        users.id,
        users.role,
        users.name,
        users.email,
        users.phone,
        users.status,
        users.password,
        users.bio

      FROM users
      WHERE users.email = ${email} `;

    return data[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  }
}

export async function fetchSchedule() {
  try {
    const data = await sql`
      SELECT 
      scheduling.id,
      scheduling.title,
      scheduling.category,
      scheduling.description,
      scheduling.day,
      scheduling.color,
      scheduling.start,
      scheduling.ends,
      scheduling.recurring,
      scheduling.date,
      scheduling.status,
      scheduling.created, 
      users.name
      FROM scheduling
      JOIN users ON scheduling.staff = users.id 
      ORDER BY scheduling.created DESC`;
    const schedule = data.map((item) => ({
      ...item,
      date: item?.date ? item.date : "",
    }));
    console.log(schedule);
    return schedule;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  }
}
