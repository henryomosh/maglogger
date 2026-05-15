import {Requests} from "@/components/dashboard-components/request";
import {cookies} from "next/headers";
import {
  fetchFilteredRequests,
  fetchFilteredRequestsById,
  fetchRequestfDashboard,
  fetchRequetsPages,
  fetchtotalCurentUserRequestsPages,
  fetchTotalCurrentUserRequests,
  fetchTotalRequests,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Page(props: {
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
    totalPages = await fetchRequetsPages(totalItemPage);
  } else {
    totalCurentUserPages = await fetchtotalCurentUserRequestsPages(
      totalItemPage,
      userCookieData.id,
    );
  }

  let filteredRequests: any[];

  if (isAdmin) {
    const allLogs = await fetchFilteredRequests(
      query,
      currentPage,
      totalItemPage,
    );
    filteredRequests = allLogs!;
  } else {
    const curentUserRequests = await fetchFilteredRequestsById(
      query,
      currentPage,
      totalItemPage,
      userCookieData.id,
    );
    filteredRequests = curentUserRequests!;
  }

  let totalRequests = { count: 0 };
  let totalCurentUserRequests = { count: 0 };

  if (isAdmin) {
    totalRequests = await fetchTotalRequests();
  } else {
    totalCurentUserRequests = await fetchTotalCurrentUserRequests(
      userCookieData.id,
    );
  }

  const dashboardData = await fetchRequestfDashboard();

  return (
    <>
      <Requests
        requests={filteredRequests}
        totalPages={totalPages}
        totalRequests={totalRequests}
        totalCurentUserRequests={totalCurentUserRequests}
        totalCurentUserPages={totalCurentUserPages}
        dashboard={dashboardData}
      />
    </>
  );
}
