"use server";
import sql from "@/lib/db";
import { User } from "@/lib/definations";

export async function fetchStaff() {
  try {
    const data = await sql<User[]>`
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
