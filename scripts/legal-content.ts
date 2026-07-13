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

const EFFECTIVE_DATE = new Date("2026-07-13T00:00:00.000Z");

const TERMS_EN = `## 1. Introduction

Welcome to PrepIQ. PrepIQ is a kitchen intelligence platform built for restaurants, cafés, catering operations, and other food service businesses. We help you forecast demand, plan production, manage inventory, and run a more predictable kitchen — using your historical sales data, point-of-sale integrations, and artificial intelligence.

PrepIQ is operated by PrepIQ, a company based in Kampala, Uganda ("PrepIQ," "we," "us," or "our"). These Terms of Service ("Terms") govern your access to and use of the PrepIQ website, mobile applications, dashboard, APIs, the PIQ Connector software, and all related services (together, the "Service").

The Service is intended for business use by restaurants and other food service operators. It is not intended for personal, household, or consumer use.

## 2. Eligibility

To use the Service, you must:

- Be at least 18 years old and legally able to enter into a binding contract on behalf of yourself or the business you represent.
- Be using the Service for a legitimate business — PrepIQ is built for restaurants, cafés, catering companies, and similar food service operations, not personal use.
- Be responsible for the security of your account credentials and for everything that happens under your account, including actions taken by employees or contractors you invite.

If you are creating an account on behalf of a company or organization, you confirm that you have the authority to bind that organization to these Terms.

## 3. Acceptance of Terms

By creating an account, accessing, or using the Service in any way, you agree to be bound by these Terms and by our Privacy Policy, which is incorporated into these Terms by reference. If you do not agree, you must not access or use the Service.

## 4. The Services We Provide

PrepIQ provides a growing set of tools designed to make running a kitchen more predictable, including:

- **Demand forecasting** — predicting how much of each menu item you're likely to sell, based on your sales history, seasonality, weather, local events, and other signals.
- **Production and prep planning** — turning forecasts into concrete prep lists and production plans for your kitchen team.
- **Inventory management** — tracking stock levels, usage, and waste, and helping you avoid both stockouts and over-ordering.
- **Notifications and alerts** — operational alerts such as stockout risk, planning reminders, production alerts, and connector health status, delivered in-app, by push notification, or by email.
- **The PrepIQ Assistant** — an AI-powered conversational assistant that can answer operational questions and help you interpret your data.
- **Reporting and analytics** — dashboards and reports that summarize your sales, waste, and forecast accuracy over time.
- **The PIQ Connector** — software that connects PrepIQ to your point-of-sale (POS) system or other in-kitchen databases so your operational data can flow into the platform automatically.

We are constantly improving PrepIQ. Features may be added, changed, or removed over time, and not every feature is available on every subscription plan.

## 5. Creating and Registering an Account

To use most of the Service, you need to register for an account. When you register, you agree to:

- Provide accurate, current, and complete information about yourself and your business.
- Keep that information up to date if it changes.
- Keep your login credentials confidential and not share them with anyone outside your organization.
- Notify us promptly if you suspect any unauthorized use of your account.

You are responsible for all activity that takes place under your account, including activity by team members you add.

## 6. Your Responsibilities as a Customer

When you use PrepIQ, you agree to:

- Provide data that is accurate to the best of your knowledge — forecasts and recommendations are only as good as the data behind them.
- Keep your account credentials, API keys, and connector configuration secure.
- Comply with all laws and regulations that apply to your business, including food safety, labor, and tax regulations.
- Not misuse the platform — for example, by attempting to access data that doesn't belong to you or interfering with other customers' use of the Service.
- Maintain appropriate access permissions for any POS system or database that you connect to PrepIQ, and ensure you are authorized to grant PrepIQ (and the PIQ Connector) access to that data.

## 7. AI-Generated Recommendations Are Not a Substitute for Your Judgment

This is important, so we want to be direct about it:

> PrepIQ provides operational recommendations — forecasts, prep quantities, purchasing suggestions, and similar outputs — based on the data available to us at the time. These recommendations are advisory only. Final decisions about production, purchasing, staffing, pricing, and food safety remain entirely your responsibility as the operator of your business.

You should always apply your own professional judgment, and that of your kitchen team, before acting on any recommendation from PrepIQ. We are not liable for business outcomes that result from decisions made using our recommendations.

## 8. Free Trial

We may offer new customers a free trial period, typically 30 days, so you can evaluate the Service before committing to a paid subscription. During the trial:

- You will have access to the features included in the trial plan.
- You will not be charged unless and until you choose to subscribe.
- You may cancel at any time during the trial without any obligation.

If you do not cancel before the trial ends, your account may convert to a paid subscription in accordance with the plan you selected when you signed up, and billing will begin at that point.

## 9. Subscription, Billing & Payments

Paid plans are billed in advance on a recurring basis (monthly or annually, depending on the plan you choose). Payments are processed securely through our third-party payment processor, Flutterwave — PrepIQ does not store your full card details.

- **Renewals.** Subscriptions renew automatically at the end of each billing period unless you cancel before the renewal date.
- **Invoices.** You will receive an invoice or receipt for each successful payment.
- **Refunds.** Fees are generally non-refundable, except where required by applicable law or explicitly stated otherwise.
- **Failed or late payments.** If a payment fails, we will attempt to notify you and may retry the charge. If payment issues are not resolved within a reasonable period, we may suspend or limit your access to the Service until the account is brought current.
- **Cancellation.** You can cancel your subscription at any time through your account settings or by contacting us. Cancellation takes effect at the end of your current billing period; we do not provide prorated refunds for partial periods unless required by law.
- **Price changes.** We may change our pricing from time to time. If a price change affects your existing subscription, we will give you at least 30 days' written notice before it takes effect.

## 10. Service Availability

We work hard to keep PrepIQ available and reliable, but the Service is provided without a guaranteed uptime commitment unless you have a separate Enterprise agreement that states otherwise. From time to time, we may perform scheduled maintenance that temporarily affects availability; where practical, we will try to schedule this during low-usage periods and give advance notice.

## 11. Acceptable Use

You agree not to:

- Use the Service for any unlawful purpose or in a way that violates any applicable law or regulation.
- Attempt to gain unauthorized access to any part of the Service, other customers' data, or our underlying systems.
- Reverse-engineer, decompile, or disassemble any part of the Service, including the PIQ Connector.
- Interfere with, disrupt, or place undue load on the Service or the infrastructure it runs on.
- Transmit viruses, malware, or other harmful code through the Service.
- Use the Service to build a competing product or to resell access to the Service without our written permission.

We reserve the right to suspend or terminate accounts that violate this section.

## 12. Intellectual Property

**What PrepIQ owns.** The Service — including our software, forecasting models, machine learning systems, visual design, and the PrepIQ name and brand — is owned by PrepIQ and protected by copyright, trademark, trade secret, and other intellectual property laws. Nothing in these Terms grants you any ownership rights in the Service itself. You may not use our trademarks or branding without our prior written permission.

**What you own.** You retain full ownership of your business data — your sales records, recipes, menus, inventory data, and any documents you upload to PrepIQ. We explain exactly how we use that data in Section 13 and in our Privacy Policy.

## 13. Data Ownership

We want to be unambiguous about this: **your restaurant always owns its operational data.** This includes your sales history, inventory records, recipes, menus, forecasts generated for you, and any other business data associated with your account.

PrepIQ processes this data solely to provide, maintain, and improve the Service for you. We do not claim ownership over your business data, and we do not use one customer's confidential business data to train models or generate insights for another customer (see Section 15, AI Transparency & Forecast Learning).

## 14. The PIQ Connector

Many customers connect their point-of-sale system or in-kitchen database to PrepIQ using the PIQ Connector, a small piece of software that runs alongside your existing systems. When you install and configure the PIQ Connector, you agree that:

- The Connector accesses only the databases and tables you specifically configure it to access — nothing more.
- The Connector reads only the operational data required to power forecasting, planning, and reporting (for example, sales transactions, menu items, and inventory levels).
- The Connector never writes to, modifies, or deletes data in your POS system or database. It is strictly read-only with respect to your source systems.
- All communication between the Connector and PrepIQ's servers is encrypted.
- The Connector may check for and install software updates automatically to keep it secure and compatible with your systems; updates are digitally signed to verify their authenticity.

You are responsible for ensuring that you have the necessary rights and permissions to grant the PIQ Connector access to the systems you connect it to.

## 15. AI Transparency & Forecast Learning

PrepIQ's forecasts and recommendations are generated using artificial intelligence and machine learning models. To help you understand how this works:

- AI recommendations are generated from your historical operational data, business rules you've configured, and relevant external signals (such as weather and local events). They are advisory, and you remain in control of final decisions (see Section 7).
- PrepIQ continuously improves forecasting accuracy by learning from outcomes within *your* environment — your historical sales, approved production plans, any manual overrides your team makes, recorded waste, and stockouts.
- We do not use your confidential business data to train models for, or generate recommendations for, any other customer. Each organization's data and forecasts are logically isolated from every other organization on the platform.

## 16. Operational Notifications

To help you run your kitchen in real time, PrepIQ sends operational notifications, including stockout risk warnings, planning reminders, production alerts, connector health/connectivity status, and other system events. You can manage which notifications you receive, and how (in-app, push, or email), in your account settings.

## 17. Limitation of Liability

To the fullest extent permitted by applicable law, PrepIQ and its officers, employees, and affiliates will not be liable for any indirect, incidental, special, consequential, or punitive damages, or for any loss of profits, revenue, data, or business opportunity, arising out of or related to your use of the Service — even if we have been advised of the possibility of such damages.

Our total aggregate liability for any claim arising out of or relating to these Terms or the Service will not exceed the total amount you paid to PrepIQ in the twelve (12) months immediately preceding the event giving rise to the claim.

Nothing in these Terms limits liability that cannot be limited under applicable law.

## 18. Disclaimer of Warranties

The Service is provided "as is" and "as available," without warranties of any kind, whether express or implied, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the Service will be uninterrupted, error-free, or completely secure.

As noted in Section 7, forecasts and recommendations produced by the Service are estimates based on available data. They should inform — not replace — your own operational, food safety, and business judgment.

## 19. Termination

Either you or PrepIQ may terminate these Terms and your access to the Service:

- **You** may cancel your account at any time, as described in Section 9.
- **We** may suspend or terminate your account if you materially breach these Terms, fail to pay applicable fees, or if we reasonably believe your use of the Service poses a risk to PrepIQ, other customers, or the security of the platform. Where practical, we will provide notice before termination.

When your account is terminated, your right to access the Service ends immediately. You may request an export of your business data within 30 days of termination by contacting us at customer@prepiq.net; after that period, your data will be handled in accordance with the data retention practices described in our Privacy Policy.

## 20. Governing Law

These Terms are governed by the laws of the State of California, United States, without regard to its conflict-of-law principles, without prejudice to any mandatory consumer- or data-protection rights you may have under the laws of Uganda or your own country of residence. Any dispute arising out of or relating to these Terms will be resolved exclusively in the courts located in San Francisco County, California, unless applicable local law requires otherwise.

## 21. Changes to These Terms

We may update these Terms from time to time to reflect changes in our Service, legal requirements, or business practices. If we make material changes, we will give you at least 30 days' notice before they take effect, either through the Service or by email. Your continued use of the Service after the effective date of updated Terms means you accept the changes.

## 22. Contact Us

If you have questions about these Terms, please reach out — we're happy to explain anything in plain language.

Email: [customer@prepiq.net](mailto:customer@prepiq.net)
Mail: PrepIQ, Kampala, Uganda
`;

