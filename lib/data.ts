"use server";

import { readSql } from "@/lib/db";
import { User } from "@/lib/definations";
import { DateTime } from "luxon";

// Users
export async function fetchStaff() {
  try {
    const data = await readSql`
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
      FROM users 
      ORDER BY users.name`;
    const activeUsers = await readSql<
      []
    >`SELECT * from users WHERE status ='active'`;
    const staffData = data.map((member: any) => ({
      ...member,
      specialities: member?.specialities ? member.specialities.split(",") : [],
    }));
    const formStaff = await readSql<[]>`SELECT
      users.id,
      users.name
      FROM users
      ORDER BY users.name`;

    return { formStaff, staffData, activeUsers };
  } catch (error) {
    console.log("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  }
}

export async function fetchUser(email: string) {
  try {
    const data = await readSql<User[]>`
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

export async function fetchUserById(id: string) {
  try {
    const data = await readSql<User[]>`
      SELECT 
        users.id,
        users.role,
        users.name,
        users.email,
        users.phone,
        users.status,
        users.specialities,
        users.login,
        users.logout,
        users.bio,
        users.password
      FROM users
      WHERE users.id = ${id} `;
    const userData = data.map((user: any) => ({
      ...user,
      specialities: user.specialities.split(","),
    }));
    return userData[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  }
}

const ITEMS_PER_PAGE = 5;
export async function fetchFilteredStaff(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const staff = await readSql`
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
      FROM users
      WHERE
        users.role ILIKE ${`%${query}%`} OR
        users.name ILIKE ${`%${query}%`} OR
        users.email ILIKE ${`%${query}%`} OR
        users.phone ILIKE ${`%${query}%`} OR
        users.status ILIKE ${`%${query}%`} OR
        users.logout ILIKE ${`%${query}%`} OR
        users.bio ILIKE ${`%${query}%`}   
      ORDER BY users.name
    `;
    const newStaff = staff.map((item: any) => ({
      ...item,
      specialities: item?.specialities?.split(","),
      len: item?.specialities?.split(",").length,
    }));
    return newStaff;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchStaffDashboard() {
  try {
    const activeUsersPromise = await readSql`
      SELECT 
        users.id,
        users.role,
        users.status
      FROM users
      WHERE status = 'active'
    `;
    const onLeaveUsersPromise = await readSql`
      SELECT 
        users.id,
        users.role,
        users.status
      FROM users
      WHERE status = 'on-leave'
    `;
    const inactiveUsersPromise = await readSql`
      SELECT 
        users.id,
        users.role,
        users.status
      FROM users
      WHERE status = 'inactive'
    `;
    const activeUsers = activeUsersPromise?.length;
    const onLeaveUsers = onLeaveUsersPromise?.length;
    const inactiveUsers = inactiveUsersPromise?.length;

    return { activeUsers, onLeaveUsers, inactiveUsers };
  } catch (error) {
    console.log(error);
  }
}

//SCHEDULE
export async function fetchSchedule() {
  try {
    const data = await readSql<[]>`
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
      ORDER BY scheduling.title`;

    const schedule = data.map((item: any) => ({
      ...item,
      date: item?.date ? item.date : "",
      days: JSON.parse(item.days),
    }));
    const today = new Date();
    const todayNum = today.getDay();
    const schedule1 = await readSql`SELECT 
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

    const todaySchedule = schedule2.filter(
      (item: any) => item.days[todayNum].value === true,
    );
    const logsData = await readSql`SELECT * FROM  logs ORDER BY created DESC`;

    const scheduleLogs = logsData.map((log: any) => ({
      ...log,
      segments: JSON.parse(log.segments),
      guests: JSON.parse(log.guests),
      created: new Date(log.created).toUTCString(),
    }));

    const hourNow = Number(new Date().getHours());
    const liveShow = todaySchedule.filter((item: any) => {
      const startHour = Number(item?.start.split(":")[0]);
      const endHour = Number(item.ends.split(":")[0]);

      return endHour >= hourNow && startHour <= hourNow;
    });

    const upCommingShows1 = todaySchedule
      .filter((item: any) => {
        const startHour = Number(item.start.split(":")[0]);
        return startHour > hourNow;
      })
      .sort((a: any, b: any) => a.start.localeCompare(b.start))
      .slice(0, 4);

    const upCommingShows = upCommingShows1.map((item: any) => ({
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
    const data = await readSql<[]>`
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

export async function fetchAdSchedule() {
  try {
    const show =
      await readSql`SELECT id AS value, title AS label FROM scheduling ORDER BY title`;
    return show;
  } catch (error) {
    console.log(error);
  }
}
// LOGS
export async function fetchLogs() {
  try {
    const data = await readSql`
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
      await readSql`SELECT id FROM logs WHERE status = 'approved'`;

    const pendingLogs =
      await readSql`SELECT id FROM logs WHERE status = 'pending'`;
    const declinedLogs =
      await readSql`SELECT id FROM logs WHERE status = 'declined'`;

    const logsData = data.map((log: any) => ({
      ...log,
      segments: JSON.parse(log.segments),
      guests: JSON.parse(log.guests),
      adverts: JSON.parse(log.adverts),
      ads: log?.ads ? JSON.parse(log.ads) : [],
    }));

    return { logsData, pendingLogs, approvedLogs, declinedLogs };
  } catch (error) {
    console.log("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  }
}

export async function fetchScheduleLogs(id: string) {
  try {
    const scheduleLogs = await readSql`
      SELECT 
      logs.id,
      logs.show,
      logs.segments,
      logs.guests,
      logs.status,
      logs.adverts,
      logs.ads,
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

export async function fetchFilteredLogs(
  query: string,
  currentPage: number,
  totalItemPage: number,
) {
  const offset = (currentPage - 1) * totalItemPage;

  try {
    const logs = await readSql`
      SELECT 
      logs.id,
      logs.staff,
      logs.show,
      logs.segments,
      logs.guests,
      logs.adverts,
      logs.ads,
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
      WHERE
        users.name ILIKE ${`%${query}%`} OR
        scheduling.standin ILIKE ${`%${query}%`} OR
        scheduling.title ILIKE ${`%${query}%`} OR
        logs.status ILIKE ${`%${query}%`} OR
        logs.created::TEXT ILIKE ${`%${query}%`}
      ORDER BY logs.created DESC
       LIMIT ${totalItemPage} OFFSET ${offset}
    `;

    const parsedLogs = logs.map((item: any) => ({
      ...item,
      segments: JSON.parse(item.segments),
      guests: JSON.parse(item.guests),
      adverts: JSON.parse(item.adverts),
      ads: JSON.parse(item.ads) ?? [],
    }));

    return parsedLogs;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchFilteredLogsById(
  query: string,
  currentPage: number,
  totalItemPage: number,
  id: string,
) {
  const offset = (currentPage - 1) * totalItemPage;

  try {
    const logs = await readSql`
      SELECT 
      logs.id,
      logs.staff,
      logs.show,
      logs.segments,
      logs.guests,
      logs.adverts,
      logs.ads,
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
      WHERE
        logs.staff = ${id} AND (users.name ILIKE ${`%${query}%`} OR
        scheduling.standin ILIKE ${`%${query}%`} OR
        scheduling.title ILIKE ${`%${query}%`} OR
        logs.status ILIKE ${`%${query}%`} OR
        logs.created::TEXT ILIKE ${`%${query}%`})
        
      ORDER BY logs.created DESC
       LIMIT ${totalItemPage} OFFSET ${offset}
    `;

    const parsedLogs = logs.map((item: any) => ({
      ...item,
      segments: JSON.parse(item.segments),
      guests: JSON.parse(item.guests),
      adverts: JSON.parse(item.adverts),
      ads: JSON.parse(item.ads) ?? [],
    }));

    return parsedLogs;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchLogPages(totalItemPage: number) {
  try {
    const data = await readSql`SELECT COUNT(*)
    FROM logs
  `;
    const totalPages = Math.ceil(Number(data[0].count) / totalItemPage);

    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchtotalCurentUserPages(
  totalItemPage: number,
  id: string,
) {
  try {
    const data = await readSql`SELECT COUNT(*)
    FROM logs
    WHERE staff = ${id}
  `;
    const totalPages = Math.ceil(Number(data[0].count) / totalItemPage);

    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchTotalLogs() {
  try {
    const data = await readSql`SELECT COUNT(*)
    FROM logs
  `;

    return data[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchTotalCurrentUserLogs(id: string) {
  try {
    const data = await readSql`SELECT COUNT(*)
    FROM logs
    WHERE staff = ${id}
  `;

    return data[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchRequetsPages(totalItemPage: number) {
  try {
    const data = await readSql`SELECT COUNT(*)
    FROM requests
  `;
    const totalPages = Math.ceil(Number(data[0].count) / totalItemPage);

    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchtotalCurentUserRequestsPages(
  totalItemPage: number,
  id: string,
) {
  try {
    const data = await readSql`SELECT COUNT(*)
    FROM requests
    WHERE staff_id = ${id}
  `;
    const totalPages = Math.ceil(Number(data[0].count) / totalItemPage);

    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchFilteredRequests(
  query: string,
  currentPage: number,
  totalItemPage: number,
) {
  const offset = (currentPage - 1) * totalItemPage;

  try {
    const requests = await readSql`
      SELECT 
      requests.id,
      requests.staff_id,
      requests.type,
      requests.reason,
      requests.start_date,
      requests.end_date,
      requests.stand_in,
      requests.status,
      requests.notes,
      requests.created,
      users.name,
      (SELECT users.name FROM users WHERE users.id::TEXT= requests.stand_in) as standin
      FROM requests
      LEFT JOIN users ON users.id = requests.staff_id 
      WHERE
        requests.type ILIKE ${`%${query}%`} OR
        requests.reason ILIKE ${`%${query}%`} OR
        requests.start_date ILIKE ${`%${query}%`} OR
        requests.end_date ILIKE ${`%${query}%`} OR
        requests.status ILIKE ${`%${query}%`} OR
        users.name ILIKE ${`%${query}%`} OR
        requests.created::TEXT ILIKE ${`%${query}%`}
      ORDER BY requests.created DESC
      LIMIT ${totalItemPage} OFFSET ${offset}
    `;

    return requests;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchFilteredRequestsById(
  query: string,
  currentPage: number,
  totalItemPage: number,
  id: string,
) {
  const offset = (currentPage - 1) * totalItemPage;

  try {
    const requests = await readSql`
      SELECT 
      requests.id,
      requests.staff_id,
      requests.type,
      requests.reason,
      requests.start_date,
      requests.end_date,
      requests.stand_in,
      requests.status,
      requests.notes,
      requests.created,
      users.name,
      (SELECT users.name FROM users WHERE users.id::TEXT= requests.stand_in) as standin
      FROM requests
      JOIN users ON users.id = requests.staff_id 
      WHERE
        requests.staff_id = ${id} AND (        requests.type ILIKE ${`%${query}%`} OR
        requests.reason ILIKE ${`%${query}%`} OR
        requests.start_date ILIKE ${`%${query}%`} OR
        requests.end_date ILIKE ${`%${query}%`} OR
        requests.status ILIKE ${`%${query}%`} OR
        users.name ILIKE ${`%${query}%`} OR
        requests.created::TEXT ILIKE ${`%${query}%`})
        
      ORDER BY requests.created DESC
       LIMIT ${totalItemPage} OFFSET ${offset}
    `;
    return requests;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchTotalRequests() {
  try {
    const data = await readSql`SELECT COUNT(*)
    FROM requests
  `;

    return data[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchTotalCurrentUserRequests(id: string) {
  try {
    const data = await readSql`SELECT COUNT(*)
    FROM requests
    WHERE staff_id = ${id}
  `;

    return data[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchRequestfDashboard() {
  try {
    const emergency = await readSql`
      SELECT 
        COUNT(*)
      FROM requests
      WHERE type = 'emergency'
    `;
    const leave = await readSql`
      SELECT 
        COUNT(*)
      FROM requests
      WHERE type = 'leave'
    `;

    const offDuty = await readSql`
      SELECT 
        COUNT(*)
      FROM requests
      WHERE type = 'off-duty'
    `;
    const facilitation = await readSql`
      SELECT 
        COUNT(*)
      FROM requests
      WHERE type = 'facilitation'
    `;

    return { leave, emergency, offDuty, facilitation };
  } catch (error) {
    console.log(error);
  }
}

export async function fetchPendingRequest() {
  try {
    const pending = await readSql`
      SELECT 
        COUNT(*)
      FROM requests
      WHERE status = 'pending'
    `;

    return pending;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchPendingUserRequest(id: string) {
  try {
    const pending = await readSql`
      SELECT 
        COUNT(*)
      FROM requests
      WHERE status = 'pending' AND staff_id = ${id}
    `;

    return pending;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchAdverts() {
  try {
    const advert = await readSql`
      SELECT 
        *
      FROM adverts
      ORDER BY title
    `;

    const newad = advert.map((item: any) => ({
      ...item,
      shows: JSON.parse(item.shows),
    }));

    return newad;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchAdvertStats() {
  try {
    const advertCount = await readSql`
      SELECT 
        COUNT(*)
      FROM adverts
  
    `;

    return advertCount;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchCommunicationUsers() {
  try {
    const users = await readSql`SELECT * FROM users ORDER BY name`;

    const users_ = users.map((item: any) => ({
      id: item.id,
      name: item.name,
      read: false,
      deleted: false,
    }));
    return users_;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchCommunication() {
  try {
    const communications =
      await readSql`SELECT id, subject, sender_name, sender_id, content, user_status, created::TEXT FROM communications ORDER BY created`;
    const coms = communications
      .map((item: any) => ({
        ...item,
        user_status: JSON.parse(item.user_status),
      }))
      .sort((a: any, b: any) => b.created.localeCompare(a.created));

    return coms;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchCommunicationById(id: string) {
  try {
    const communications =
      await readSql<any>`SELECT id, subject, content, user_status, created FROM communications WHERE id=${id}`;

    const status = JSON.parse(communications[0].user_status);

    return status;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchNoifications() {
  try {
    // const logNotifications =
    //   await readSql<any>`SELECT * FROM notifications WHERE type='logs' ORDER BY time `;

    // const requestNotifications =
    //   await readSql<any>`SELECT * FROM notifications WHERE type='requests' ORDER BY time `;

    // const communicationsNotifications =
    //   await readSql<any>`SELECT * FROM notifications WHERE type='communication' ORDER BY time`;
    const notifications =
      await readSql<any>`SELECT * FROM notifications  ORDER BY time DESC LIMIT 4`;

    return notifications;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchNoificationById(id: string) {
  try {
    const notifications =
      await readSql<any>`SELECT * FROM notifications WHERE id=${id} `;

    return notifications;
  } catch (error) {
    console.log(error);
  }
}

// ATTENDANCE

export async function fetchAttendanceById(id: string) {
  try {
    const attendance =
      await readSql<any>`SELECT * FROM attendance WHERE staff=${id} AND created >= DATE_TRUNC('day', NOW())
  AND created < DATE_TRUNC('day', NOW()) + INTERVAL '1 day' ORDER BY created DESC LIMIT 1`;

    return attendance;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchFilteredAttendance(query: string) {
  try {
    const today = new Date();
    const formattedDate = today.toISOString().slice(0, 10);
    let date = formattedDate;
    if (query) {
      date = query;
    }

    const attendance = await readSql<any>`SELECT 
      users.id, users.name, users.status, login, logout, attendance.clock_in_time, 
      attendance.clock_out_time, COALESCE(attendance.created, ${date}) as date
      FROM users LEFT JOIN LATERAL (SELECT * FROM attendance WHERE users.id = attendance.staff AND
      attendance.created::DATE = ${date} ORDER BY 
      created DESC LIMIT 1) AS attendance ON TRUE ORDER BY users.name ASC
  `;
    console.log(attendance);
    return attendance;
  } catch (error) {
    console.log(error);
  }
}
