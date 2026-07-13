// Initial legal document content, converted from the previously hardcoded
// pages (app/privacy-policy, app/terms-of-service, app/security).
// After seeding, the admin UI (/admin/legal) is the source of truth —
// this file is only used to bootstrap an empty database.

export interface LegalSeedDoc {
  slug: string;
  titleEn: string;
  titleFr: string;
  bodyEn: string;
  bodyFr: string;
  effectiveDate: Date;
}

const EFFECTIVE_DATE = new Date("2026-03-08T00:00:00.000Z");

const PRIVACY_EN = `## 1. Introduction

PrepIQ is operated by PrepIQ, based in Kampala, Uganda. We are committed to protecting the privacy and security of the information entrusted to us by our customers. This Privacy Policy explains how we collect, use, store, disclose, and protect information when you access or use the PrepIQ platform and related services. It also explains your privacy rights and the choices available to you.

By accessing or using the Service, you acknowledge that you have read and understood this Privacy Policy.

## 2. Information We Collect

We collect the following types of information:

- **Account Information:** Name, email address, company name, and role when you register.
- **Integration Data:** Information received from third-party integrations such as POS systems, inventory platforms, or other services you choose to connect.
- **Operational Data:** Sales data, inventory records, menu items, and other kitchen-related data you upload.
- **Usage Data:** How you interact with the Service, including pages visited, features used, and session duration.
- **Device Information:** Browser type, operating system, IP address, and device identifiers.
- **Communication Data:** Messages you send through our contact forms or support channels.

## 3. How We Use Your Information

We use the information we collect to provide, maintain, improve, and secure the Service.

### To operate the Service

- Create demand forecasts and operational insights.
- Generate prep plans and inventory recommendations.
- Manage user accounts and subscriptions.
- Process payments and provide customer support.

### To improve the platform

- Analyze usage patterns.
- Improve product performance and reliability.
- Develop new features and enhancements.

### To communicate with you

- Respond to support requests.
- Send important service and security notifications.
- Provide product updates and account-related communications.

## 4. Data Sharing & Disclosure

We do not use one customer's confidential business data to train models or provide insights to other customers. We do **not** sell, rent, or trade your personal information or your business operational data. We never share your business operational data with advertisers or data brokers. We only share information when it is necessary to provide the Service, comply with legal obligations, or with your explicit permission.

- **Service Providers:** We work with trusted third-party providers that help us operate the Service, including cloud hosting, payment processing, analytics, email delivery, authentication, and customer support. These providers may only process your data on our behalf and are contractually required to protect it.
- **Legal Compliance:** We may disclose information when required to do so by law, regulation, court order, or other valid legal process, or when necessary to protect the rights, safety, or security of PrepIQ, our customers, or others.
- **Business Transfers:** If PrepIQ is involved in a merger, acquisition, financing, or sale of all or part of its business, your information may be transferred as part of that transaction. We will notify affected customers where required by applicable law.
- **With Your Consent:** We may share your information with third parties when you request or explicitly authorize us to do so.

## 5. Data Security

We implement administrative, technical, and organizational safeguards designed to protect your information from unauthorized access, disclosure, alteration, or destruction. While no system can guarantee absolute security, we continuously work to maintain a secure and reliable platform.

Our platform is hosted using reputable cloud providers that maintain recognized security certifications and follow industry best practices where applicable.

### Security measures include:

- Encrypted communications using HTTPS/TLS.
- Encrypted storage for sensitive information.
- Role-based access controls.
- Secure authentication and authorization mechanisms.
- Infrastructure monitoring and logging.
- Regular backups and recovery procedures.

## 6. Confidentiality

We recognize that the information you entrust to PrepIQ may include confidential and commercially sensitive business information. Access to customer data is limited to authorized personnel who require it to operate, maintain, or support the Service, or to comply with legal obligations. Personnel with access to customer information are expected to maintain its confidentiality.

## 7. AI Processing

PrepIQ uses artificial intelligence to generate forecasts, recommendations, and operational insights based on the information you provide. AI-generated outputs are intended to assist operational decision-making and should not replace professional judgment.

We do not use one customer's confidential business information to train models or generate recommendations for other customers.

## 8. Data Ownership

Your organization retains ownership of all business data uploaded to PrepIQ, including sales records, inventory information, recipes, menus, forecasts, and operational data. We process this information solely to provide, maintain, improve, and support the Service. We do not claim ownership of your business data.

You may export your business data using available platform features or by contacting our support team.

## 9. Data Retention

We retain your information for as long as your account is active or as needed to provide the Service. When you delete your account, access to the Service is immediately disabled. Personal information is removed within 30 days, except where retention is required by law or for legitimate business purposes such as fraud prevention. Anonymized, aggregated data may be retained indefinitely for analytics purposes. Backup copies may remain in secure backup systems for a limited period before automatic deletion.

## 10. Your Rights

Depending on your jurisdiction, you may have the right to:

- Access, correct, or delete your personal information
- Export your data in a portable format
- Opt out of marketing communications
- Restrict or object to certain data processing
- Withdraw consent where processing is based on consent

To exercise these rights, contact us at [support@prepiq.com](mailto:support@prepiq.com). We will respond to verified requests within a reasonable timeframe, as required by applicable law.

## 11. Cookies & Tracking

We use cookies and similar technologies to operate, secure, and improve the Service. You may control cookies through your browser settings, although disabling essential cookies may affect certain features of the Service.

### Essential Cookies

Required for authentication, security, and core platform functionality.

### Analytics Cookies

Help us understand how customers use PrepIQ so we can improve performance and usability.

### Preference Cookies

Remember your preferences such as language and interface settings.

## 12. International Transfers

Your information may be transferred to and processed in countries other than your own. Where this occurs, we implement appropriate administrative, technical, and organizational safeguards, including Standard Contractual Clauses where applicable, to protect your information in accordance with applicable data protection laws.

## 13. Children's Privacy

The Service is not directed to individuals under the age of 16. We do not knowingly collect personal information from children. If we become aware that we have collected data from a child, we will delete it promptly.

## 14. Changes to This Policy

We may update this Privacy Policy from time to time to reflect changes in our services, legal requirements, or business practices. The updated policy will include a revised "Last Updated" date.

If changes materially affect your rights or how we process your information, we will provide additional notice through the Service or by email where appropriate. Your continued use of the Service after the effective date of the updated Privacy Policy constitutes acceptance of the revised policy.

## 15. Contact Us

If you have questions, concerns, or requests regarding this Privacy Policy or our data handling practices, please contact us at [customer@prepiq.com](mailto:customer@prepiq.com).

PrepIQ
Kampala, Uganda
`;