const TERMS_FR = `## 1. Introduction

Bienvenue chez PrepIQ. PrepIQ est une plateforme d'intelligence de cuisine conçue pour les restaurants, cafés, traiteurs et autres établissements de restauration. Nous vous aidons à prévoir la demande, planifier la production, gérer votre inventaire et faire fonctionner une cuisine plus prévisible — en nous appuyant sur votre historique de ventes, vos intégrations de caisse (POS) et l'intelligence artificielle.

PrepIQ est exploité par PrepIQ, une société basée à Kampala, en Ouganda (« PrepIQ », « nous », « notre »). Les présentes Conditions d'utilisation (« Conditions ») régissent votre accès et votre utilisation du site web PrepIQ, des applications mobiles, du tableau de bord, des API, du logiciel PIQ Connector et de l'ensemble des services associés (collectivement, le « Service »).

Le Service est destiné à un usage professionnel par des restaurants et autres exploitants de restauration. Il n'est pas destiné à un usage personnel, domestique ou de consommateur.

## 2. Éligibilité

Pour utiliser le Service, vous devez :

- Avoir au moins 18 ans et être légalement capable de conclure un contrat contraignant en votre nom ou au nom de l'entreprise que vous représentez.
- Utiliser le Service dans le cadre d'une activité professionnelle légitime — PrepIQ est conçu pour les restaurants, cafés, traiteurs et établissements similaires, et non pour un usage personnel.
- Être responsable de la sécurité de vos identifiants de connexion et de tout ce qui se produit sous votre compte, y compris les actions des employés ou prestataires que vous invitez.

Si vous créez un compte au nom d'une entreprise ou d'une organisation, vous confirmez disposer de l'autorité nécessaire pour engager cette organisation dans le cadre des présentes Conditions.

## 3. Acceptation des Conditions

En créant un compte, en accédant au Service ou en l'utilisant de quelque manière que ce soit, vous acceptez d'être lié par les présentes Conditions ainsi que par notre Politique de confidentialité, qui y est intégrée par référence. Si vous n'acceptez pas ces Conditions, vous ne devez pas accéder au Service ni l'utiliser.

## 4. Les Services que nous fournissons

PrepIQ propose un ensemble d'outils en constante évolution, conçus pour rendre la gestion d'une cuisine plus prévisible, notamment :

- **La prévision de la demande** — anticiper les quantités de chaque plat que vous êtes susceptible de vendre, en s'appuyant sur votre historique de ventes, la saisonnalité, la météo, les événements locaux et d'autres signaux.
- **La planification de la production et de la mise en place** — transformer les prévisions en listes de préparation concrètes et en plans de production pour votre équipe.
- **La gestion des stocks** — suivre les niveaux de stock, la consommation et le gaspillage, afin d'éviter à la fois les ruptures et le surstockage.
- **Les notifications et alertes** — alertes opérationnelles telles que les risques de rupture, les rappels de planification, les alertes de production et l'état de santé du connecteur, envoyées dans l'application, par notification push ou par email.
- **L'Assistant PrepIQ** — un assistant conversationnel basé sur l'IA capable de répondre à des questions opérationnelles et de vous aider à interpréter vos données.
- **Les rapports et analyses** — tableaux de bord et rapports résumant vos ventes, votre gaspillage et la précision de vos prévisions au fil du temps.
- **Le PIQ Connector** — un logiciel qui relie PrepIQ à votre système de caisse (POS) ou à d'autres bases de données de cuisine, afin que vos données opérationnelles alimentent automatiquement la plateforme.

Nous améliorons continuellement PrepIQ. Des fonctionnalités peuvent être ajoutées, modifiées ou supprimées au fil du temps, et toutes ne sont pas nécessairement disponibles sur chaque formule d'abonnement.

## 5. Création et inscription de compte

Pour utiliser la plupart des fonctionnalités du Service, vous devez créer un compte. Lors de votre inscription, vous vous engagez à :

- Fournir des informations exactes, à jour et complètes vous concernant ainsi que votre entreprise.
- Maintenir ces informations à jour en cas de changement.
- Garder vos identifiants de connexion confidentiels et ne pas les partager en dehors de votre organisation.
- Nous informer rapidement si vous soupçonnez une utilisation non autorisée de votre compte.

Vous êtes responsable de toute activité ayant lieu sous votre compte, y compris celle des membres de votre équipe que vous ajoutez.

## 6. Vos responsabilités en tant que client

En utilisant PrepIQ, vous vous engagez à :

- Fournir des données aussi exactes que possible — les prévisions et recommandations ne valent que ce que valent les données sur lesquelles elles reposent.
- Garder vos identifiants de compte, clés API et configuration du connecteur en sécurité.
- Respecter l'ensemble des lois et réglementations applicables à votre activité, y compris en matière de sécurité alimentaire, de droit du travail et de fiscalité.
- Ne pas détourner l'usage de la plateforme — par exemple en tentant d'accéder à des données qui ne vous appartiennent pas ou en perturbant l'utilisation du Service par d'autres clients.
- Maintenir des autorisations d'accès appropriées pour tout système de caisse ou base de données que vous connectez à PrepIQ, et vous assurer que vous êtes habilité à donner à PrepIQ (et au PIQ Connector) accès à ces données.

## 7. Les recommandations générées par IA ne remplacent pas votre jugement

Ce point est important, et nous tenons à être directs :

> PrepIQ fournit des recommandations opérationnelles — prévisions, quantités de mise en place, suggestions d'achats et résultats similaires — sur la base des données disponibles au moment considéré. Ces recommandations sont fournies à titre indicatif uniquement. Les décisions finales relatives à la production, aux achats, à la gestion du personnel, à la tarification et à la sécurité alimentaire relèvent entièrement de votre responsabilité en tant qu'exploitant de votre entreprise.

Vous devez toujours faire appel à votre propre jugement professionnel, ainsi qu'à celui de votre équipe en cuisine, avant d'agir sur la base d'une recommandation de PrepIQ. Nous ne saurions être tenus responsables des conséquences commerciales résultant de décisions prises à partir de nos recommandations.

## 8. Essai gratuit

Nous pouvons proposer aux nouveaux clients une période d'essai gratuite, généralement de 30 jours, afin que vous puissiez évaluer le Service avant de vous engager sur un abonnement payant. Pendant l'essai :

- Vous avez accès aux fonctionnalités incluses dans la formule d'essai.
- Vous n'êtes pas facturé, sauf si vous choisissez de vous abonner.
- Vous pouvez résilier à tout moment pendant l'essai, sans aucune obligation.

Si vous n'annulez pas avant la fin de l'essai, votre compte peut être converti en abonnement payant conformément à la formule choisie lors de votre inscription, et la facturation débutera à ce moment-là.

## 9. Abonnement, facturation et paiements

Les formules payantes sont facturées à l'avance, de façon récurrente (mensuelle ou annuelle selon la formule choisie). Les paiements sont traités de manière sécurisée par notre prestataire de paiement tiers, Flutterwave — PrepIQ ne stocke jamais l'intégralité de vos coordonnées bancaires.

- **Renouvellements.** Les abonnements se renouvellent automatiquement à la fin de chaque période de facturation, sauf annulation avant la date de renouvellement.
- **Factures.** Vous recevez une facture ou un reçu pour chaque paiement effectué avec succès.
- **Remboursements.** Les frais ne sont généralement pas remboursables, sauf obligation légale applicable ou mention contraire explicite.
- **Paiements en échec ou en retard.** En cas d'échec de paiement, nous tentons de vous en informer et pouvons réessayer le prélèvement. Si le problème n'est pas résolu dans un délai raisonnable, nous pouvons suspendre ou limiter votre accès au Service jusqu'à régularisation.
- **Résiliation.** Vous pouvez résilier votre abonnement à tout moment depuis les paramètres de votre compte ou en nous contactant. La résiliation prend effet à la fin de la période de facturation en cours ; nous ne remboursons pas au prorata les périodes partielles, sauf obligation légale contraire.
- **Modification des tarifs.** Nous pouvons modifier nos tarifs de temps à autre. Si une modification tarifaire affecte votre abonnement en cours, nous vous en informerons par écrit au moins 30 jours avant son entrée en vigueur.

## 10. Disponibilité du Service

Nous mettons tout en œuvre pour garantir la disponibilité et la fiabilité de PrepIQ, mais le Service est fourni sans engagement de disponibilité garanti, sauf accord Entreprise distinct stipulant le contraire. Nous pouvons ponctuellement effectuer des opérations de maintenance planifiée affectant temporairement la disponibilité ; dans la mesure du possible, nous les programmons pendant les périodes de faible utilisation et vous en informons à l'avance.

## 11. Usage acceptable

Vous acceptez de ne pas :

- Utiliser le Service à des fins illégales ou en violation d'une loi ou réglementation applicable.
- Tenter d'accéder sans autorisation à une partie du Service, aux données d'autres clients ou à nos systèmes internes.
- Pratiquer l'ingénierie inverse, décompiler ou désassembler toute partie du Service, y compris le PIQ Connector.
- Perturber, interrompre ou surcharger indûment le Service ou l'infrastructure sur laquelle il repose.
- Transmettre des virus, logiciels malveillants ou tout autre code nuisible via le Service.
- Utiliser le Service pour développer un produit concurrent ou revendre l'accès au Service sans notre autorisation écrite.

Nous nous réservons le droit de suspendre ou de résilier tout compte enfreignant cette section.

## 12. Propriété intellectuelle

**Ce que PrepIQ possède.** Le Service — y compris nos logiciels, modèles de prévision, systèmes d'apprentissage automatique, design visuel, ainsi que le nom et la marque PrepIQ — est la propriété de PrepIQ et protégé par le droit d'auteur, le droit des marques, le secret des affaires et d'autres lois relatives à la propriété intellectuelle. Rien dans les présentes Conditions ne vous confère de droits de propriété sur le Service lui-même. Vous ne pouvez pas utiliser nos marques ou éléments de marque sans notre autorisation écrite préalable.

**Ce que vous possédez.** Vous conservez l'entière propriété de vos données commerciales — vos historiques de ventes, recettes, menus, données d'inventaire et tout document que vous importez dans PrepIQ. La Section 13 et notre Politique de confidentialité détaillent précisément l'usage que nous en faisons.

## 13. Propriété des données

Nous tenons à être parfaitement clairs sur ce point : **votre restaurant reste toujours propriétaire de ses données opérationnelles.** Cela inclut votre historique de ventes, vos données d'inventaire, vos recettes, vos menus, les prévisions générées pour vous, ainsi que toute autre donnée commerciale associée à votre compte.

PrepIQ traite ces données uniquement pour fournir, maintenir et améliorer le Service à votre attention. Nous ne revendiquons aucune propriété sur vos données commerciales, et nous n'utilisons pas les données confidentielles d'un client pour entraîner nos modèles ou générer des analyses destinées à un autre client (voir Section 15, Transparence de l'IA et apprentissage des prévisions).

## 14. Le PIQ Connector

De nombreux clients connectent leur système de caisse ou leur base de données de cuisine à PrepIQ via le PIQ Connector, un petit logiciel qui fonctionne aux côtés de vos systèmes existants. En installant et configurant le PIQ Connector, vous acceptez que :

- Le Connector n'accède qu'aux bases de données et tables que vous configurez spécifiquement — rien de plus.
- Le Connector ne lit que les données opérationnelles nécessaires à la prévision, à la planification et aux rapports (par exemple, les transactions de vente, les articles de menu et les niveaux de stock).
- Le Connector n'écrit, ne modifie ni ne supprime jamais de données dans votre système de caisse ou votre base de données. Il est strictement en lecture seule vis-à-vis de vos systèmes sources.
- Toute communication entre le Connector et les serveurs de PrepIQ est chiffrée.
- Le Connector peut vérifier et installer automatiquement des mises à jour afin de rester sécurisé et compatible avec vos systèmes ; ces mises à jour sont signées numériquement pour garantir leur authenticité.

Vous êtes responsable de vous assurer que vous disposez des droits et autorisations nécessaires pour accorder au PIQ Connector l'accès aux systèmes auxquels vous le connectez.

## 15. Transparence de l'IA et apprentissage des prévisions

Les prévisions et recommandations de PrepIQ sont générées grâce à l'intelligence artificielle et à des modèles d'apprentissage automatique. Pour vous permettre de mieux comprendre leur fonctionnement :

- Les recommandations de l'IA sont générées à partir de vos données opérationnelles historiques, des règles métier que vous avez configurées, et de signaux externes pertinents (comme la météo ou les événements locaux). Elles sont fournies à titre indicatif, la décision finale vous revenant (voir Section 7).
- PrepIQ améliore continuellement la précision de ses prévisions en apprenant des résultats observés au sein de *votre* environnement — votre historique de ventes, vos plans de production validés, les ajustements manuels effectués par votre équipe, le gaspillage enregistré et les ruptures de stock.
- Nous n'utilisons jamais les données commerciales confidentielles d'un client pour entraîner des modèles ou générer des recommandations destinées à un autre client. Les données et prévisions de chaque organisation sont isolées logiquement de celles de toutes les autres organisations présentes sur la plateforme.

## 16. Notifications opérationnelles

Pour vous aider à piloter votre cuisine en temps réel, PrepIQ envoie des notifications opérationnelles, notamment des alertes de risque de rupture, des rappels de planification, des alertes de production, l'état de connectivité du connecteur, ainsi que d'autres événements système. Vous pouvez gérer les notifications que vous recevez, et leur mode de diffusion (dans l'application, par notification push ou par email), depuis les paramètres de votre compte.

## 17. Limitation de responsabilité

Dans toute la mesure permise par la loi applicable, PrepIQ, ses dirigeants, employés et sociétés affiliées ne pourront être tenus responsables de tout dommage indirect, accessoire, spécial, consécutif ou punitif, ni de toute perte de profits, de revenus, de données ou d'opportunités commerciales, découlant de ou lié à votre utilisation du Service — même si nous avons été informés de la possibilité de tels dommages.

Notre responsabilité totale et cumulée pour toute réclamation découlant des présentes Conditions ou du Service ne pourra excéder le montant total que vous avez versé à PrepIQ au cours des douze (12) mois précédant l'événement à l'origine de la réclamation.

Rien dans les présentes Conditions ne limite une responsabilité qui ne peut être limitée en vertu de la loi applicable.

## 18. Clause de non-garantie

Le Service est fourni « en l'état » et « selon disponibilité », sans garantie d'aucune sorte, expresse ou implicite, y compris les garanties implicites de qualité marchande, d'adéquation à un usage particulier et de non-contrefaçon. Nous ne garantissons pas que le Service sera ininterrompu, exempt d'erreurs ou totalement sécurisé.

Comme indiqué à la Section 7, les prévisions et recommandations produites par le Service sont des estimations fondées sur les données disponibles. Elles doivent éclairer — et non remplacer — votre propre jugement opérationnel, sanitaire et commercial.

## 19. Résiliation

Vous ou PrepIQ pouvez mettre fin aux présentes Conditions et à votre accès au Service :

- **Vous** pouvez résilier votre compte à tout moment, comme indiqué à la Section 9.
- **Nous** pouvons suspendre ou résilier votre compte en cas de violation substantielle des présentes Conditions, de défaut de paiement des frais applicables, ou si nous estimons raisonnablement que votre utilisation du Service présente un risque pour PrepIQ, d'autres clients ou la sécurité de la plateforme. Dans la mesure du possible, nous vous en informerons avant la résiliation.

Lorsque votre compte est résilié, votre droit d'accès au Service cesse immédiatement. Vous pouvez demander l'export de vos données commerciales dans les 30 jours suivant la résiliation en nous contactant à customer@prepiq.net ; passé ce délai, vos données seront traitées conformément aux pratiques de conservation décrites dans notre Politique de confidentialité.

## 20. Droit applicable

Les présentes Conditions sont régies par les lois de l'État de Californie, aux États-Unis, sans égard aux principes de conflits de lois, et sans préjudice des droits impératifs de protection des consommateurs ou des données dont vous pourriez bénéficier en vertu des lois de l'Ouganda ou de votre pays de résidence. Tout litige découlant des présentes Conditions sera soumis exclusivement aux tribunaux du comté de San Francisco, en Californie, sauf disposition locale impérative contraire.

## 21. Modifications des présentes Conditions

Nous pouvons modifier les présentes Conditions de temps à autre afin de refléter des évolutions de notre Service, des exigences légales ou de nos pratiques commerciales. En cas de modification substantielle, nous vous en informerons au moins 30 jours avant son entrée en vigueur, via le Service ou par email. La poursuite de votre utilisation du Service après l'entrée en vigueur des Conditions modifiées vaut acceptation de ces modifications.

## 22. Contactez-nous

Des questions sur ces Conditions ? N'hésitez pas à nous contacter — nous serons heureux de vous répondre en toute clarté.

Email : [customer@prepiq.net](mailto:customer@prepiq.net)
Adresse : PrepIQ, Kampala, Ouganda
`;

