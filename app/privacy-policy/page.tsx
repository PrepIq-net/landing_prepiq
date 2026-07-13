import LegalPage, { legalPageMetadata } from "@/components/legal/LegalPage";

export const generateMetadata = () => legalPageMetadata("privacy-policy");

export default function Page() {
  return <LegalPage slug="privacy-policy" />;
}
