import { createFileRoute } from "@tanstack/react-router";
import { BackToTop } from "@/components/site/BackToTop";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { LangProvider } from "@/components/site/lang";
import { LeadModal } from "@/components/site/LeadModal";
import { VisitorTracker } from "@/components/site/VisitorTracker";
import { Coverage, Faq, FinalCta, Hero, Offers, Proof, Stats, Steps, Usages } from "@/components/site/sections";

const title = "Internet haut débit en Tunisie | Inscription en 30 secondes";
const description =
  "Inscrivez-vous en 30 secondes et un conseiller vous rappelle avec la meilleure offre internet pour votre foyer, partout en Tunisie.";
const siteUrl = "https://ttshop.pro";
const ogImage = `${siteUrl}/og-image.jpg`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${siteUrl}/` },
      { property: "og:image", content: ogImage },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Internet haut débit en Tunisie — TTshop Pro" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "TTshop Pro",
          url: `${siteUrl}/`,
          inLanguage: "fr-TN",
          description,
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Inscription internet haut débit",
          provider: { "@type": "Organization", name: "TTshop Pro", url: `${siteUrl}/` },
          areaServed: { "@type": "Country", name: "Tunisie" },
          description,
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <LangProvider>
      <VisitorTracker />
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