const PRIVACY_EN = `## 1. Introduction

This Privacy Policy explains how PrepIQ ("we," "us," or "our") collects, uses, shares, and protects information when you use our website, mobile apps, dashboard, and related services (together, the "Service"). We wrote it in plain language on purpose — your trust matters more to us than legal jargon.

PrepIQ is operated by PrepIQ, based in Kampala, Uganda. By using the Service, you acknowledge that you have read and understood this Privacy Policy. If you have questions at any point, contact us at [customer@prepiq.net](mailto:customer@prepiq.net).

## 2. Information We Collect

We collect only the information we need to run the Service well. This includes:

- **Account information** — your name, email address, phone number, job title, and the organization and branch(es) you belong to.
- **Operational data** — the data that powers PrepIQ's forecasts and recommendations, such as sales history, inventory levels, waste records, menu items, recipes, and the forecasts and prep plans we generate for you.
- **Notification data** — records of the notifications we send you (for example, stockout alerts or planning reminders) so we can manage delivery and let you review your history.
- **Device and technical information** — browser type, operating system, IP address, device identifiers, and similar technical details, collected automatically when you use our website or apps.
- **App logs and crash reports** — technical logs that help us diagnose problems and keep the Service stable.
- **Connector diagnostics** — status and health information from the PIQ Connector (for example, whether it's connected and syncing), which we use to alert you to connectivity issues. The Connector does not send us the contents of your POS database beyond the operational data described above.
- **Communications** — messages you send us through support requests, contact forms, or feedback tools, along with any files you choose to attach.

## 3. Information We Do Not Collect

We're equally clear about what we deliberately avoid collecting:

- **Full payment card numbers.** Payments are handled by our payment processor, Flutterwave — PrepIQ never sees or stores your complete card number.
- **Passwords in plain text.** Your password is never stored in a readable form; it is hashed using industry-standard cryptographic methods.
- **Personal photos or your phone's photo library**, unless you explicitly choose to upload an image (for example, a profile picture or a support attachment).
- **Your personal contacts.**
- **Your location**, unless you explicitly grant location permission for a feature that requires it — and even then, only while that feature is in use.

## 4. Why We Collect Information

We collect and use information to:

- Generate accurate demand forecasts and operational recommendations.
- Build prep plans, purchasing suggestions, and reports.
- Continuously improve our machine learning models within your own environment.
- Authenticate you and keep your account secure.
- Send you operational notifications and important service communications.
- Provide customer support and respond to your requests.
- Maintain the security, integrity, and reliability of the Service.

## 5. How We Use Your Information

**To operate the Service** — create forecasts, generate prep plans and purchasing recommendations, manage your account and subscription, and process payments.

**To improve the platform** — understand how customers use PrepIQ, improve performance and reliability, and develop new features.

**To communicate with you** — respond to support requests, send service and security notifications, and share relevant product updates.

## 6. Data Sharing & Disclosure

We do not sell, rent, or trade your personal information or your business's operational data — ever. We do not use one customer's confidential business data to generate forecasts or insights for another customer. We share information only in the following limited circumstances:

- **Service providers who help us run PrepIQ**, including:
  - **Flutterwave**, for secure payment processing.
  - **Firebase**, for push notifications to the mobile app.
  - **Cloudinary**, for secure hosting of images and file attachments (for example, support request attachments).
  - Our **cloud hosting provider**, which runs our servers and databases.
  - Our **email delivery provider**, for account and transactional emails such as password resets and verification codes.

  Each of these providers is contractually required to protect your data and may only use it to provide services to us — never for their own purposes.
- **Legal compliance** — we may disclose information if required by law, regulation, court order, or other valid legal process, or where necessary to protect the rights, safety, or security of PrepIQ, our customers, or others.
- **Business transfers** — if PrepIQ is involved in a merger, acquisition, financing, or sale of all or part of its business, your information may be transferred as part of that transaction. We will notify affected customers where required by law.
- **With your consent** — we may share information with third parties when you specifically ask or authorize us to.

## 7. Data Security

We use administrative, technical, and organizational safeguards designed to protect your information against unauthorized access, disclosure, alteration, or destruction. No system can guarantee absolute security, but we work continuously to keep PrepIQ safe and reliable. Our security measures include:

- Encrypted communications using HTTPS/TLS.
- Encrypted storage for sensitive information.
- Role-based access controls, so team members only see what they need.
- Secure authentication mechanisms.
- Infrastructure monitoring and logging.
- Regular backups and tested recovery procedures.

For more detail, see our Security page.

## 8. Confidentiality

We recognize that the information you entrust to PrepIQ — sales figures, recipes, supplier relationships, and more — is often commercially sensitive. Access to customer data is limited to authorized personnel who need it to operate, maintain, or support the Service, or to meet legal obligations. Everyone with that access is required to keep it confidential.

## 9. AI Processing & Data Isolation

PrepIQ uses artificial intelligence to generate forecasts, recommendations, and operational insights from the information you provide. These outputs are meant to support your decisions, not replace your judgment (see our Terms of Service for more on this).

Every organization's data is **logically isolated** from every other organization on the platform. Restaurants cannot access or view another organization's information, and we do not use one customer's confidential business data to train models or generate recommendations for other customers.

## 10. Data Ownership

Your organization retains ownership of all business data you upload to PrepIQ — sales records, inventory information, recipes, menus, forecasts, and other operational data. We process this information solely to provide, maintain, and improve the Service, and we do not claim ownership of it. You can export your business data at any time using the tools available in the platform, or by contacting our support team.

## 11. Data Retention

We keep your information for as long as your account is active, or as long as we need it to provide the Service. When you delete your account:

- Your access to the Service is disabled immediately.
- Your personal information is deleted from our active systems within 30 days.
- Encrypted backup copies may remain in our backup systems for a limited additional period before they are automatically and permanently deleted.
- We may retain certain information longer where required by law, or for legitimate purposes such as fraud prevention, dispute resolution, or enforcing our agreements.
- We may retain anonymized, aggregated data indefinitely for analytics — this data can no longer be linked back to you or your business.

## 12. Your Rights

Depending on where you're located, you may have the right to:

- Access the personal information we hold about you.
- Correct inaccurate information.
- Delete your personal information.
- Export your data in a portable format.
- Restrict or object to certain kinds of processing.
- Withdraw consent, where our processing is based on your consent.
- Close your account entirely.

To exercise any of these rights, contact us at [customer@prepiq.net](mailto:customer@prepiq.net). We will respond to verified requests within a reasonable timeframe, as required by applicable law.

## 13. Cookies & Similar Technologies

Our website uses cookies and similar technologies to operate, secure, and improve the Service:

- **Essential cookies** are required for authentication, security, and core functionality — you can't opt out of these and still use the Service.
- **Analytics cookies** help us understand how customers use PrepIQ so we can improve performance and usability.
- **Preference cookies** remember choices like your language and interface settings.

You can control cookies through your browser settings, though disabling essential cookies may prevent parts of the Service from working properly.

## 14. Mobile App Permissions

If you use the PrepIQ mobile app, here's exactly what we access and why:

- **Account & sign-in.** The app requires you to sign in with a PrepIQ account to access any kitchen data — you cannot use the core features without authenticating.
- **Push notifications.** With your permission, we use notifications to deliver operational alerts (like stockout risk or production reminders), messages from your team through the Operations Hub, and important system updates. You can turn these off at any time in your device settings.
- **Storage access.** The app may access device storage when you choose to upload a file (for example, attaching a photo to a support request) or download a report.
- **Camera and photo library.** If you choose to attach a photo — for example, when reporting an issue — the app will ask for camera or photo library access at that moment. We only access these when you initiate that action.
- **Location.** We do not access your device's location unless a specific feature requires it and you have explicitly granted permission.

In every case, the information collected through these permissions is used only to provide the Service to you and to improve our forecasting and operations tools — never sold, and never used for advertising.

## 15. International Transfers

Your information may be processed in countries other than the one where you or your business are located. When this happens, we put appropriate safeguards in place — including contractual protections — to keep your information protected in line with applicable data protection laws.

## 16. Children's Privacy

PrepIQ is a business tool built for restaurant operators and their staff. It is not directed at, or intended for use by, individuals under the age of 16, and we do not knowingly collect personal information from children. If we learn that we've inadvertently collected information from a child, we will delete it promptly.

## 17. Changes to This Policy

We may update this Privacy Policy from time to time to reflect changes in our Service, legal requirements, or business practices. We'll update the "Last updated" date whenever we do. If a change materially affects your rights or how we handle your information, we'll let you know through the Service or by email before it takes effect. Continuing to use the Service after an update takes effect means you accept the revised policy.

## 18. Contact Us

Questions, concerns, or requests about this Privacy Policy or how we handle your data? We'd rather you ask than wonder.

Email: [customer@prepiq.net](mailto:customer@prepiq.net)
Mail: PrepIQ, Kampala, Uganda
`;

