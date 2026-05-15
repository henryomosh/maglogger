import { StaffManagement } from "@/components/dashboard-components/staff-management";
import {
  fetchCurrentStaff,
  fetchFilteredStaff,
  fetchStaffDashboard,
  fetchStaffSchedule,
  fetchUserSchedule,
} from "@/lib/data";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function Staff(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    success?: string;
  }>;
}) {
  const cookieStore = (await cookies()).get("session")?.value as string;
  const userCookieData = JSON.parse(cookieStore);

  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  const isAdmin = userCookieData.role === "admin";

  let staff = isAdmin
    ? await fetchFilteredStaff(query, currentPage)
    : await fetchCurrentStaff(userCookieData.id);

  const schedule = isAdmin
    ? await fetchStaffSchedule()
    : await fetchUserSchedule(userCookieData.id);
  const staffDashboardData = isAdmin ? await fetchStaffDashboard() : [];

  return (
    <>
      <StaffManagement
        data={staff}
        schedule={schedule}
        staffDashboardData={staffDashboardData}
      />
    </>
  );
}
