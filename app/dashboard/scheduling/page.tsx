import { ShowScheduling } from "@/components/dashboard-components/scheduling";
import { fetchSchedule } from "@/lib/data";

export default async function Schedulling() {
  const data = await fetchSchedule();

  return (
    <>
      <ShowScheduling data={data} />
    </>
  );
}
