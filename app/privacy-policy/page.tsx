"use client";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function Page() {
  const { t, i18n } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50">
        <div className="section-container flex items-center justify-between py-5">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <div className="transition-all duration-300 h-10 w-10">
                <Image
                  src="/logo/golden-main-transparent.png"
                  alt="PrepIQ Logo"
                  width={40}
                  height={40}
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="font-display text-lg font-semibold text-foreground">
                PrepIQ
              </span>
            </Link>
          </div>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("common.backToHome")}
          </Link>
        </div>
      </header>

      <main className="section-container py-16 md:py-24 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-2">
          {t("privacy.title")}
        </h1>
        <p className="text-sm text-muted-foreground mb-12">
          {t("common.lastUpdated", {
            date:
              i18n.resolvedLanguage === "fr" ? "8 mars 2026" : "March 8, 2026",
          })}
        </p>

        <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">
          {i18n.resolvedLanguage === "fr" ? (
            <>
              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  1. Introduction
                </h2>

                <p>
                  PrepIQ est exploité par PrepIQ, basé à Kampala, en Ouganda.
                  Nous nous engageons à protéger la confidentialité et la
                  sécurité des informations qui nous sont confiées par nos
                  clients. Cette Politique de confidentialité explique comment
                  nous collectons, utilisons, stockons, partageons et protégeons
                  les informations lorsque vous accédez à la plateforme PrepIQ
                  ou utilisez nos services associés. Elle explique également vos
                  droits en matière de confidentialité et les choix qui
                  s'offrent à vous.
                </p>

                <p className="mt-3">
                  En accédant au Service ou en l'utilisant, vous reconnaissez
                  avoir lu et compris cette Politique de confidentialité.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  2. Informations que nous collectons
                </h2>

                <p className="mb-3">
                  Nous collectons les types d'informations suivants :
                </p>

                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    <strong className="text-foreground">
                      Informations du compte :
                    </strong>{" "}
                    Nom, adresse email, nom de l'entreprise et rôle lors de
                    l'inscription.
                  </li>

                  <li>
                    <strong className="text-foreground">
                      Données d'intégration :
                    </strong>{" "}
                    Informations reçues via des intégrations tierces telles que
                    les systèmes de caisse (POS), plateformes d'inventaire ou
                    autres services que vous choisissez de connecter.
                  </li>

                  <li>
                    <strong className="text-foreground">
                      Données opérationnelles :
                    </strong>{" "}
                    Données de ventes, historiques d'inventaire, menus, recettes
                    et autres données liées aux opérations de cuisine que vous
                    importez.
                  </li>

                  <li>
                    <strong className="text-foreground">
                      Données d'utilisation :
                    </strong>{" "}
                    Informations sur votre interaction avec le Service,
                    notamment les pages visitées, fonctionnalités utilisées et
                    durée des sessions.
                  </li>

                  <li>
                    <strong className="text-foreground">
                      Informations sur l'appareil :
                    </strong>{" "}
                    Type de navigateur, système d'exploitation, adresse IP et
                    identifiants de l'appareil.
                  </li>

                  <li>
                    <strong className="text-foreground">
                      Données de communication :
                    </strong>{" "}
                    Messages envoyés via nos formulaires de contact ou canaux
                    d'assistance.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  3. Utilisation de vos informations
                </h2>

                <p className="mb-3">
                  Nous utilisons les informations collectées pour fournir,
                  maintenir, améliorer et sécuriser le Service.
                </p>

                <h3 className="text-md font-semibold text-foreground mt-4 mb-2">
                  Pour exploiter le Service
                </h3>

                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    Créer des prévisions de demande et des analyses
                    opérationnelles.
                  </li>
                  <li>
                    Générer des plans de préparation et des recommandations
                    d'inventaire.
                  </li>
                  <li>Gérer les comptes utilisateurs et les abonnements.</li>
                  <li>Traiter les paiements et fournir un support client.</li>
                </ul>

                <h3 className="text-md font-semibold text-foreground mt-5 mb-2">
                  Pour améliorer la plateforme
                </h3>

                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Analyser les habitudes d'utilisation.</li>
                  <li>
                    Améliorer les performances et la fiabilité du produit.
                  </li>
                  <li>Développer de nouvelles fonctionnalités.</li>
                </ul>

                <h3 className="text-md font-semibold text-foreground mt-5 mb-2">
                  Pour communiquer avec vous
                </h3>

                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Répondre aux demandes d'assistance.</li>
                  <li>
                    Envoyer des notifications importantes liées au service et à
                    la sécurité.
                  </li>
                  <li>Fournir des mises à jour produit et liées au compte.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  4. Partage et divulgation des données
                </h2>

                <p className="mb-3">
                  Nous n'utilisons pas les données commerciales confidentielles
                  d'un client pour entraîner des modèles ou fournir des
                  informations à d'autres clients. Nous ne vendons, ne louons et
                  n'échangeons pas vos informations personnelles ou vos données
                  opérationnelles. Nous ne partageons jamais vos données
                  commerciales avec des annonceurs ou des courtiers en données.
                  Nous partageons uniquement les informations nécessaires pour
                  fournir le Service, respecter les obligations légales ou avec
                  votre autorisation explicite.
                </p>

                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong className="text-foreground">
                      Prestataires de services :
                    </strong>{" "}
                    Nous travaillons avec des fournisseurs tiers de confiance
                    pour l'hébergement, les paiements, l'analyse, l'envoi
                    d'emails, l'authentification et le support client. Ces
                    fournisseurs traitent vos données uniquement pour notre
                    compte et doivent les protéger.
                  </li>

                  <li>
                    <strong className="text-foreground">
                      Obligations légales :
                    </strong>{" "}
                    Nous pouvons divulguer des informations lorsque la loi, une
                    décision de justice ou une procédure légale valide l'exige.
                  </li>

                  <li>
                    <strong className="text-foreground">
                      Transferts commerciaux :
                    </strong>{" "}
                    En cas de fusion, acquisition, financement ou vente d'une
                    partie de PrepIQ, vos informations peuvent être transférées
                    dans le cadre de cette transaction.
                  </li>

                  <li>
                    <strong className="text-foreground">
                      Avec votre consentement :
                    </strong>{" "}
                    Nous pouvons partager vos informations lorsque vous nous y
                    autorisez explicitement.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  5. Sécurité des données
                </h2>

                <p>
                  Nous mettons en œuvre des mesures administratives, techniques
                  et organisationnelles destinées à protéger vos informations
                  contre tout accès non autorisé, divulgation, modification ou
                  destruction.
                </p>

                <p className="mt-3">
                  Notre plateforme est hébergée auprès de fournisseurs cloud
                  réputés qui appliquent des pratiques de sécurité reconnues.
                </p>

                <h3 className="text-md font-semibold text-foreground mt-5 mb-2">
                  Les mesures de sécurité comprennent :
                </h3>

                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Communications chiffrées via HTTPS/TLS.</li>
                  <li>Stockage chiffré des informations sensibles.</li>
                  <li>Contrôles d'accès basés sur les rôles.</li>
                  <li>Mécanismes sécurisés d'authentification.</li>
                  <li>Surveillance de l'infrastructure et journalisation.</li>
                  <li>Sauvegardes régulières et procédures de récupération.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  6. Confidentialité
                </h2>

                <p>
                  Nous reconnaissons que les informations confiées à PrepIQ
                  peuvent inclure des données commerciales confidentielles et
                  sensibles. L'accès aux données clients est limité aux
                  personnes autorisées qui en ont besoin pour exploiter,
                  maintenir ou supporter le Service, ou pour respecter des
                  obligations légales.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  7. Traitement par intelligence artificielle
                </h2>

                <p>
                  PrepIQ utilise l'intelligence artificielle pour générer des
                  prévisions, recommandations et analyses opérationnelles basées
                  sur les informations que vous fournissez. Les résultats
                  générés par l'IA sont destinés à aider la prise de décision et
                  ne remplacent pas le jugement professionnel.
                </p>

                <p className="mt-3">
                  Nous n'utilisons pas les informations commerciales
                  confidentielles d'un client pour entraîner des modèles ou
                  générer des recommandations pour d'autres clients.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  8. Propriété des données
                </h2>

                <p>
                  Votre organisation conserve la propriété de toutes les données
                  commerciales importées dans PrepIQ, notamment les ventes,
                  inventaires, recettes, menus, prévisions et données
                  opérationnelles. Nous traitons ces informations uniquement
                  pour fournir, maintenir, améliorer et supporter le Service.
                </p>

                <p className="mt-3">
                  Vous pouvez exporter vos données commerciales via les
                  fonctionnalités disponibles de la plateforme ou en contactant
                  notre équipe support.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  9. Conservation des données
                </h2>

                <p>
                  Nous conservons vos informations aussi longtemps que votre
                  compte est actif ou lorsque cela est nécessaire pour fournir
                  le Service. Après la suppression de votre compte, l'accès au
                  Service est désactivé. Les informations personnelles sont
                  supprimées dans un délai de 30 jours, sauf obligation légale
                  ou nécessité commerciale légitime. Les sauvegardes peuvent
                  être conservées temporairement avant suppression automatique.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  10. Vos droits
                </h2>

                <p className="mb-3">
                  Selon votre juridiction, vous pouvez disposer des droits
                  suivants :
                </p>

                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    Accéder, corriger ou supprimer vos informations
                    personnelles.
                  </li>
                  <li>Exporter vos données dans un format portable.</li>
                  <li>Refuser les communications marketing.</li>
                  <li>Limiter ou contester certains traitements.</li>
                  <li>
                    Retirer votre consentement lorsque celui-ci constitue la
                    base du traitement.
                  </li>
                </ul>

                <p className="mt-3">
                  Pour exercer ces droits, contactez-nous à{" "}
                  <a
                    href="mailto:customer@prepiq.com"
                    className="text-primary hover:underline"
                  >
                    customer@prepiq.com
                  </a>
                  .
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  11. Cookies et suivi
                </h2>

                <p>
                  Nous utilisons des cookies et technologies similaires pour
                  faire fonctionner, sécuriser et améliorer le Service.
                </p>

                <h3 className="text-md font-semibold text-foreground mt-5 mb-2">
                  Cookies essentiels
                </h3>
                <p>
                  Nécessaires pour l'authentification, la sécurité et les
                  fonctionnalités principales.
                </p>

                <h3 className="text-md font-semibold text-foreground mt-5 mb-2">
                  Cookies analytiques
                </h3>
                <p>
                  Nous aident à comprendre l'utilisation de PrepIQ afin
                  d'améliorer la plateforme.
                </p>

                <h3 className="text-md font-semibold text-foreground mt-5 mb-2">
                  Cookies de préférence
                </h3>
                <p>
                  Permettent de mémoriser vos préférences comme la langue et les
                  paramètres d'interface.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  12. Transferts internationaux
                </h2>

                <p>
                  Vos informations peuvent être transférées et traitées dans des
                  pays autres que le vôtre. Lorsque cela se produit, nous
                  mettons en place des garanties administratives, techniques et
                  organisationnelles appropriées afin de protéger vos données
                  conformément aux lois applicables.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  13. Confidentialité des enfants
                </h2>

                <p>
                  Le Service n'est pas destiné aux personnes âgées de moins de
                  16 ans. Nous ne collectons pas volontairement d'informations
                  personnelles concernant les enfants.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  14. Modifications de cette politique
                </h2>

                <p>
                  Nous pouvons modifier cette Politique de confidentialité afin
                  de refléter les changements dans nos services, exigences
                  légales ou pratiques commerciales. La date de mise à jour sera
                  modifiée en conséquence.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  15. Contactez-nous
                </h2>

                <p>
                  Pour toute question, préoccupation ou demande concernant cette
                  Politique de confidentialité, contactez-nous à{" "}
                  <a
                    href="mailto:customer@prepiq.com"
                    className="text-primary hover:underline"
                  >
                    customer@prepiq.com
                  </a>
                  .
                </p>

                <p className="mt-3">
                  PrepIQ
                  <br />
                  Kampala, Ouganda
                </p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  1. Introduction
                </h2>

                <p>
                  PrepIQ is operated by PrepIQ, based in Kampala, Uganda. We are
                  committed to protecting the privacy and security of the
                  information entrusted to us by our customers. This Privacy
                  Policy explains how we collect, use, store, disclose, and
                  protect information when you access or use the PrepIQ platform
                  and related services. It also explains your privacy rights and
                  the choices available to you.
                </p>

                <p className="mt-3">
                  By accessing or using the Service, you acknowledge that you
                  have read and understood this Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  2. Information We Collect
                </h2>
                <p className="mb-3">
                  We collect the following types of information:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    <strong className="text-foreground">
                      Account Information:
                    </strong>{" "}
                    Name, email address, company name, and role when you
                    register
                  </li>

                  <li>
                    <strong className="text-foreground">
                      Integration Data:
                    </strong>{" "}
                    Information received from third-party integrations such as
                    POS systems, inventory platforms, or other services you
                    choose to connect.
                  </li>

                  <li>
                    <strong className="text-foreground">
                      Operational Data:
                    </strong>{" "}
                    Sales data, inventory records, menu items, and other
                    kitchen-related data you upload
                  </li>
                  <li>
                    <strong className="text-foreground">Usage Data:</strong> How
                    you interact with the Service, including pages visited,
                    features used, and session duration
                  </li>
                  <li>
                    <strong className="text-foreground">
                      Device Information:
                    </strong>{" "}
                    Browser type, operating system, IP address, and device
                    identifiers
                  </li>
                  <li>
                    <strong className="text-foreground">
                      Communication Data:
                    </strong>{" "}
                    Messages you send through our contact forms or support
                    channels
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  3. How We Use Your Information
                </h2>

                <p className="mb-3">
                  We use the information we collect to provide, maintain,
                  improve, and secure the Service.
                </p>

                <h3 className="text-md font-semibold text-foreground mt-4 mb-2">
                  To operate the Service
                </h3>

                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Create demand forecasts and operational insights.</li>
                  <li>Generate prep plans and inventory recommendations.</li>
                  <li>Manage user accounts and subscriptions.</li>
                  <li>Process payments and provide customer support.</li>
                </ul>

                <h3 className="text-md font-semibold text-foreground mt-5 mb-2">
                  To improve the platform
                </h3>

                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Analyze usage patterns.</li>
                  <li>Improve product performance and reliability.</li>
                  <li>Develop new features and enhancements.</li>
                </ul>

                <h3 className="text-md font-semibold text-foreground mt-5 mb-2">
                  To communicate with you
                </h3>

                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Respond to support requests.</li>
                  <li>Send important service and security notifications.</li>
                  <li>
                    Provide product updates and account-related communications.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  4. Data Sharing & Disclosure
                </h2>

                <p className="mb-3">
                  We do not use one customer's confidential business data to
                  train models or provide insights to other customers. We do{" "}
                  <strong>not</strong> sell, rent, or trade your personal
                  information or your business operational data. We never share
                  your business operational data with advertisers or data
                  brokers. We only share information when it is necessary to
                  provide the Service, comply with legal obligations, or with
                  your explicit permission.
                </p>

                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong className="text-foreground">
                      Service Providers:
                    </strong>{" "}
                    We work with trusted third-party providers that help us
                    operate the Service, including cloud hosting, payment
                    processing, analytics, email delivery, authentication, and
                    customer support. These providers may only process your data
                    on our behalf and are contractually required to protect it.
                  </li>

                  <li>
                    <strong className="text-foreground">
                      Legal Compliance:
                    </strong>{" "}
                    We may disclose information when required to do so by law,
                    regulation, court order, or other valid legal process, or
                    when necessary to protect the rights, safety, or security of
                    PrepIQ, our customers, or others.
                  </li>

                  <li>
                    <strong className="text-foreground">
                      Business Transfers:
                    </strong>{" "}
                    If PrepIQ is involved in a merger, acquisition, financing,
                    or sale of all or part of its business, your information may
                    be transferred as part of that transaction. We will notify
                    affected customers where required by applicable law.
                  </li>
                  <li>
                    <strong className="text-foreground">
                      With Your Consent:
                    </strong>{" "}
                    We may share your information with third parties when you
                    request or explicitly authorize us to do so.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  5. Data Security
                </h2>

                <p>
                  We implement administrative, technical, and organizational
                  safeguards designed to protect your information from
                  unauthorized access, disclosure, alteration, or destruction.
                  While no system can guarantee absolute security, we
                  continuously work to maintain a secure and reliable platform.
                </p>

                <p className="mt-3">
                  Our platform is hosted using reputable cloud providers that
                  maintain recognized security certifications and follow
                  industry best practices where applicable.
                </p>

                <h3 className="text-md font-semibold text-foreground mt-5 mb-2">
                  Security measures include:
                </h3>

                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Encrypted communications using HTTPS/TLS.</li>
                  <li>Encrypted storage for sensitive information.</li>
                  <li>Role-based access controls.</li>
                  <li>Secure authentication and authorization mechanisms.</li>
                  <li>Infrastructure monitoring and logging.</li>
                  <li>Regular backups and recovery procedures.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  6. Confidentiality
                </h2>

                <p>
                  We recognize that the information you entrust to PrepIQ may
                  include confidential and commercially sensitive business
                  information. Access to customer data is limited to authorized
                  personnel who require it to operate, maintain, or support the
                  Service, or to comply with legal obligations. Personnel with
                  access to customer information are expected to maintain its
                  confidentiality.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  7. AI Processing
                </h2>

                <p>
                  PrepIQ uses artificial intelligence to generate forecasts,
                  recommendations, and operational insights based on the
                  information you provide. AI-generated outputs are intended to
                  assist operational decision-making and should not replace
                  professional judgment.
                </p>

                <p className="mt-3">
                  We do not use one customer's confidential business information
                  to train models or generate recommendations for other
                  customers.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  8. Data Ownership
                </h2>

                <p>
                  Your organization retains ownership of all business data
                  uploaded to PrepIQ, including sales records, inventory
                  information, recipes, menus, forecasts, and operational data.
                  We process this information solely to provide, maintain,
                  improve, and support the Service. We do not claim ownership of
                  your business data.
                </p>

                <p className="mt-3">
                  You may export your business data using available platform
                  features or by contacting our support team.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  9. Data Retention
                </h2>
                <p>
                  We retain your information for as long as your account is
                  active or as needed to provide the Service. When you delete
                  your account, access to the Service is immediately disabled.
                  Personal information is removed within 30 days, except where
                  retention is required by law or for legitimate business
                  purposes such as fraud prevention. Anonymized, aggregated data
                  may be retained indefinitely for analytics purposes. Backup
                  copies may remain in secure backup systems for a limited
                  period before automatic deletion.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  10. Your Rights
                </h2>
                <p className="mb-3">
                  Depending on your jurisdiction, you may have the right to:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Access, correct, or delete your personal information</li>
                  <li>Export your data in a portable format</li>
                  <li>Opt out of marketing communications</li>
                  <li>Restrict or object to certain data processing</li>
                  <li>Withdraw consent where processing is based on consent</li>
                </ul>

                <p className="mt-3">
                  To exercise these rights, contact us at{" "}
                  <a
                    href="mailto:support@prepiq.com"
                    className="text-primary hover:underline"
                  >
                    support@prepiq.com
                  </a>{" "}
                  We will respond to verified requests within a reasonable
                  timeframe, as required by applicable law.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  11. Cookies & Tracking
                </h2>

                <p>
                  We use cookies and similar technologies to operate, secure,
                  and improve the Service. You may control cookies through your
                  browser settings, although disabling essential cookies may
                  affect certain features of the Service.
                </p>

                <h3 className="text-md font-semibold text-foreground mt-5 mb-2">
                  Essential Cookies
                </h3>

                <p>
                  Required for authentication, security, and core platform
                  functionality.
                </p>

                <h3 className="text-md font-semibold text-foreground mt-5 mb-2">
                  Analytics Cookies
                </h3>

                <p>
                  Help us understand how customers use PrepIQ so we can improve
                  performance and usability.
                </p>

                <h3 className="text-md font-semibold text-foreground mt-5 mb-2">
                  Preference Cookies
                </h3>

                <p>
                  Remember your preferences such as language and interface
                  settings.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  11. International Transfers
                </h2>

                <p>
                  Your information may be transferred to and processed in
                  countries other than your own. Where this occurs, we implement
                  appropriate administrative, technical, and organizational
                  safeguards, including Standard Contractual Clauses where
                  applicable, to protect your information in accordance with
                  applicable data protection laws.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  12. Children's Privacy
                </h2>
                <p>
                  The Service is not directed to individuals under the age of
                  16. We do not knowingly collect personal information from
                  children. If we become aware that we have collected data from
                  a child, we will delete it promptly.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  13. Changes to This Policy
                </h2>

                <p>
                  We may update this Privacy Policy from time to time to reflect
                  changes in our services, legal requirements, or business
                  practices. The updated policy will include a revised "Last
                  Updated" date.
                </p>

                <p className="mt-3">
                  If changes materially affect your rights or how we process
                  your information, we will provide additional notice through
                  the Service or by email where appropriate. Your continued use
                  of the Service after the effective date of the updated Privacy
                  Policy constitutes acceptance of the revised policy.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  14. Contact Us
                </h2>

                <p>
                  If you have questions, concerns, or requests regarding this
                  Privacy Policy or our data handling practices, please contact
                  us at{" "}
                  <a
                    href="mailto:customer@prepiq.com"
                    className="text-primary hover:underline"
                  >
                    customer@prepiq.com
                  </a>
                  .
                </p>

                <p className="mt-3">
                  PrepIQ
                  <br />
                  Kampala, Uganda
                </p>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