const PRIVACY_FR = `## 1. Introduction

Cette Politique de confidentialité explique comment PrepIQ (« nous », « notre ») collecte, utilise, partage et protège les informations lorsque vous utilisez notre site web, nos applications mobiles, notre tableau de bord et les services associés (collectivement, le « Service »). Nous l'avons volontairement rédigée dans un langage clair — votre confiance compte plus pour nous que le jargon juridique.

PrepIQ est exploité par PrepIQ, basé à Kampala, en Ouganda. En utilisant le Service, vous reconnaissez avoir lu et compris cette Politique de confidentialité. Pour toute question, contactez-nous à [customer@prepiq.net](mailto:customer@prepiq.net).

## 2. Informations que nous collectons

Nous ne collectons que les informations nécessaires au bon fonctionnement du Service, notamment :

- **Informations de compte** — votre nom, adresse email, numéro de téléphone, fonction, ainsi que l'organisation et la ou les succursales auxquelles vous appartenez.
- **Données opérationnelles** — les données qui alimentent les prévisions et recommandations de PrepIQ, telles que l'historique des ventes, les niveaux de stock, les données de gaspillage, les articles de menu, les recettes, ainsi que les prévisions et plans de préparation que nous générons pour vous.
- **Données de notification** — l'historique des notifications que nous vous envoyons (par exemple, alertes de rupture ou rappels de planification), afin de gérer leur diffusion et de vous permettre de consulter votre historique.
- **Informations techniques et sur l'appareil** — type de navigateur, système d'exploitation, adresse IP, identifiants d'appareil et informations techniques similaires, collectées automatiquement lors de l'utilisation de notre site ou de nos applications.
- **Journaux d'application et rapports de plantage** — journaux techniques qui nous aident à diagnostiquer les problèmes et à garantir la stabilité du Service.
- **Diagnostics du Connector** — informations d'état et de santé du PIQ Connector (par exemple, s'il est connecté et synchronisé), que nous utilisons pour vous alerter en cas de problème de connectivité. Le Connector ne nous transmet pas le contenu de votre base de données de caisse au-delà des données opérationnelles décrites ci-dessus.
- **Communications** — messages que vous nous envoyez via les demandes d'assistance, formulaires de contact ou outils de retour, ainsi que tout fichier que vous choisissez d'y joindre.

## 3. Informations que nous ne collectons pas

Nous sommes tout aussi clairs sur ce que nous évitons délibérément de collecter :

- **Les numéros complets de carte bancaire.** Les paiements sont traités par notre prestataire de paiement, Flutterwave — PrepIQ ne voit ni ne stocke jamais votre numéro de carte complet.
- **Les mots de passe en clair.** Votre mot de passe n'est jamais stocké sous une forme lisible ; il est haché selon des méthodes cryptographiques standards du secteur.
- **Vos photos personnelles ou la bibliothèque photo de votre téléphone**, sauf si vous choisissez explicitement d'importer une image (par exemple, une photo de profil ou une pièce jointe à une demande d'assistance).
- **Vos contacts personnels.**
- **Votre position géographique**, sauf si vous accordez explicitement l'autorisation pour une fonctionnalité qui le nécessite — et uniquement pendant l'utilisation de cette fonctionnalité.

## 4. Pourquoi nous collectons ces informations

Nous collectons et utilisons ces informations pour :

- Générer des prévisions de demande et des recommandations opérationnelles précises.
- Élaborer des plans de préparation, des suggestions d'achats et des rapports.
- Améliorer en continu nos modèles d'apprentissage automatique au sein de votre propre environnement.
- Vous authentifier et sécuriser votre compte.
- Vous envoyer des notifications opérationnelles et des communications importantes relatives au service.
- Fournir un support client et répondre à vos demandes.
- Assurer la sécurité, l'intégrité et la fiabilité du Service.

## 5. Utilisation de vos informations

**Pour exploiter le Service** — créer des prévisions, générer des plans de préparation et des recommandations d'achat, gérer votre compte et votre abonnement, et traiter les paiements.

**Pour améliorer la plateforme** — comprendre comment les clients utilisent PrepIQ, améliorer la performance et la fiabilité, et développer de nouvelles fonctionnalités.

**Pour communiquer avec vous** — répondre aux demandes d'assistance, envoyer des notifications de service et de sécurité, et partager des mises à jour produit pertinentes.

## 6. Partage et divulgation des données

Nous ne vendons, ne louons ni n'échangeons jamais vos informations personnelles ou les données opérationnelles de votre entreprise. Nous n'utilisons pas les données commerciales confidentielles d'un client pour générer des prévisions ou analyses destinées à un autre client. Nous ne partageons des informations que dans les cas limités suivants :

- **Des prestataires qui nous aident à exploiter PrepIQ**, notamment :
  - **Flutterwave**, pour le traitement sécurisé des paiements.
  - **Firebase**, pour les notifications push sur l'application mobile.
  - **Cloudinary**, pour l'hébergement sécurisé des images et pièces jointes (par exemple, les fichiers joints à une demande d'assistance).
  - Notre **hébergeur cloud**, qui fait fonctionner nos serveurs et bases de données.
  - Notre **prestataire d'envoi d'emails**, pour les emails transactionnels et de compte tels que les réinitialisations de mot de passe et les codes de vérification.

  Chacun de ces prestataires est contractuellement tenu de protéger vos données et ne peut les utiliser que pour nous fournir des services — jamais pour son propre compte.
- **Obligations légales** — nous pouvons divulguer des informations lorsque la loi, une réglementation, une décision de justice ou toute autre procédure légale valide l'exige, ou lorsque cela est nécessaire pour protéger les droits, la sécurité ou l'intégrité de PrepIQ, de nos clients ou de tiers.
- **Transferts d'entreprise** — en cas de fusion, acquisition, financement ou vente de tout ou partie de l'activité de PrepIQ, vos informations peuvent être transférées dans le cadre de cette opération. Nous informerons les clients concernés lorsque la loi l'exige.
- **Avec votre consentement** — nous pouvons partager des informations avec des tiers lorsque vous nous le demandez ou nous y autorisez spécifiquement.

## 7. Sécurité des données

Nous mettons en œuvre des mesures administratives, techniques et organisationnelles destinées à protéger vos informations contre tout accès non autorisé, divulgation, altération ou destruction. Aucun système ne peut garantir une sécurité absolue, mais nous œuvrons continuellement à la fiabilité et à la sécurité de PrepIQ. Nos mesures de sécurité comprennent :

- Des communications chiffrées via HTTPS/TLS.
- Un stockage chiffré des informations sensibles.
- Des contrôles d'accès basés sur les rôles, afin que chaque membre de l'équipe ne voie que ce dont il a besoin.
- Des mécanismes d'authentification sécurisés.
- Une surveillance et une journalisation de l'infrastructure.
- Des sauvegardes régulières et des procédures de récupération testées.

Pour plus de détails, consultez notre page Sécurité.

## 8. Confidentialité

Nous savons que les informations que vous confiez à PrepIQ — chiffres de ventes, recettes, relations fournisseurs, etc. — sont souvent commercialement sensibles. L'accès aux données clients est limité au personnel autorisé qui en a besoin pour exploiter, maintenir ou soutenir le Service, ou pour respecter des obligations légales. Toute personne disposant de cet accès est tenue d'en préserver la confidentialité.

## 9. Traitement par IA et isolation des données

PrepIQ utilise l'intelligence artificielle pour générer des prévisions, recommandations et analyses opérationnelles à partir des informations que vous fournissez. Ces résultats sont destinés à éclairer vos décisions, et non à remplacer votre jugement (voir nos Conditions d'utilisation pour plus de détails).

Les données de chaque organisation sont **isolées logiquement** de celles de toutes les autres organisations présentes sur la plateforme. Les restaurants ne peuvent ni accéder ni consulter les informations d'une autre organisation, et nous n'utilisons pas les données commerciales confidentielles d'un client pour entraîner des modèles ou générer des recommandations pour d'autres clients.

## 10. Propriété des données

Votre organisation conserve la propriété de toutes les données commerciales que vous importez dans PrepIQ — historiques de ventes, données d'inventaire, recettes, menus, prévisions et autres données opérationnelles. Nous traitons ces informations uniquement pour fournir, maintenir et améliorer le Service, et nous ne revendiquons aucune propriété sur celles-ci. Vous pouvez exporter vos données commerciales à tout moment via les outils disponibles sur la plateforme, ou en contactant notre équipe support.

## 11. Conservation des données

Nous conservons vos informations aussi longtemps que votre compte est actif, ou aussi longtemps que nécessaire pour fournir le Service. Lorsque vous supprimez votre compte :

- Votre accès au Service est immédiatement désactivé.
- Vos informations personnelles sont supprimées de nos systèmes actifs dans un délai de 30 jours.
- Des copies de sauvegarde chiffrées peuvent subsister temporairement dans nos systèmes de sauvegarde avant leur suppression automatique et définitive.
- Nous pouvons conserver certaines informations plus longtemps lorsque la loi l'exige, ou à des fins légitimes telles que la prévention de la fraude, la résolution de litiges ou l'application de nos accords.
- Nous pouvons conserver indéfiniment des données anonymisées et agrégées à des fins d'analyse — ces données ne peuvent plus être associées à vous ou à votre entreprise.

## 12. Vos droits

Selon votre lieu de résidence, vous pouvez disposer des droits suivants :

- Accéder aux informations personnelles que nous détenons à votre sujet.
- Corriger des informations inexactes.
- Supprimer vos informations personnelles.
- Exporter vos données dans un format portable.
- Limiter ou vous opposer à certains traitements.
- Retirer votre consentement, lorsque notre traitement repose sur celui-ci.
- Clôturer entièrement votre compte.

Pour exercer l'un de ces droits, contactez-nous à [customer@prepiq.net](mailto:customer@prepiq.net). Nous répondrons aux demandes vérifiées dans un délai raisonnable, conformément à la loi applicable.

## 13. Cookies et technologies similaires

Notre site utilise des cookies et technologies similaires pour faire fonctionner, sécuriser et améliorer le Service :

- Les **cookies essentiels** sont nécessaires à l'authentification, à la sécurité et aux fonctionnalités principales — vous ne pouvez pas les désactiver tout en continuant à utiliser le Service.
- Les **cookies analytiques** nous aident à comprendre comment les clients utilisent PrepIQ afin d'en améliorer la performance et l'ergonomie.
- Les **cookies de préférence** mémorisent vos choix, comme la langue et les paramètres d'interface.

Vous pouvez contrôler les cookies via les paramètres de votre navigateur, bien que la désactivation des cookies essentiels puisse empêcher certaines parties du Service de fonctionner correctement.

## 14. Autorisations de l'application mobile

Si vous utilisez l'application mobile PrepIQ, voici précisément ce à quoi nous accédons et pourquoi :

- **Compte et connexion.** L'application exige une connexion avec un compte PrepIQ pour accéder à toute donnée de cuisine — les fonctionnalités principales ne sont pas accessibles sans authentification.
- **Notifications push.** Avec votre autorisation, nous utilisons les notifications pour transmettre des alertes opérationnelles (comme les risques de rupture ou les rappels de production), des messages de votre équipe via l'Operations Hub, ainsi que des mises à jour système importantes. Vous pouvez les désactiver à tout moment dans les réglages de votre appareil.
- **Accès au stockage.** L'application peut accéder au stockage de l'appareil lorsque vous choisissez d'importer un fichier (par exemple, joindre une photo à une demande d'assistance) ou de télécharger un rapport.
- **Appareil photo et bibliothèque de photos.** Si vous choisissez de joindre une photo — par exemple lors du signalement d'un problème — l'application demandera l'accès à l'appareil photo ou à la bibliothèque de photos à ce moment précis. Nous n'y accédons que lorsque vous initiez cette action.
- **Localisation.** Nous n'accédons pas à la localisation de votre appareil, sauf si une fonctionnalité spécifique le nécessite et que vous avez explicitement accordé cette autorisation.

Dans tous les cas, les informations collectées via ces autorisations ne servent qu'à vous fournir le Service et à améliorer nos outils de prévision et d'exploitation — jamais vendues, jamais utilisées à des fins publicitaires.

## 15. Transferts internationaux

Vos informations peuvent être traitées dans des pays autres que celui où vous ou votre entreprise êtes situés. Le cas échéant, nous mettons en place des garanties appropriées — y compris des protections contractuelles — afin de préserver la protection de vos informations conformément aux lois applicables en matière de protection des données.

## 16. Confidentialité des enfants

PrepIQ est un outil professionnel conçu pour les exploitants de restaurants et leur personnel. Il n'est ni destiné ni conçu pour être utilisé par des personnes de moins de 16 ans, et nous ne collectons pas sciemment d'informations personnelles auprès d'enfants. Si nous apprenons avoir collecté par inadvertance des informations concernant un enfant, nous les supprimerons rapidement.

## 17. Modifications de cette politique

Nous pouvons modifier cette Politique de confidentialité de temps à autre afin de refléter des évolutions de notre Service, des exigences légales ou de nos pratiques commerciales. La date de « dernière mise à jour » sera actualisée à chaque modification. Si un changement affecte substantiellement vos droits ou notre traitement de vos informations, nous vous en informerons via le Service ou par email avant son entrée en vigueur. La poursuite de l'utilisation du Service après l'entrée en vigueur d'une mise à jour vaut acceptation de la politique révisée.

## 18. Contactez-nous

Des questions, préoccupations ou demandes concernant cette Politique de confidentialité ou la manière dont nous traitons vos données ? Mieux vaut nous les poser que les garder pour vous.

Email : [customer@prepiq.net](mailto:customer@prepiq.net)
Adresse : PrepIQ, Kampala, Ouganda
`;

