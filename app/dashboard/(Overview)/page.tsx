import { DashboardHome } from "@/components/dashboard-components/dashboard-home";
import { useAuth } from "@/components/auth-provider";
import { cookies } from "next/headers";
import {
  fetchStaff,
  fetchSchedule,
  fetchUserSchedule,
  fetchLogs,
  fetchAdvertStats,
  fetchPendingRequest,
  fetchPendingUserRequest,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const { staffData, activeUsers } = await fetchStaff();
  const { todaySchedule, liveShow, upCommingShows } = await fetchSchedule();
  const { logsData, approvedLogs, pendingLogs, declinedLogs } =
    await fetchLogs();
  const pendingRequests = await fetchPendingRequest();
  const advertsCount = await fetchAdvertStats();

  const cookieStore = (await cookies()).get("session")?.value as string;
  const pendingUserRequest = await fetchPendingUserRequest(cookieStore);

  return (
    <>
      <DashboardHome
        staffData={staffData}
        activeUsers={activeUsers}
        scheduleData={todaySchedule}
        logsData={logsData}
        liveShow={liveShow}
        approvedLogs={approvedLogs}
        pendingLogs={pendingLogs}
        declinedLogs={declinedLogs}
        upCommingShows={upCommingShows}
        pendingRequests={pendingRequests}
        advertsCount={advertsCount}
        pendingUserRequest={pendingUserRequest}
      />
    </>
  );
}
