import { StaffManagement } from "@/components/dashboard-components/staff-management";
import { fetchStaff } from "@/lib/data";

export default async function Staff() {
  const { staffData } = await fetchStaff();

  return (
    <>
      <StaffManagement data={staffData} />
    </>
  );
}