const PRIVACY_FR = `## 1. Introduction

PrepIQ est exploité par PrepIQ, basé à Kampala, en Ouganda. Nous nous engageons à protéger la confidentialité et la sécurité des informations qui nous sont confiées par nos clients. Cette Politique de confidentialité explique comment nous collectons, utilisons, stockons, partageons et protégeons les informations lorsque vous accédez à la plateforme PrepIQ ou utilisez nos services associés. Elle explique également vos droits en matière de confidentialité et les choix qui s'offrent à vous.

En accédant au Service ou en l'utilisant, vous reconnaissez avoir lu et compris cette Politique de confidentialité.

## 2. Informations que nous collectons

Nous collectons les types d'informations suivants :

- **Informations du compte :** Nom, adresse email, nom de l'entreprise et rôle lors de l'inscription.
- **Données d'intégration :** Informations reçues via des intégrations tierces telles que les systèmes de caisse (POS), plateformes d'inventaire ou autres services que vous choisissez de connecter.
- **Données opérationnelles :** Données de ventes, historiques d'inventaire, menus, recettes et autres données liées aux opérations de cuisine que vous importez.
- **Données d'utilisation :** Informations sur votre interaction avec le Service, notamment les pages visitées, fonctionnalités utilisées et durée des sessions.
- **Informations sur l'appareil :** Type de navigateur, système d'exploitation, adresse IP et identifiants de l'appareil.
- **Données de communication :** Messages envoyés via nos formulaires de contact ou canaux d'assistance.

## 3. Utilisation de vos informations

Nous utilisons les informations collectées pour fournir, maintenir, améliorer et sécuriser le Service.

### Pour exploiter le Service

- Créer des prévisions de demande et des analyses opérationnelles.
- Générer des plans de préparation et des recommandations d'inventaire.
- Gérer les comptes utilisateurs et les abonnements.
- Traiter les paiements et fournir un support client.

### Pour améliorer la plateforme

- Analyser les habitudes d'utilisation.
- Améliorer les performances et la fiabilité du produit.
- Développer de nouvelles fonctionnalités.

### Pour communiquer avec vous

- Répondre aux demandes d'assistance.
- Envoyer des notifications importantes liées au service et à la sécurité.
- Fournir des mises à jour produit et liées au compte.

## 4. Partage et divulgation des données

Nous n'utilisons pas les données commerciales confidentielles d'un client pour entraîner des modèles ou fournir des informations à d'autres clients. Nous ne vendons, ne louons et n'échangeons pas vos informations personnelles ou vos données opérationnelles. Nous ne partageons jamais vos données commerciales avec des annonceurs ou des courtiers en données. Nous partageons uniquement les informations nécessaires pour fournir le Service, respecter les obligations légales ou avec votre autorisation explicite.

- **Prestataires de services :** Nous travaillons avec des fournisseurs tiers de confiance pour l'hébergement, les paiements, l'analyse, l'envoi d'emails, l'authentification et le support client. Ces fournisseurs traitent vos données uniquement pour notre compte et doivent les protéger.
- **Obligations légales :** Nous pouvons divulguer des informations lorsque la loi, une décision de justice ou une procédure légale valide l'exige.
- **Transferts commerciaux :** En cas de fusion, acquisition, financement ou vente d'une partie de PrepIQ, vos informations peuvent être transférées dans le cadre de cette transaction.
- **Avec votre consentement :** Nous pouvons partager vos informations lorsque vous nous y autorisez explicitement.

## 5. Sécurité des données

Nous mettons en œuvre des mesures administratives, techniques et organisationnelles destinées à protéger vos informations contre tout accès non autorisé, divulgation, modification ou destruction.

Notre plateforme est hébergée auprès de fournisseurs cloud réputés qui appliquent des pratiques de sécurité reconnues.

### Les mesures de sécurité comprennent :

- Communications chiffrées via HTTPS/TLS.
- Stockage chiffré des informations sensibles.
- Contrôles d'accès basés sur les rôles.
- Mécanismes sécurisés d'authentification.
- Surveillance de l'infrastructure et journalisation.
- Sauvegardes régulières et procédures de récupération.

## 6. Confidentialité

Nous reconnaissons que les informations confiées à PrepIQ peuvent inclure des données commerciales confidentielles et sensibles. L'accès aux données clients est limité aux personnes autorisées qui en ont besoin pour exploiter, maintenir ou supporter le Service, ou pour respecter des obligations légales.

## 7. Traitement par intelligence artificielle

PrepIQ utilise l'intelligence artificielle pour générer des prévisions, recommandations et analyses opérationnelles basées sur les informations que vous fournissez. Les résultats générés par l'IA sont destinés à aider la prise de décision et ne remplacent pas le jugement professionnel.

Nous n'utilisons pas les informations commerciales confidentielles d'un client pour entraîner des modèles ou générer des recommandations pour d'autres clients.

## 8. Propriété des données

Votre organisation conserve la propriété de toutes les données commerciales importées dans PrepIQ, notamment les ventes, inventaires, recettes, menus, prévisions et données opérationnelles. Nous traitons ces informations uniquement pour fournir, maintenir, améliorer et supporter le Service.

Vous pouvez exporter vos données commerciales via les fonctionnalités disponibles de la plateforme ou en contactant notre équipe support.

## 9. Conservation des données

Nous conservons vos informations aussi longtemps que votre compte est actif ou lorsque cela est nécessaire pour fournir le Service. Après la suppression de votre compte, l'accès au Service est désactivé. Les informations personnelles sont supprimées dans un délai de 30 jours, sauf obligation légale ou nécessité commerciale légitime. Les sauvegardes peuvent être conservées temporairement avant suppression automatique.

## 10. Vos droits

Selon votre juridiction, vous pouvez disposer des droits suivants :

- Accéder, corriger ou supprimer vos informations personnelles.
- Exporter vos données dans un format portable.
- Refuser les communications marketing.
- Limiter ou contester certains traitements.
- Retirer votre consentement lorsque celui-ci constitue la base du traitement.

Pour exercer ces droits, contactez-nous à [customer@prepiq.com](mailto:customer@prepiq.com).

## 11. Cookies et suivi

Nous utilisons des cookies et technologies similaires pour faire fonctionner, sécuriser et améliorer le Service.

### Cookies essentiels

Nécessaires pour l'authentification, la sécurité et les fonctionnalités principales.

### Cookies analytiques

Nous aident à comprendre l'utilisation de PrepIQ afin d'améliorer la plateforme.

### Cookies de préférence

Permettent de mémoriser vos préférences comme la langue et les paramètres d'interface.

## 12. Transferts internationaux

Vos informations peuvent être transférées et traitées dans des pays autres que le vôtre. Lorsque cela se produit, nous mettons en place des garanties administratives, techniques et organisationnelles appropriées afin de protéger vos données conformément aux lois applicables.

## 13. Confidentialité des enfants

Le Service n'est pas destiné aux personnes âgées de moins de 16 ans. Nous ne collectons pas volontairement d'informations personnelles concernant les enfants.

## 14. Modifications de cette politique

Nous pouvons modifier cette Politique de confidentialité afin de refléter les changements dans nos services, exigences légales ou pratiques commerciales. La date de mise à jour sera modifiée en conséquence.

## 15. Contactez-nous

Pour toute question, préoccupation ou demande concernant cette Politique de confidentialité, contactez-nous à [customer@prepiq.com](mailto:customer@prepiq.com).

PrepIQ
Kampala, Ouganda
`;

