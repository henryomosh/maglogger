import { StaffManagement } from "@/components/dashboard-components/staff-management";
import { fetchStaff } from "@/lib/data";

export default async function Staff() {
  const data = await fetchStaff();

  return (
    <>
      <StaffManagement data={data} />
    </>
  );
}
