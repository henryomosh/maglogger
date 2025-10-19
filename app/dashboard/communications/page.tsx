import Communications from "@/components/dashboard-components/communications";
import { fetchCommunication } from "@/lib/data";

export default async function Page() {
  const messages = await fetchCommunication();
  return (
    <>
      <Communications messages={messages} />
    </>
  );
}
