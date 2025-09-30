import { ShowScheduling } from "@/components/dashboard-components/scheduling";
import { fetchSchedule } from "@/lib/data";

export default async function Schedulling() {
  const { schedule, scheduleLogs, todaySchedule } = await fetchSchedule();

  return (
    <>
      <ShowScheduling
        data={schedule}
        scheduleLogs={scheduleLogs}
        todaySchedule={todaySchedule}
      />
    </>
  );
}
