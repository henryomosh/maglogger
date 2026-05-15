import { ShowScheduling } from "@/components/dashboard-components/scheduling";
import { fetchSchedule } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Schedulling() {
  const { schedule, todaySchedule } = await fetchSchedule();

  return (
    <>
      <ShowScheduling data={schedule} todaySchedule={todaySchedule} />
    </>
  );
}
