import LegalPage, { legalPageMetadata } from "@/components/legal/LegalPage";

export const generateMetadata = () => legalPageMetadata("security");

export default function Page() {
  return <LegalPage slug="security" />;
}
