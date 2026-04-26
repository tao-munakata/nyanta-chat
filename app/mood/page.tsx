import FreeChatPage from "@/components/FreeChatPage";
import { SERVICES } from "@/lib/services";

export default function MoodPage() {
  return <FreeChatPage service={SERVICES.mood} />;
}
