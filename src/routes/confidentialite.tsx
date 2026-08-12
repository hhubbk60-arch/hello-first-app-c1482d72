import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { LangProvider } from "@/components/site/lang";
import { BackToTop } from "@/components/site/BackToTop";
import { brand } from "@/lib/i18n";
import { LegalPage, LegalSection } from "@/components/site/LegalPage";

const title = "Politique de confidentialité | TTshop Pro";
const description =
  "Comment TTshop Pro collecte, utilise et protège vos données personnelles lors d'une demande d'inscription internet en Tunisie.";

export const Route = createFileRoute("/confidentialite")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/confidentialite" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/confidentialite" }],
  }),
  component: PrivacyRoute,
});

function PrivacyRoute() {
  return (
    <LangProvider>
      <Header />
      <main>
        <LegalPage
          eyebrow="Informations légales"
          title="Politique de confidentialité"
          updated="Dernière mise à jour : janvier 2026"
          intro={`${brand.name} recueille des données personnelles uniquement pour traiter votre demande d'inscription internet et vous rappeler avec l'offre adaptée. Cette page explique quelles données sont collectées, pourquoi, combien de temps elles sont conservées et comment exercer vos droits.`}
        >
          <LegalSection title="1. Responsable du traitement">
            <p>
              Le responsable du traitement est {brand.name}, société établie en Tunisie. Pour toute question relative à
              vos données, écrivez à{" "}
              <a href={`mailto:${brand.email}`} className="font-medium text-brand hover:underline" dir="ltr">
                {brand.email}
              </a>{" "}
              ou appelez le{" "}
              <a href={brand.phoneHref} className="font-medium text-brand hover:underline" dir="ltr">
                {brand.phone}
              </a>
              .
            </p>
          </LegalSection>

          <LegalSection title="2. Données collectées">
            <p>Le formulaire d'inscription collecte uniquement les informations nécessaires au rappel commercial :</p>
            <ul>
              <li><strong>Nom</strong> — seul champ strictement obligatoire, il identifie votre dossier.</li>
              <li><strong>Prénom</strong> — complète l'identité du client.</li>
              <li><strong>Téléphone 1 (Gsm 1)</strong> — canal de contact principal du conseiller.</li>
              <li><strong>CIN</strong> — numéro national utilisé pour détecter les anciens clients et éviter les doublons.</li>
              <li><strong>Gouvernorat</strong> — permet l'affectation à l'équipe locale et la vérification de couverture.</li>
              <li><strong>Besoin exprimé</strong> — type d'usage déclaré (famille, télétravail, gaming, etc.).</li>
              <li>
                <strong>Données techniques</strong> — paramètres de campagne (UTM), date et heure de la demande.
              </li>
            </ul>
            <p>Aucune donnée bancaire n'est demandée sur ce site.</p>
          </LegalSection>

          <LegalSection title="3. Finalités et base légale">
            <ul>
              <li>Traiter votre demande d'inscription et vous rappeler : mesure précontractuelle à votre demande.</li>
              <li>Vérifier si vous êtes déjà client (contrôle CIN) : intérêt légitime à éviter les doublons.</li>
              <li>Répartir les demandes par gouvernorat et produire des statistiques internes : intérêt légitime.</li>
              <li>Vous envoyer des offres commerciales : uniquement avec votre consentement.</li>
            </ul>
          </LegalSection>

          <LegalSection title="4. Durée de conservation">
            <p>
              Les demandes non converties sont conservées 12 mois à compter du dernier contact. Les dossiers clients sont
              conservés pendant la durée de la relation contractuelle, puis pendant la durée légale applicable en Tunisie.
            </p>
          </LegalSection>

          <LegalSection title="5. Destinataires">
            <p>
              Vos données sont accessibles aux équipes commerciales et techniques de {brand.name} habilitées, ainsi qu'aux
              partenaires d'installation strictement nécessaires à la mise en service. Elles ne sont ni vendues, ni louées,
              ni transmises à des tiers à des fins publicitaires.
            </p>
          </LegalSection>

          <LegalSection title="6. Sécurité et localisation">
            <p>
              Les données sont traitées en Tunisie, avec accès restreint aux personnes habilitées, journalisation des accès
              et transmission chiffrée entre votre navigateur et nos serveurs.
            </p>
          </LegalSection>

          <LegalSection title="7. Vos droits">
            <p>
              Vous disposez d'un droit d'accès, de rectification, d'opposition, de limitation et de suppression de vos
              données, ainsi que du droit de retirer votre consentement à tout moment. Adressez votre demande à{" "}
              <a href={`mailto:${brand.email}`} className="font-medium text-brand hover:underline" dir="ltr">
                {brand.email}
              </a>{" "}
              ; une réponse vous est apportée sous 30 jours.
            </p>
          </LegalSection>

          <LegalSection title="8. Cookies">
            <p>
              Le site utilise des cookies strictement nécessaires à son fonctionnement et, le cas échéant, des cookies de
              mesure d'audience. Vous pouvez les bloquer depuis les réglages de votre navigateur ; certaines fonctions du
              formulaire peuvent alors être dégradées.
            </p>
          </LegalSection>

          <LegalSection title="9. Contact">
            <p>
              Une question sur cette politique ? Contactez-nous au{" "}
              <a href={brand.phoneHref} className="font-medium text-brand hover:underline" dir="ltr">
                {brand.phone}
              </a>{" "}
              (Lun – Sam, 8h – 20h) ou consultez nos{" "}
              <Link to="/conditions" className="font-medium text-brand hover:underline">
                conditions d'utilisation
              </Link>
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
