import { StaffManagement } from "@/components/dashboard-components/staff-management";
import {
  fetchStaff,
  fetchSchedule,
  fetchFilteredStaff,
  fetchStaffDashboard,
  fetchUserById,
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
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  const staff = await fetchFilteredStaff(query, currentPage);
  const { staffData } = await fetchStaff();
  const { schedule } = await fetchSchedule();
  const staffDashboardData = await fetchStaffDashboard();
  const cookieStore = (await cookies()).get("session")?.value as string;
  const currentUser = await fetchUserById(cookieStore);

  return (
    <>
      <StaffManagement
        data={staff}
        schedule={schedule}
        staffDashboardData={staffDashboardData}
        currentUser={currentUser}
      />
    </>
  );
}
