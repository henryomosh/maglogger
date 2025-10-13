import { ShowLogs } from "@/components/dashboard-components/show-logs";
import {
  fetchSchedule,
  fetchLogs,
  fetchFilteredLogs,
  fetchLogPages,
  fetchTotalLogs,
  fetchUserById,
  fetchFilteredLogsById,
  fetchTotalCurrentUserLogs,
  fetchtotalCurentUserPages,
  fetchAdverts,
} from "@/lib/data";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

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

  let filteredLogs: any[];

  const cookieStore = (await cookies()).get("session")?.value as string;
  const totalCurentUserPages = await fetchtotalCurentUserPages(
    totalItemPage,
    cookieStore
  );

  const currentUser = await fetchUserById(cookieStore);
  if (currentUser?.role === "admin") {
    const allLogs = await fetchFilteredLogs(query, currentPage, totalItemPage);
    filteredLogs = allLogs!;
  } else {
    const curentUserLogs = await fetchFilteredLogsById(
      query,
      currentPage,
      totalItemPage,
      cookieStore
    );
    filteredLogs = curentUserLogs!;
  }

  const schedule = await fetchSchedule();
  const totalLogs = await fetchTotalLogs();
  const totalCurentUserLogs = await fetchTotalCurrentUserLogs(cookieStore);
  const { logsData } = await fetchLogs();

  const adverts = await fetchAdverts();

  return (
    <>
      <ShowLogs
        schedule={schedule.schedule}
        showLogs={filteredLogs}
        totalPages={totalPages}
        totalLogs={totalLogs}
        totalCurentUserLogs={totalCurentUserLogs}
        totalCurentUserPages={totalCurentUserPages}
        adverts={adverts}
      />
    </>
  );
}
