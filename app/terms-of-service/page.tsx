"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function TermsOfService() {
  const { t, i18n } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="section-container flex items-center justify-between py-5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="font-display text-sm font-bold text-primary-foreground">P</span>
            </div>
            <span className="font-display text-lg font-semibold text-foreground">PrepIQ</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("common.backToHome")}
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="section-container py-16 md:py-24 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-2">{t("terms.title")}</h1>
        <p className="text-sm text-muted-foreground mb-12">{t("common.lastUpdated", { date: i18n.resolvedLanguage === 'fr' ? '8 mars 2026' : 'March 8, 2026' })}</p>

        <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">
          {i18n.resolvedLanguage === 'fr' ? (
            <>
              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">1. Acceptation des Conditions</h2>
                <p>
                  En accédant ou en utilisant la plateforme PrepIQ ("le Service"), vous acceptez d'être lié par ces Conditions d'utilisation ("Conditions"). Si vous n'acceptez pas ces Conditions, vous ne pouvez pas accéder ou utiliser le Service.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">2. Description du Service</h2>
                <p>
                  PrepIQ fournit des outils de prévision de la demande et de planification de la mise en place alimentés par l'IA pour les cuisines professionnelles. Le Service comprend l'analyse de données, l'intelligence prédictive et les recommandations d'inventaire.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">3. Inscription au Compte</h2>
                <p>
                  Pour utiliser certaines fonctionnalités, vous devez créer un compte. Vous vous engagez à fournir des informations exactes et à les maintenir à jour. Vous êtes responsable de la sécurité de vos identifiants.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">4. Abonnement et Facturation</h2>
                <p>
                  Les fonctionnalités payantes sont facturées par abonnement mensuel ou annuel. Les frais sont non remboursables, sauf obligation légale. Nous nous réservons le droit de modifier les tarifs avec un préavis de 30 jours.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">5. Essai Gratuit</h2>
                <p>
                  PrepIQ peut proposer une période d'essai gratuite. À l'issue de celle-ci, l'abonnement devient payant sauf résiliation avant la fin de l'essai.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">6. Données et Confidentialité</h2>
                <p>
                  Votre utilisation est régie par notre Politique de confidentialité. Vous restez propriétaire de vos données. Vous nous accordez une licence limitée pour les traiter aux fins de fourniture du Service.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">7. Usage Acceptable</h2>
                <p>Vous acceptez de ne pas :</p>
                <ul className="list-disc pl-5 mt-2 space-y-1.5">
                  <li>Utiliser le Service à des fins illégales</li>
                  <li>Tenter d'accéder sans autorisation à une partie du Service</li>
                  <li>Pratiquer l'ingénierie inverse sur le Service</li>
                  <li>Perturber l'intégrité ou la performance du Service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">8. Propriété Intellectuelle</h2>
                <p>
                  Le Service et son contenu original sont la propriété exclusive de PrepIQ et sont protégés par les lois internationales sur la propriété intellectuelle.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">9. Limitation de Responsabilité</h2>
                <p>
                  Dans la mesure permise par la loi, PrepIQ ne sera pas responsable des dommages indirects ou pertes de profits. Notre responsabilité totale ne dépassera pas le montant payé au cours des 12 derniers mois.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">10. Clause de Non-garantie</h2>
                <p>
                  Le Service est fourni "en l'état". PrepIQ ne garantit pas une disponibilité ininterrompue ou sans erreur. Les prévisions sont des estimations et ne doivent pas être la seule base de décision.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">11. Résiliation</h2>
                <p>
                  Nous pouvons suspendre votre compte à tout moment. En cas de résiliation, votre droit d'accès cesse immédiatement. Vous disposez de 30 jours pour exporter vos données.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">12. Droit Applicable</h2>
                <p>
                  Ces Conditions sont régies par les lois de l'État de Californie, États-Unis. Tout litige sera porté devant les tribunaux de San Francisco.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">13. Modifications des Conditions</h2>
                <p>
                  Nous nous réservons le droit de modifier ces Conditions. Les changements importants seront notifiés 30 jours avant. L'utilisation continue constitue l'acceptation.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">14. Contact</h2>
                <p>
                  Pour toute question, contactez-nous à <a href="mailto:legal@prepiq.com" className="text-primary hover:underline">legal@prepiq.com</a>.
                </p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
                <p>
                  By accessing or using the PrepIQ platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Service. These Terms apply to all visitors, users, and others who access or use the Service.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">2. Description of Service</h2>
                <p>
                  PrepIQ provides AI-powered demand forecasting and prep planning tools for commercial kitchens and food service operations. The Service includes data analysis, predictive intelligence, inventory recommendations, and related features accessible through our web platform and API.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">3. Account Registration</h2>
                <p>
                  To use certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your account credentials and for all activities that occur under your account.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">4. Subscription & Billing</h2>
                <p>
                  Paid features of the Service are billed on a subscription basis. You will be billed in advance on a recurring monthly or annual cycle depending on the plan you select. Subscription fees are non-refundable except as required by law. We reserve the right to change pricing with 30 days' written notice.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">5. Free Trial</h2>
                <p>
                  PrepIQ may offer a free trial period. At the end of the trial, your account will be converted to a paid subscription unless you cancel before the trial ends. You will not be charged during the trial period.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">6. Data & Privacy</h2>
                <p>
                  Your use of the Service is also governed by our Privacy Policy. You retain ownership of all data you upload to the Service. By using the Service, you grant PrepIQ a limited license to process your data solely for the purpose of providing and improving the Service. We will not sell your data to third parties.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">7. Acceptable Use</h2>
                <p>You agree not to:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1.5">
                  <li>Use the Service for any unlawful purpose or in violation of any applicable laws</li>
                  <li>Attempt to gain unauthorized access to any portion of the Service</li>
                  <li>Reverse-engineer, decompile, or disassemble any part of the Service</li>
                  <li>Interfere with or disrupt the integrity or performance of the Service</li>
                  <li>Transmit any viruses, malware, or other harmful code through the Service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">8. Intellectual Property</h2>
                <p>
                  The Service and its original content, features, and functionality are owned by PrepIQ and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. Our trademarks may not be used without prior written consent.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">9. Limitation of Liability</h2>
                <p>
                  To the maximum extent permitted by law, PrepIQ shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly. Our total liability for any claim arising out of or relating to these Terms shall not exceed the amount you paid us in the 12 months preceding the claim.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">10. Disclaimer of Warranties</h2>
                <p>
                  The Service is provided "as is" and "as available" without warranties of any kind, whether express or implied. PrepIQ does not warrant that the Service will be uninterrupted, secure, or error-free. Forecasting results are estimates and should not be the sole basis for business decisions.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">11. Termination</h2>
                <p>
                  We may terminate or suspend your account at any time, with or without cause, with or without notice. Upon termination, your right to use the Service will immediately cease. You may export your data within 30 days of termination by contacting support.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">12. Governing Law</h2>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be resolved exclusively in the courts of San Francisco County, California.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">13. Changes to Terms</h2>
                <p>
                  We reserve the right to modify or replace these Terms at any time. Material changes will be communicated at least 30 days before they take effect. Continued use of the Service after changes constitutes acceptance of the revised Terms.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">14. Contact Us</h2>
                <p>
                  If you have any questions about these Terms, please contact us at{" "}
                  <a href="mailto:legal@prepiq.com" className="text-primary hover:underline">
                    legal@prepiq.com
                  </a>{" "}
                  or by mail at PrepIQ, San Francisco, CA.
                </p>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
