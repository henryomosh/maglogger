"use server";
import Logs from "@/app/dashboard/logs/page";
import sql from "@/lib/db";
import { User } from "@/lib/definations";
import { DateTime } from "luxon";
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
        users.login,
        users.logout,
        users.bio
      FROM users `;
    const activeUsers = await sql<
      []
    >`SELECT * from users WHERE status ='active'`;
    const staffData = data.map((member) => ({
      ...member,
      specialities: member?.specialities ? member.specialities.split(",") : [],
    }));
    const formStaff = await sql<[]>`SELECT
      users.id,
      users.name
      FROM users`;

    return { formStaff, staffData, activeUsers };
  } catch (error) {
    console.log("Database Error:", error);
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
    const data = await sql<[]>`
      SELECT 
      scheduling.id,
      scheduling.staff,
      scheduling.standin,
      scheduling.title,
      scheduling.description,
      scheduling.days,
      scheduling.color,
      scheduling.start,
      scheduling.ends,
      scheduling.recurring,
      TO_CHAR(scheduling.date, 'YYYY-MM-DD') AS date,
      scheduling.created, 
      users.name
      FROM scheduling
      JOIN users ON scheduling.staff = users.id 
      ORDER BY scheduling.created DESC`;

    const schedule = data.map((item: any) => ({
      ...item,
      date: item?.date ? item.date : "",
      days: JSON.parse(item.days),
    }));
    const today = new Date();
    const todayNum = today.getDay();
    const schedule1 = await sql`SELECT 
      scheduling.id,
      scheduling.title,
      scheduling.standin,
      scheduling.description,
      scheduling.days,
      scheduling.color,
      scheduling.start,
      scheduling.ends,
      scheduling.recurring,
      TO_CHAR(scheduling.date, 'YYYY-MM-DD') AS date,
      scheduling.created, 
      users.name
      FROM scheduling
      JOIN users ON scheduling.staff = users.id
     `;

    const schedule2 = schedule1.map((item: any) => ({
      ...item,
      days: JSON.parse(item.days),
    }));

    const todaySchedule= schedule2.filter((item:any) => item.days[todayNum].value === true)
    const logsData = await sql`SELECT * FROM  logs ORDER BY created DESC`;

    const scheduleLogs = logsData.map((log) => ({
      ...log,
      segments: JSON.parse(log.segments),
      guests: JSON.parse(log.guests),
      created: new Date(log.created).toUTCString(),
    }));

    const hourNow = Number(new Date().getHours());
    const liveShow = todaySchedule.filter((item) => {
      const startHour = Number(item?.start.split(":")[0]);
      const endHour = Number(item.ends.split(":")[0]);

      return endHour >= hourNow && startHour <= hourNow;
    });

    const upCommingShows1 = todaySchedule
      .filter((item) => {
        const startHour = Number(item.start.split(":")[0]);
        return startHour > hourNow;
      })
      .sort((a: any, b: any) => a.start.localeCompare(b.start))
      .slice(0, 4);

    const upCommingShows = upCommingShows1.map((item) => ({
      ...item,
      duration: Number(item.start.split(":")[0]) - hourNow,
    }));

    return {
      schedule,
      todaySchedule,
      liveShow,
      upCommingShows,
      scheduleLogs,
    };
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
      scheduling.standin,
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
      logs.staff,
      logs.show,
      logs.segments,
      logs.guests,
      logs.adverts,
      logs.status,
      logs.created,
      scheduling.title,
          scheduling.standin,
      scheduling.start,
      scheduling.ends,
      users.name
      FROM logs
      JOIN scheduling ON logs.show = scheduling.id
      JOIN users ON scheduling.staff = users.id 
      `;
    const approvedLogs =
      await sql`SELECT * FROM logs WHERE status = 'approved'`;

    const pendingLogs = await sql`SELECT * FROM logs WHERE status = 'pending'`;
    const declinedLogs =
      await sql`SELECT * FROM logs WHERE status = 'declined'`;

    const logsData = data.map((log) => ({
      ...log,
      segments: JSON.parse(log.segments),
      guests: JSON.parse(log.guests),
      adverts: JSON.parse(log.adverts),
    }));

    return { logsData, pendingLogs, approvedLogs, declinedLogs };
  } catch (error) {
    console.log("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  }
}

export async function fetchScheduleLogs(id: string) {
  try {
    const scheduleLogs = await sql`
      SELECT 
      logs.id,
      logs.show,
      logs.segments,
      logs.guests,
      logs.status,
      logs.adverts,
      logs.created,
      scheduling.title,
      scheduling.standin,
      scheduling.start,
      scheduling.ends,
      users.name
      FROM logs
      JOIN scheduling ON logs.show = scheduling.id
      JOIN users ON scheduling.staff = users.id 
      WHERE logs.id = ${id}
      `;

    return scheduleLogs;
  } catch (error) {
    console.log("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  }
}