const SECURITY_EN = `Your kitchen data is the backbone of your operations, and we treat it with the same care you put into every dish that leaves your kitchen — protected at every layer, monitored continuously, and never sold to anyone.

## Infrastructure

PrepIQ runs on reputable, industry-standard cloud infrastructure with encrypted storage, redundant systems, and automated backups. Our hosting providers maintain recognized security certifications and follow industry best practices for physical and network security.

## Authentication & Access Control

- Passwords are never stored in plain text — they are hashed using industry-standard cryptography.
- We use JSON Web Tokens (JWT) for secure, short-lived authentication sessions, with automatic refresh and expiration.
- Role-based access control (RBAC) ensures each team member only sees the data and features relevant to their role.
- Inactive sessions expire automatically.
- Multi-factor authentication (MFA) is on our roadmap for all accounts.

## Data Protection

- All data in transit is encrypted using TLS.
- Sensitive data at rest is encrypted.
- Database connections use SSL/TLS.
- API secrets and credentials are stored using dedicated secrets-management tooling — never hardcoded or committed to source code.

## Connector Security

The PIQ Connector deserves its own explanation, because it's the piece of software closest to your POS and kitchen systems:

- It accesses only the specific databases and tables you configure it to access — nothing more.
- All communication between the Connector and PrepIQ is encrypted over HTTPS.
- It authenticates using a unique, revocable API key issued to your organization.
- It updates automatically to patch security issues and stay compatible with your systems, and every release is digitally signed so you can trust its authenticity.
- It has no ability to remotely control, modify, or delete data in your source systems — it is strictly read-only.

## AI & Forecasting Security

- Your operational data is isolated at the database level — other organizations cannot access, view, or influence your forecasts.
- Cross-tenant access is architecturally impossible, not just a policy — our data model enforces separation between organizations.
- Our machine learning models are trained and applied within the boundaries of your own organization's data; they do not leak or expose one customer's information to another.

## Monitoring, Logging & Alerting

We continuously monitor our systems for unusual activity, log access events for auditing, and alert our team automatically when something looks wrong, so we can investigate and respond quickly.

## Disaster Recovery

- Backups run automatically and regularly.
- Backup and recovery procedures are tested periodically to confirm they actually work.
- Data is stored redundantly to reduce the risk of loss from a single point of failure.

## Incident Response

We maintain an incident response process with defined escalation paths, so that if something does go wrong, we can act quickly and communicate clearly. In the unlikely event of a security incident affecting your data, we will notify affected customers within 72 hours in accordance with applicable regulations, and we conduct a post-incident review afterward to prevent recurrence.

## Compliance & Best Practices

We build PrepIQ with data protection regulations such as the GDPR and CCPA in mind, and we align our practices with recognized industry security frameworks. Our infrastructure partners maintain independently audited certifications, such as SOC 2 Type II, that we rely on as part of our overall security posture.

## Vendor Security

Every third-party service we rely on — including our payment processor, notification provider, and file storage provider — goes through a security review before we integrate it, and we keep the number of vendors with access to customer data as small as possible. We periodically review vendor access permissions and data sharing agreements.

## Secure Development Lifecycle

Every code change goes through automated security scanning, peer review, and staging validation before it reaches production. We periodically review our systems for vulnerabilities and prioritize fixes based on risk.

## Responsible Disclosure

If you discover a security vulnerability in PrepIQ, we want to know about it. Please report it to [security@prepiq.net](mailto:security@prepiq.net) with as much detail as you can provide. We will acknowledge your report within 24 hours, investigate promptly, and keep you updated on our progress. We will not pursue legal action against security researchers who act in good faith, report responsibly, and avoid accessing or modifying data that isn't theirs.
`;

