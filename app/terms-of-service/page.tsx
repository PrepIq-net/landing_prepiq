import LegalPage, { legalPageMetadata } from "@/components/legal/LegalPage";

export const generateMetadata = () => legalPageMetadata("terms-of-service");

export default function Page() {
  return <LegalPage slug="terms-of-service" />;
}
