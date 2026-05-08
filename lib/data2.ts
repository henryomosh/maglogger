"use server";

import { readSql } from "@/lib/db";
import { User } from "@/lib/definations";


//USERS


export async function fetchDashboardCount(userId: any) {
    const today = new Date();
    const todayNum = today.getDay();

    try {

        const currentUser = await readSql`SELECT users.role FROM users WHERE id = ${userId}`;
        const isAdmin = currentUser[0].role === 'admin';

        const activeUsers = await readSql`SELECT COUNT(*) from users WHERE status ='active'`;

        const schedule1 = await readSql`SELECT  
            scheduling.title, scheduling.start, scheduling.ends,scheduling.days, users.name  
            FROM scheduling
            JOIN users ON scheduling.staff = users.id`;

        const pendingLogs = !isAdmin ?
            await readSql`SELECT COUNT(*) FROM logs WHERE status = 'pending' AND staff = ${userId}`:
            await readSql`SELECT COUNT(*) FROM logs WHERE status = 'pending'`;

        const attendance =
            await readSql<any>`SELECT clocked_out FROM attendance WHERE staff=${userId} AND created >= DATE_TRUNC('day', NOW())
            AND created < DATE_TRUNC('day', NOW()) + INTERVAL '1 day' ORDER BY created DESC LIMIT 1`;

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
        })


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

        return { activeUsers, todaySchedule, liveShow, upComingShows, pendingLogs, currentUser, attendance };
    } catch (error) {
        console.log("Database Error:", error);
        throw new Error("Failed to fetch the latest invoices.");
    }
}
