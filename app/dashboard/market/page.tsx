import Market from "@/components/dashboard-components/market";
import { fetchAdverts, fetchSchedule } from "@/lib/data";

export default async function Page() {
  const adverts = await fetchAdverts();
  const { schedule } = await fetchSchedule();
  return (
    <>
      <Market adverts={adverts} schedule={schedule} />
    </>
  );
}