const TERMS_EN = `## 1. Acceptance of Terms

By accessing or using the PrepIQ platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Service. These Terms apply to all visitors, users, and others who access or use the Service.

## 2. Description of Service

PrepIQ provides AI-powered demand forecasting and prep planning tools for commercial kitchens and food service operations. The Service includes data analysis, predictive intelligence, inventory recommendations, and related features accessible through our web platform and API.

## 3. Account Registration

To use certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your account credentials and for all activities that occur under your account.

## 4. Subscription & Billing

Paid features of the Service are billed on a subscription basis. You will be billed in advance on a recurring monthly or annual cycle depending on the plan you select. Subscription fees are non-refundable except as required by law. We reserve the right to change pricing with 30 days' written notice.

## 5. Free Trial

PrepIQ may offer a free trial period. At the end of the trial, your account will be converted to a paid subscription unless you cancel before the trial ends. You will not be charged during the trial period.

## 6. Data & Privacy

Your use of the Service is also governed by our Privacy Policy. You retain ownership of all data you upload to the Service. By using the Service, you grant PrepIQ a limited license to process your data solely for the purpose of providing and improving the Service. We will not sell your data to third parties.

## 7. Acceptable Use

You agree not to:

- Use the Service for any unlawful purpose or in violation of any applicable laws
- Attempt to gain unauthorized access to any portion of the Service
- Reverse-engineer, decompile, or disassemble any part of the Service
- Interfere with or disrupt the integrity or performance of the Service
- Transmit any viruses, malware, or other harmful code through the Service

## 8. Intellectual Property

The Service and its original content, features, and functionality are owned by PrepIQ and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. Our trademarks may not be used without prior written consent.

## 9. Limitation of Liability

To the maximum extent permitted by law, PrepIQ shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly. Our total liability for any claim arising out of or relating to these Terms shall not exceed the amount you paid us in the 12 months preceding the claim.

## 10. Disclaimer of Warranties

The Service is provided "as is" and "as available" without warranties of any kind, whether express or implied. PrepIQ does not warrant that the Service will be uninterrupted, secure, or error-free. Forecasting results are estimates and should not be the sole basis for business decisions.

## 11. Termination

We may terminate or suspend your account at any time, with or without cause, with or without notice. Upon termination, your right to use the Service will immediately cease. You may export your data within 30 days of termination by contacting support.

## 12. Governing Law

These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be resolved exclusively in the courts of San Francisco County, California.

## 13. Changes to Terms

We reserve the right to modify or replace these Terms at any time. Material changes will be communicated at least 30 days before they take effect. Continued use of the Service after changes constitutes acceptance of the revised Terms.

## 14. Contact Us

If you have any questions about these Terms, please contact us at [customer@prepiq.com](mailto:customer@prepiq.com) or by mail at PrepIQ, Kampala, UG.
`;

