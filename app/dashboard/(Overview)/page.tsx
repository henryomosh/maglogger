import { DashboardHome } from "@/components/dashboard-components/dashboard-home";
import { cookies } from "next/headers";
import {
  fetchAdvertStats,
  fetchAttendanceById,
  fetchPendingRequest,
  fetchPendingUserRequest,
} from "@/lib/data";
import { fetchDashboardCount } from "@/lib/data2";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const cookieStore = (await cookies()).get("session")?.value as string;

  const {
    activeUsers,
    todaySchedule,
    liveShow,
    upComingShows,
    pendingLogs,
    currentUser,
  } = await fetchDashboardCount(cookieStore);

  const isAdmin = currentUser[0].role === "admin";

  let pendingRequests: any[] = [];
  let advertsCount: any[] = [];
  let pendingUserRequest: any[] = [];

  if (isAdmin) {
    pendingRequests = await fetchPendingRequest();
    advertsCount = await fetchAdvertStats();
  }

  if (!isAdmin) {
    pendingUserRequest = await fetchPendingUserRequest(cookieStore);
  }

  const attendance = await fetchAttendanceById(cookieStore);
  return (
    <>
      <DashboardHome
        attendance={attendance}
        activeUsers={activeUsers}
        scheduleData={todaySchedule}
        liveShow={liveShow}
        pendingLogs={pendingLogs}
        upCommingShows={upComingShows}
        pendingRequests={pendingRequests}
        advertsCount={advertsCount}
        pendingUserRequest={pendingUserRequest}
      />
    </>
  );
}
