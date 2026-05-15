import { cookies } from "next/headers";
import { fetchAttendanceById, fetchFilteredAttendance } from "@/lib/data";
import Attendance from "@/components/dashboard-components/attendance";

export const dynamic = "force-dynamic";

export default async function AttendancePage(props: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  const cookieStore = (await cookies()).get("session")?.value as string;
  const userCookieData = JSON.parse(cookieStore);
  const isAdmin = userCookieData.role === "admin";

  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";

  const attendance = await fetchAttendanceById(userCookieData.id);
  let filteredAttendance = [];
  if (isAdmin) {
    filteredAttendance = await fetchFilteredAttendance(query);
  }

  return (
    <>
      <Attendance
        attendance={attendance}
        filteredAttendance={filteredAttendance}
      />
    </>
  );
}