const TERMS_FR = `## 1. Acceptation des Conditions

En accédant ou en utilisant la plateforme PrepIQ ("le Service"), vous acceptez d'être lié par ces Conditions d'utilisation ("Conditions"). Si vous n'acceptez pas ces Conditions, vous ne pouvez pas accéder ou utiliser le Service.

## 2. Description du Service

PrepIQ fournit des outils de prévision de la demande et de planification de la mise en place alimentés par l'IA pour les cuisines professionnelles. Le Service comprend l'analyse de données, l'intelligence prédictive et les recommandations d'inventaire.

## 3. Inscription au Compte

Pour utiliser certaines fonctionnalités, vous devez créer un compte. Vous vous engagez à fournir des informations exactes et à les maintenir à jour. Vous êtes responsable de la sécurité de vos identifiants.

## 4. Abonnement et Facturation

Les fonctionnalités payantes sont facturées par abonnement mensuel ou annuel. Les frais sont non remboursables, sauf obligation légale. Nous nous réservons le droit de modifier les tarifs avec un préavis de 30 jours.

## 5. Essai Gratuit

PrepIQ peut proposer une période d'essai gratuite. À l'issue de celle-ci, l'abonnement devient payant sauf résiliation avant la fin de l'essai.

## 6. Données et Confidentialité

Votre utilisation est régie par notre Politique de confidentialité. Vous restez propriétaire de vos données. Vous nous accordez une licence limitée pour les traiter aux fins de fourniture du Service.

## 7. Usage Acceptable

Vous acceptez de ne pas :

- Utiliser le Service à des fins illégales
- Tenter d'accéder sans autorisation à une partie du Service
- Pratiquer l'ingénierie inverse sur le Service
- Perturber l'intégrité ou la performance du Service

## 8. Propriété Intellectuelle

Le Service et son contenu original sont la propriété exclusive de PrepIQ et sont protégés par les lois internationales sur la propriété intellectuelle.

## 9. Limitation de Responsabilité

Dans la mesure permise par la loi, PrepIQ ne sera pas responsable des dommages indirects ou pertes de profits. Notre responsabilité totale ne dépassera pas le montant payé au cours des 12 derniers mois.

## 10. Clause de Non-garantie

Le Service est fourni "en l'état". PrepIQ ne garantit pas une disponibilité ininterrompue ou sans erreur. Les prévisions sont des estimations et ne doivent pas être la seule base de décision.

## 11. Résiliation

Nous pouvons suspendre votre compte à tout moment. En cas de résiliation, votre droit d'accès cesse immédiatement. Vous disposez de 30 jours pour exporter vos données.

## 12. Droit Applicable

Ces Conditions sont régies par les lois de l'État de Californie, États-Unis. Tout litige sera porté devant les tribunaux de San Francisco.

## 13. Modifications des Conditions

Nous nous réservons le droit de modifier ces Conditions. Les changements importants seront notifiés 30 jours avant. L'utilisation continue constitue l'acceptation.

## 14. Contact

Pour toute question, contactez-nous à [customer@prepiq.com](mailto:customer@prepiq.com).
`;

