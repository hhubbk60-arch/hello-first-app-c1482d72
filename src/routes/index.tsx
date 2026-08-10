import { createFileRoute } from "@tanstack/react-router";
import { BackToTop } from "@/components/site/BackToTop";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { LangProvider } from "@/components/site/lang";
import { LeadModal } from "@/components/site/LeadModal";
import { Coverage, Faq, FinalCta, Hero, Offers, Proof, Stats, Steps, Usages } from "@/components/site/sections";

const title = "Internet haut débit en Tunisie | Inscription en 30 secondes";
const description =
  "Inscrivez-vous en 30 secondes et un conseiller vous rappelle avec la meilleure offre internet pour votre foyer, partout en Tunisie.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <LangProvider>
      <Header />
      <main>
        <Hero />
        <Stats />
        <Offers />
        <Usages />
        <Coverage />
        <Steps />
        <Proof />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <LeadModal />
      <BackToTop />
    </LangProvider>
  );
}
