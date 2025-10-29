import { useAuth } from "@/components/auth-provider";
import { cookies } from "next/headers";
import { fetchAttendanceById, fetchFilteredAttendance } from "@/lib/data";
import Attendance from "@/components/dashboard-components/attendance";

export const dynamic = "force-dynamic";

export default async function AttendancePage(props: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const cookieStore = (await cookies()).get("session")?.value as string;
  const attendance = await fetchAttendanceById(cookieStore);
  const filteredAttendance = await fetchFilteredAttendance(query);

  return (
    <>
      <Attendance
        attendance={attendance}
        filteredAttendance={filteredAttendance}
      />
    </>
  );
}
