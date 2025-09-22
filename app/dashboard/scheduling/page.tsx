import { ShowScheduling } from "@/components/dashboard-components/scheduling";
import { fetchSchedule } from "@/lib/data";

export default async function Schedulling() {
  const { schedule, scheduleLogs } = await fetchSchedule();

  return (
    <>
      <ShowScheduling data={schedule} scheduleLogs={scheduleLogs} />
    </>
  );
}
