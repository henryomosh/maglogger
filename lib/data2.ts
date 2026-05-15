"use server";

import { readSql } from "@/lib/db"; //USERS

//USERS

export async function fetchDashboardCount(userId: any, isAdmin: boolean) {
  const today = new Date();
  const todayNum = today.getDay();

  try {
    const activeUsers = await readSql`SELECT COUNT(*)
                          from users
                          WHERE status = 'active'`;

    const schedule1 = await readSql`SELECT scheduling.title,
                                               scheduling.start,
                                               scheduling.ends,
                                               scheduling.days,
                                               users.name
                                        FROM scheduling
                                                 JOIN users ON scheduling.staff = users.id`;

    const pendingLogs = !isAdmin
      ? await readSql`SELECT COUNT(*)
                            FROM logs
                            WHERE status = 'pending'
                              AND staff = ${userId}`
      : await readSql`SELECT COUNT(*)
                            FROM logs
                            WHERE status = 'pending'`;

    const attendance = await readSql<any>`SELECT clocked_out
                               FROM attendance
                               WHERE staff = ${userId}
                                 AND created >= DATE_TRUNC('day', NOW())
                                 AND created < DATE_TRUNC('day', NOW()) + INTERVAL '1 day'
                               ORDER BY created DESC
                               LIMIT 1`;

    const schedule2 = schedule1.map((item: any) => ({
      ...item,
      days: JSON.parse(item.days),
    }));

    const todaySchedule = schedule2.filter(
      (item: any) => item.days[todayNum].value === true,
    );

    const hourNow = Number(new Date().getHours());

    const liveShow = todaySchedule.filter((item: any) => {
      const startHour = Number(item?.start?.split(":")[0]);
      const endHour = Number(item.ends?.split(":")[0]);

      return endHour >= hourNow && startHour <= hourNow;
    });

    const upComingShows1 = todaySchedule
      .filter((item: any) => {
        const startHour = Number(item.start?.split(":")[0]);
        return startHour > hourNow;
      })
      ?.sort((a: any, b: any) => a.start?.localeCompare(b.start))
      ?.slice(0, 4);

    const upComingShows = upComingShows1.map((item: any) => ({
      ...item,
      duration: Number(item.start?.split(":")[0]) - hourNow,
    }));

    return {
      activeUsers,
      todaySchedule,
      liveShow,
      upComingShows,
      pendingLogs,
      attendance,
    };
  } catch (error) {
    console.log("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  }
}

export async function fetchShowAds(showId: string) {
  try {
    const advert = await readSql`
            SELECT id,
                   title,
                   shows
            FROM adverts
            WHERE status = 'active'
            ORDER BY title
        `;

    const newAd = advert.map((item: any) => ({
      ...item,
      shows: JSON.parse(item.shows),
    }));

    return newAd.filter((item: any) => item.shows?.includes(showId));
  } catch (error) {
    console.log(error);
  }
}

export async function fetchAdsByIds(ids: any) {
  const idList = ids.map((item: any) => item.id);
  try {
    const advert = await readSql`
            SELECT id,
                   title,
                   shows
            FROM adverts
            WHERE status = 'active'
            AND id = ANY(${idList})
            ORDER BY title
        `;

    const newAd = advert.map((item: any) => ({
      ...item,
      shows: JSON.parse(item.shows),
    }));

    return newAd;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchLogsModalAds(ids: any) {
  const idList = ids.map((item: any) => item.id);

  try {
    const advert = await readSql`
            SELECT 
                   title
            FROM adverts
            WHERE status = 'active'
            AND id = ANY(${idList})
            ORDER BY created DESC 
        `;

    return advert;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchLogsFormShow(staffId: any) {
  try {
    const data = await readSql<[]>`
      SELECT
        scheduling.id,
        scheduling.title
      FROM scheduling
      JOIN users ON scheduling.staff = users.id
      WHERE staff = ${staffId}
      ORDER BY scheduling.title`;

    return data;
  } catch (error) {
    console.log(error);
  }
}