const SECURITY_FR = `Les données de votre cuisine sont le socle de vos opérations, et nous les traitons avec le même soin que celui que vous apportez à chaque plat qui sort de votre cuisine — protégées à chaque niveau, surveillées en continu, et jamais revendues à qui que ce soit.

## Infrastructure

PrepIQ fonctionne sur une infrastructure cloud reconnue et conforme aux standards du secteur, avec stockage chiffré, systèmes redondants et sauvegardes automatisées. Nos hébergeurs disposent de certifications de sécurité reconnues et appliquent les meilleures pratiques du secteur en matière de sécurité physique et réseau.

## Authentification et contrôle d'accès

- Les mots de passe ne sont jamais stockés en clair — ils sont hachés selon des méthodes cryptographiques standards du secteur.
- Nous utilisons des jetons JWT (JSON Web Tokens) pour des sessions d'authentification sécurisées et de courte durée, avec renouvellement et expiration automatiques.
- Le contrôle d'accès basé sur les rôles (RBAC) garantit que chaque membre de l'équipe ne voit que les données et fonctionnalités pertinentes pour son rôle.
- Les sessions inactives expirent automatiquement.
- L'authentification multifacteur (MFA) figure sur notre feuille de route pour l'ensemble des comptes.

## Protection des données

- Toutes les données en transit sont chiffrées via TLS.
- Les données sensibles au repos sont chiffrées.
- Les connexions à la base de données utilisent SSL/TLS.
- Les secrets et identifiants d'API sont stockés à l'aide d'outils dédiés de gestion des secrets — jamais codés en dur ni intégrés au code source.

## Sécurité du Connector

Le PIQ Connector mérite une explication à part, car il s'agit du logiciel le plus proche de votre système de caisse et de vos systèmes de cuisine :

- Il n'accède qu'aux bases de données et tables spécifiquement configurées — rien de plus.
- Toute communication entre le Connector et PrepIQ est chiffrée via HTTPS.
- Il s'authentifie à l'aide d'une clé API unique et révocable, propre à votre organisation.
- Il se met à jour automatiquement pour corriger les failles de sécurité et rester compatible avec vos systèmes, et chaque version est signée numériquement pour en garantir l'authenticité.
- Il n'a aucune capacité de contrôler à distance, de modifier ou de supprimer des données dans vos systèmes sources — il est strictement en lecture seule.

## Sécurité de l'IA et des prévisions

- Vos données opérationnelles sont isolées au niveau de la base de données — aucune autre organisation ne peut accéder à vos prévisions, les consulter ou les influencer.
- L'accès inter-organisations est architecturalement impossible, et non une simple question de politique interne — notre modèle de données impose cette séparation.
- Nos modèles d'apprentissage automatique sont entraînés et appliqués dans les limites des données de votre propre organisation ; ils ne divulguent ni n'exposent les informations d'un client à un autre.

## Surveillance, journalisation et alertes

Nous surveillons en permanence nos systèmes afin de détecter toute activité inhabituelle, journalisons les événements d'accès à des fins d'audit, et déclenchons des alertes automatiques dès qu'une anomalie est détectée, afin d'enquêter et de réagir rapidement.

## Plan de reprise après sinistre

- Les sauvegardes s'exécutent automatiquement et régulièrement.
- Les procédures de sauvegarde et de récupération sont testées périodiquement pour confirmer qu'elles fonctionnent réellement.
- Les données sont stockées de manière redondante afin de réduire le risque de perte lié à un point de défaillance unique.

## Gestion des incidents

Nous maintenons un processus de gestion des incidents avec des voies d'escalade définies, afin d'agir rapidement et de communiquer clairement en cas de problème. Dans l'éventualité peu probable d'un incident de sécurité affectant vos données, nous informerons les clients concernés sous 72 heures conformément aux réglementations applicables, et nous menons systématiquement une analyse post-incident pour éviter toute récidive.

## Conformité et bonnes pratiques

Nous concevons PrepIQ en tenant compte des réglementations de protection des données telles que le RGPD et le CCPA, et nous alignons nos pratiques sur les référentiels de sécurité reconnus du secteur. Nos partenaires d'infrastructure disposent de certifications auditées de manière indépendante, telles que SOC 2 Type II, sur lesquelles nous nous appuyons dans le cadre de notre stratégie de sécurité globale.

## Sécurité des fournisseurs

Chaque service tiers auquel nous faisons appel — y compris notre prestataire de paiement, notre fournisseur de notifications et notre prestataire de stockage de fichiers — fait l'objet d'une revue de sécurité avant toute intégration, et nous limitons au strict nécessaire le nombre de fournisseurs ayant accès aux données clients. Nous revoyons périodiquement les autorisations d'accès des fournisseurs et les accords de partage de données.

## Cycle de développement sécurisé

Chaque modification de code passe par une analyse de sécurité automatisée, une revue par les pairs et une validation en environnement de test avant sa mise en production. Nous examinons périodiquement nos systèmes à la recherche de vulnérabilités et priorisons les correctifs en fonction des risques identifiés.

## Divulgation responsable

Si vous découvrez une vulnérabilité de sécurité dans PrepIQ, nous souhaitons en être informés. Merci de la signaler à [security@prepiq.net](mailto:security@prepiq.net) en fournissant autant de détails que possible. Nous accuserons réception de votre signalement sous 24 heures, mènerons une enquête rapide et vous tiendrons informé de son avancement. Nous ne poursuivrons pas en justice les chercheurs en sécurité agissant de bonne foi, signalant leurs découvertes de manière responsable et évitant d'accéder à des données qui ne leur appartiennent pas ou de les modifier.
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
