import { SettingsForm } from "@/components/admin/SettingsForm";
import { getSettings } from "@/lib/db/menu";

export default async function SettingsPage() {
  const settings = await getSettings();
  return (
    <>
      <header className="admin-page-head">
        <div>
          <p className="admin-kicker">Yapılandırma</p>
          <h1 className="admin-title">Genel Ayarlar</h1>
          <p className="admin-subtitle">Public menüde kullanılan temel metinleri yönetin. Marka renkleri ve referans logo sabit tutulur.</p>
        </div>
      </header>
      <SettingsForm settings={settings} />
    </>
  );
}
