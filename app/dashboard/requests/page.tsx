import { Requests } from "@/components/dashboard-components/request";
import { cookies } from "next/headers";
import {
  fetchRequetsPages,
  fetchtotalCurentUserRequestsPages,
  fetchUserById,
  fetchFilteredRequests,
  fetchFilteredRequestsById,
  fetchTotalRequests,
  fetchTotalCurrentUserRequests,
  fetchRequestfDashboard,
} from "@/lib/data";

export default async function Page(props: {
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
  const totalPages = await fetchRequetsPages(totalItemPage);

  let filteredRequests: any[];

  const cookieStore = (await cookies()).get("session")?.value as string;
  const totalCurentUserPages = await fetchtotalCurentUserRequestsPages(
    totalItemPage,
    cookieStore
  );

  const currentUser = await fetchUserById(cookieStore);
  if (currentUser?.role === "admin") {
    const allLogs = await fetchFilteredRequests(
      query,
      currentPage,
      totalItemPage
    );
    filteredRequests = allLogs!;
  } else {
    const curentUserRequests = await fetchFilteredRequestsById(
      query,
      currentPage,
      totalItemPage,
      cookieStore
    );
    filteredRequests = curentUserRequests!;
  }

  const totalRequests = await fetchTotalRequests();
  const totalCurentUserRequests = await fetchTotalCurrentUserRequests(
    cookieStore
  );

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
