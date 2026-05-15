import Market from "@/components/dashboard-components/market";
import { fetchAdverts, fetchAdvertsSchedule } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Page() {
  const adverts = await fetchAdverts();
  const schedule = await fetchAdvertsSchedule();
  return (
    <>
      <Market adverts={adverts} schedule={schedule} />
    </>
  );
}
