import { DashboardHome } from "@/components/dashboard-components/dashboard-home";
import { useAuth } from "@/components/auth-provider";
import {
  fetchStaff,
  fetchSchedule,
  fetchUserSchedule,
  fetchLogs,
} from "@/lib/data";

export default async function Dashboard() {
  const { staffData, activeUsers } = await fetchStaff();
  const { todaySchedule, liveShow, upCommingShows } = await fetchSchedule();
  const { logsData, approvedLogs, pendingLogs, declinedLogs } =
    await fetchLogs();

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
      />
    </>
  );
}