const SECURITY_EN = `Your kitchen data is the backbone of your operations. We treat it with the same care you put into every plate — protected at every layer, audited regularly, and never sold to third parties.

## Encryption

All data is encrypted in transit with TLS 1.3 and at rest using AES-256 encryption. Database connections use SSL certificates, and all API communications are encrypted end-to-end.

## Infrastructure

Our infrastructure is hosted on SOC 2 Type II certified cloud providers with redundant systems across multiple availability zones. We maintain 99.9% uptime SLA with automated failover.

## Access Controls

Role-based access control (RBAC) ensures team members only see what they need. Multi-factor authentication (MFA) is available for all accounts. Session tokens expire automatically after inactivity.

## Monitoring & Detection

24/7 automated threat monitoring, intrusion detection systems, and real-time alerting. All access events are logged and auditable. Anomalous behavior triggers immediate investigation.

## Compliance

PrepIQ maintains SOC 2 Type II compliance with annual third-party audits. We adhere to GDPR, CCPA, and industry best practices for data protection and privacy.

## Vendor Security

All third-party vendors undergo rigorous security assessments before integration. We maintain a minimal vendor footprint and regularly review access permissions and data sharing agreements.

## Secure Development Lifecycle

Every code change goes through automated security scanning, peer review, and staging validation before reaching production. We perform regular penetration testing through independent third-party firms and run a continuous vulnerability management program across all systems.

## Data Isolation

Each customer's data is logically isolated at the database level. Cross-tenant access is architecturally impossible. Backups are encrypted and stored in geographically separate regions with strict access controls.

## Incident Response

We maintain a documented incident response plan with defined escalation paths. In the unlikely event of a security incident, affected customers will be notified within 72 hours in accordance with applicable regulations. Post-incident reviews are conducted to prevent recurrence.

## Responsible Disclosure

If you discover a security vulnerability, please report it to [security@prepiq.com](mailto:security@prepiq.com). We appreciate responsible disclosure and will acknowledge receipt within 24 hours. We do not pursue legal action against good-faith security researchers.
`;

