import { DashboardHome } from "@/components/dashboard-components/dashboard-home";
import { useAuth } from "@/components/auth-provider";

import {
  fetchStaff,
  fetchSchedule,
  fetchUserSchedule,
  fetchLogs,
  fetchAdvertStats,
  fetchPendingRequest,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const { staffData, activeUsers } = await fetchStaff();
  const { todaySchedule, liveShow, upCommingShows } = await fetchSchedule();
  const { logsData, approvedLogs, pendingLogs, declinedLogs } =
    await fetchLogs();
  const pendingRequests = await fetchPendingRequest();
  const advertsCount = await fetchAdvertStats();

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
      />
    </>
  );
}
