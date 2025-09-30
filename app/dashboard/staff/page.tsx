import { StaffManagement } from "@/components/dashboard-components/staff-management";
import {
  fetchStaff,
  fetchSchedule,
  fetchFilteredStaff,
  fetchStaffDashboard,
} from "@/lib/data";

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
