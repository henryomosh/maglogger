import { StaffManagement } from "@/components/dashboard-components/staff-management";
import { fetchStaff, fetchSchedule } from "@/lib/data";

export default async function Staff() {
  const { staffData } = await fetchStaff();
  const { schedule } = await fetchSchedule();

  return (
    <>
      <StaffManagement data={staffData} schedule={schedule} />
    </>
  );
}