const SECURITY_FR = `Les données de votre cuisine sont le cœur de vos opérations. Nous les traitons avec le même soin que vous mettez dans vos plats — protection multicouche, audits réguliers et aucune revente.

## Chiffrement

Toutes les données sont chiffrées en transit via TLS 1.3 et au repos par AES-256. Les communications API sont protégées de bout en bout.

## Infrastructure

Hébergement sur des serveurs certifiés SOC 2 Type II avec redondance multi-zones. Nous garantissons un SLA de disponibilité de 99,9 %.

## Contrôle d'Accès

L'accès basé sur les rôles (RBAC) limite la visibilité au nécessaire. La double authentification (MFA) est disponible pour tous.

## Surveillance et Détection

Détection d'intrusion 24/7 et alertes en temps réel. Chaque accès est journalisé et audité systématiquement.

## Conformité

PrepIQ maintient sa certification SOC 2 Type II. Nous respectons scrupuleusement le RGPD et les meilleures pratiques du secteur.

## Sécurité Fournisseurs

Nos partenaires subissent des audits de sécurité rigoureux. Nous limitons le partage de données au strict minimum opérationnel.

## Cycle de Développement Sécurisé

Chaque modification de code passe par des scans de sécurité automatisés, une revue par les pairs et une validation en environnement de test avant la mise en production. Nous effectuons des tests d'intrusion réguliers via des cabinets tiers indépendants.

## Isolation des Données

Les données de chaque client sont isolées logiquement au niveau de la base de données. L'accès inter-clients est architecturalement impossible. Les sauvegardes sont chiffrées et stockées dans des régions géographiques séparées.

## Gestion des Incidents

Nous maintenons un plan de réponse aux incidents documenté. En cas d'incident, les clients concernés seront informés sous 72 heures conformément aux réglementations en vigueur.

## Divulgation Responsable

Si vous découvrez une vulnérabilité, veuillez nous la signaler à [security@prepiq.com](mailto:security@prepiq.com). Nous accusons réception sous 24 heures et ne poursuivons pas les chercheurs en sécurité agissant de bonne foi.
`;

export const LEGAL_SEED_DOCS: LegalSeedDoc[] = [
  {
    slug: "privacy-policy",
    titleEn: "Privacy Policy",
    titleFr: "Politique de confidentialité",
    bodyEn: PRIVACY_EN,
    bodyFr: PRIVACY_FR,
    effectiveDate: EFFECTIVE_DATE,
  },
  {
    slug: "terms-of-service",
    titleEn: "Terms of Service",
    titleFr: "Conditions d'utilisation",
    bodyEn: TERMS_EN,
    bodyFr: TERMS_FR,
    effectiveDate: EFFECTIVE_DATE,
  },
  {
    slug: "security",
    titleEn: "Security at PrepIQ",
    titleFr: "La Sécurité chez PrepIQ",
    bodyEn: SECURITY_EN,
    bodyFr: SECURITY_FR,
    effectiveDate: EFFECTIVE_DATE,
  },
];
