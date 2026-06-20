import { getSiteConfig } from "@/lib/site-config";
import SettingsPanel from "@/components/admin/SettingsPanel";

export default async function SettingsPage() {
  const config = await getSiteConfig();
  return <SettingsPanel initial={config} />;
}
