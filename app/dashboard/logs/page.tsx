import { ShowLogs } from "@/components/dashboard-components/show-logs";
import {
  fetchSchedule,
  fetchLogs,
  fetchFilteredLogs,
  fetchLogPages,
  fetchTotalLogs,
} from "@/lib/data";

export default async function Logs(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    total: string;
    success?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalItemPage = Number(searchParams?.total || 5);
  const totalPages = await fetchLogPages(totalItemPage);

  const filteredLogs = await fetchFilteredLogs(
    query,
    currentPage,
    totalItemPage
  );

  const schedule = await fetchSchedule();
  const totalLogs = await fetchTotalLogs();
  const { logsData } = await fetchLogs();

  return (
    <>
      <ShowLogs
        schedule={schedule.schedule}
        showLogs={filteredLogs}
        totalPages={totalPages}
        totalLogs={totalLogs}
      />
    </>
  );
}
