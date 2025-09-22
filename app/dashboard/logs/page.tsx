import { ShowLogs } from "@/components/dashboard-components/show-logs";
import { fetchSchedule, fetchLogs } from "@/lib/data";

export default async function Logs() {
  const schedule = await fetchSchedule();
  const { logsData } = await fetchLogs();

  return (
    <>
      <ShowLogs schedule={schedule} showLogs={logsData} />
    </>
  );
}
