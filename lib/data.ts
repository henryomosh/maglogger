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

    return schedule;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  }
}

export async function fetchUserSchedule(id: string) {
  try {
    const data = await sql<[]>`
      SELECT 
      scheduling.id,
      scheduling.title,
      scheduling.start,
      scheduling.ends
      FROM scheduling
      WHERE scheduling.staff = ${id}
      ORDER BY scheduling.created DESC`;
    return data;
  } catch (error) {
    console.log("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  }
}

export async function fetchLogs() {
  try {
    const data = await sql`
      SELECT 
      logs.id,
      logs.show,
      logs.start_time,
      logs.end_time,
      logs.description,
      logs.guest_name,
      logs.topic,
      logs.phone,
      logs.created,
      scheduling.title,
      users.name
      FROM logs
      JOIN scheduling ON logs.show = scheduling.id
      JOIN users ON scheduling.staff = users.id 

      `;

    const logs = data.map((item) => ({
      ...item,
      start_time: JSON.parse(item?.start_time),
      end_time: JSON.parse(item?.end_time),
      description: JSON.parse(item?.description),
      guest_name: JSON.parse(item?.guest_name),
      topic: JSON.parse(item?.topic),
      phone: JSON.parse(item?.phone),
    }));
    console.log(logs);
    return logs;
  } catch (error) {
    console.log("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  }
}
