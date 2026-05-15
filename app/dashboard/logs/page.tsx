import { ShowLogs } from "@/components/dashboard-components/show-logs";
import {
  fetchFilteredLogs,
  fetchFilteredLogsById,
  fetchLogPages,
  fetchLogsScheduleFilter,
  fetchtotalCurentUserPages,
  fetchTotalCurrentUserLogs,
  fetchTotalLogs,
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
  const cookieStore = (await cookies()).get("session")?.value as string;
  const userCookieData = JSON.parse(cookieStore);
  const isAdmin = userCookieData.role === "admin";

  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalItemPage = Number(searchParams?.total || 5);

  let totalPages = 0;
  let totalCurentUserPages = 0;

  if (isAdmin) {
    totalPages = await fetchLogPages(totalItemPage);
  } else {
    totalCurentUserPages = await fetchtotalCurentUserPages(
      totalItemPage,
      userCookieData.id,
    );
  }

  let filteredLogs: any[];

  if (isAdmin) {
    const allLogs = await fetchFilteredLogs(query, currentPage, totalItemPage);
    filteredLogs = allLogs!;
  } else {
    const curentUserLogs = await fetchFilteredLogsById(
      query,
      currentPage,
      totalItemPage,
      userCookieData.id,
    );
    filteredLogs = curentUserLogs!;
  }

  const schedule = isAdmin ? await fetchLogsScheduleFilter() : [];
  let totalLogs = {};
  let totalCurentUserLogs = {};

  totalLogs = isAdmin && (await fetchTotalLogs());
  totalCurentUserLogs =
    !isAdmin && (await fetchTotalCurrentUserLogs(userCookieData.id));

  return (
    <>
      <ShowLogs
        schedule={schedule}
        showLogs={filteredLogs}
        totalPages={totalPages}
        totalLogs={totalLogs}
        totalCurentUserLogs={totalCurentUserLogs}
        totalCurentUserPages={totalCurentUserPages}
      />
    </>
  );
}
