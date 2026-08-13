import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { LangProvider } from "@/components/site/lang";
import { BackToTop } from "@/components/site/BackToTop";
import { brand } from "@/lib/i18n";
import { LegalPage, LegalSection } from "@/components/site/LegalPage";

const title = "Conditions d'utilisation | TTshop Pro";
const description =
  "Conditions d'utilisation du site TTshop Pro : demandes d'inscription internet, obligations, couverture, tarifs et responsabilités.";

export const Route = createFileRoute("/conditions")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://ttshop.pro/conditions" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://ttshop.pro/conditions" }],
  }),
  component: TermsRoute,
});

function TermsRoute() {
  return (
    <LangProvider>
      <Header />
      <main>
        <LegalPage
          eyebrow="Informations légales"
          title="Conditions d'utilisation"
          updated="Dernière mise à jour : janvier 2026"
          intro={`Les présentes conditions encadrent l'utilisation du site ${brand.name} et l'envoi d'une demande d'inscription internet. En soumettant le formulaire, vous acceptez ces conditions.`}
        >
          <LegalSection title="1. Objet du site">
            <p>
              Le site présente les offres internet disponibles en Tunisie et permet d'envoyer une demande de rappel. Il ne
              constitue pas une souscription : aucun contrat n'est conclu tant qu'un conseiller n'a pas validé votre dossier
              et que les documents requis n'ont pas été signés.
            </p>
          </LegalSection>

          <LegalSection title="2. Demande d'inscription">
            <ul>
              <li>La demande est gratuite et sans engagement.</li>
              <li>Le champ Nom est obligatoire ; le téléphone (Gsm 1) est indispensable pour être rappelé.</li>
              <li>Le CIN permet de vérifier si vous êtes déjà client et d'éviter la création d'un doublon.</li>
              <li>Le gouvernorat sert à vérifier la couverture et à orienter votre demande vers l'équipe locale.</li>
            </ul>
          </LegalSection>

          <LegalSection title="3. Exactitude des informations">
            <p>
              Vous vous engagez à fournir des informations exactes et à jour. Toute demande contenant des coordonnées
              erronées, frauduleuses ou appartenant à un tiers sans son accord peut être rejetée sans préavis.
            </p>
          </LegalSection>

          <LegalSection title="4. Couverture et éligibilité">
            <p>
              La disponibilité d'une offre dépend de l'infrastructure présente à votre adresse. Les débits annoncés sont des
              débits maximaux théoriques ; le débit réel dépend du raccordement, du matériel et de l'usage simultané. Une
              vérification d'éligibilité est effectuée avant toute installation.
            </p>
          </LegalSection>

          <LegalSection title="5. Tarifs et délais">
            <p>
              Les prix affichés sont indicatifs, exprimés en dinars tunisiens et susceptibles d'évoluer. Les délais
              d'installation sont donnés à titre estimatif et peuvent varier selon la zone et la disponibilité des équipes.
            </p>
          </LegalSection>

          <LegalSection title="6. Propriété intellectuelle">
            <p>
              La marque {brand.name}, le logo, les textes, visuels et éléments d'interface du site sont protégés. Toute
              reproduction ou réutilisation sans autorisation écrite préalable est interdite.
            </p>
          </LegalSection>

          <LegalSection title="7. Responsabilité">
            <p>
              Nous nous efforçons de maintenir le site accessible et les informations exactes, sans garantie d'absence
              d'interruption ou d'erreur. Notre responsabilité ne saurait être engagée pour les dommages indirects résultant
              de l'utilisation du site ou de l'indisponibilité temporaire du service.
            </p>
          </LegalSection>

          <LegalSection title="8. Données personnelles">
            <p>
              Le traitement de vos données est détaillé dans notre{" "}
              <Link to="/confidentialite" className="font-medium text-brand hover:underline">
                politique de confidentialité
              </Link>
              .
            </p>
          </LegalSection>

          <LegalSection title="9. Droit applicable et contact">
            <p>
              Les présentes conditions sont soumises au droit tunisien. Pour toute réclamation, contactez-nous au{" "}
              <a href={brand.phoneHref} className="font-medium text-brand hover:underline" dir="ltr">
                {brand.phone}
              </a>{" "}
              ou à{" "}
              <a href={`mailto:${brand.email}`} className="font-medium text-brand hover:underline" dir="ltr">
                {brand.email}
              </a>
              .
            </p>
          </LegalSection>
        </LegalPage>
      </main>
      <Footer />
      <BackToTop />
    </LangProvider>
  );
}
