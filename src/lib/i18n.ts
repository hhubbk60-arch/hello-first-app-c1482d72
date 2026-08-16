export type Lang = "fr" | "ar";

export const brand = {
  name: "TTshop Pro",
  phone: "+216 71 000 000",
  phoneHref: "tel:+21671000000",
  email: "contact@ttshop.tn",
};

export const governorates = [
  "Tunis",
  "Ariana",
  "Ben Arous",
  "Manouba",
  "Nabeul",
  "Bizerte",
  "Béja",
  "Jendouba",
  "Le Kef",
  "Siliana",
  "Zaghouan",
  "Sousse",
  "Monastir",
  "Mahdia",
  "Sfax",
  "Kairouan",
  "Kasserine",
  "Sidi Bouzid",
  "Gabès",
  "Médenine",
  "Tataouine",
  "Gafsa",
  "Tozeur",
  "Kébili",
];

type Dict = {
  nav: { offers: string; usages: string; coverage: string; steps: string; faq: string };
  cta: { main: string; call: string; menu: string; close: string; backToTop: string };
  hero: {
    badge: string;
    title: string;
    sub: string;
    slides: string[];
    formTitle: string;
    formSub: string;
  };
  form: {
    name: string;
    namePh: string;
    firstName: string;
    firstNamePh: string;
    phone: string;
    phonePh: string;
    cin: string;
    cinPh: string;
    errCin: string;
    cinChecking: string;
    cinKnown: string;
    cinNew: string;
    optional: string;
    gov: string;
    govPh: string;
    need: string;
    submit: string;
    sending: string;
    privacy: string;
    doneTitle: string;
    doneText: string;
    doneCall: string;
    errName: string;
    errPhone: string;
    errGov: string;
    next: string;
    back: string;
    step: (n: number) => string;
  };
  needs: string[];
  stats: { label: string }[];
  offers: {
    eyebrow: string;
    title: string;
    items: { name: string; who: string; speed: string }[];
    link: string;
    families: {
      title: string;
      sub: string;
      more: string;
      items: { name: string; tag: string; text: string; points: string[]; href: string }[];
    };
  };
  usages: {
    eyebrow: string;
    title: string;
    sub: string;
    cta: string;
    prev: string;
    next: string;
    items: { title: string; text: string; tag: string }[];
  };
  coverage: { eyebrow: string; title: string; sub: string; cta: string };
  steps: { eyebrow: string; title: string; items: { title: string; text: string; meta: string }[] };
  proof: { eyebrow: string; title: string; items: { quote: string; name: string; city: string }[] };
  faq: { eyebrow: string; title: string; items: { q: string; a: string }[] };
  final: { title: string; sub: string; or: string };
  footer: { tagline: string; rights: string; links: string; contact: string; legal: string; privacy: string; terms: string };
  reassurance: string[];
};

const fr: Dict = {
  nav: { offers: "Offres", usages: "Usages", coverage: "Couverture", steps: "Étapes", faq: "FAQ" },
  cta: {
    main: "Je m'inscris",
    call: "Appeler",
    menu: "Ouvrir le menu",
    close: "Fermer le menu",
    backToTop: "Retour en haut",
  },
  hero: {
    badge: "Partout en Tunisie · 24 gouvernorats",
    title: "Un internet plus rapide, chez vous.",
    sub: "Laissez votre numéro. On vous rappelle avec la meilleure offre.",
    slides: ["Toute la famille connectée", "Télétravail sans coupure", "Gaming sans lag", "Études à la maison"],
    formTitle: "Être rappelé par un conseiller",
    formSub: "Réponse le jour même, par un conseiller basé en Tunisie.",
  },
  form: {
    name: "Nom",
    namePh: "Votre nom",
    firstName: "Prénom",
    firstNamePh: "Votre prénom",
    phone: "Téléphone (Gsm 1)",
    phonePh: "20 123 456",
    cin: "CIN",
    cinPh: "8 chiffres",
    errCin: "La CIN comporte 8 chiffres.",
    cinChecking: "Vérification…",
    cinKnown: "Vous êtes déjà client, nous retrouverons votre dossier.",
    cinNew: "Numéro valide.",
    optional: "facultatif",
    gov: "Gouvernorat",
    govPh: "Choisir",
    need: "Mon besoin",
    submit: "Je m'inscris",
    sending: "Envoi…",
    privacy: "Nous utilisons vos données uniquement pour vous rappeler.",
    doneTitle: "C'est enregistré !",
    doneText: "Un conseiller vous appelle très bientôt.",
    doneCall: "Besoin urgent ? Appelez-nous.",
    errName: "Indiquez votre nom.",
    errPhone: "Numéro à 8 chiffres.",
    errGov: "Choisissez votre gouvernorat.",
    next: "Continuer",
    back: "Retour",
    step: (n) => `Étape ${n} sur 2`,
  },
  needs: ["Nouvelle connexion", "Plus de débit", "Famille", "Télétravail", "Gaming"],
  stats: [{ label: "foyers accompagnés" }, { label: "gouvernorats" }, { label: "satisfaction" }],
  offers: {
    eyebrow: "Offres",
    title: "Quel débit vous faut-il ?",
    items: [
      { name: "Essentiel", who: "1 à 2 personnes", speed: "10–20 Mbps" },
      { name: "Famille", who: "3 à 5 personnes", speed: "20–100 Mbps" },
      { name: "Pro & Gaming", who: "Usages intensifs", speed: "100 Mbps +" },
    ],
    link: "Je veux cette offre",
    families: {
      title: "Deux familles d'offres haut débit",
      sub: "Choisissez la technologie, puis le débit qui correspond à votre foyer.",
      more: "Plus d'infos",
      items: [
        {
          name: "Fibre Premium",
          tag: "Fibre optique",
          text: "La fibre jusqu'au domicile pour un très haut débit stable, idéal pour les usages intensifs.",
          points: ["Très haut débit", "Latence minimale", "Installation à domicile"],
          href: "https://www.topnet.tn/offres/detail/haut-debit/fibre-premium",
        },
        {
          name: "Smart Rapido",
          tag: "ADSL / VDSL",
          text: "Le haut débit sur ligne téléphonique, disponible largement et rapide à activer.",
          points: ["Disponible partout", "Activation rapide", "Bon rapport qualité/prix"],
          href: "https://www.topnet.tn/offres/detail/haut-debit/smart-rapido",
        },
      ],
    },
  },
  usages: {
    eyebrow: "Usages",
    title: "Pensé pour votre quotidien.",
    sub: "Quel que soit votre usage, un conseiller vous propose le débit qu'il vous faut.",
    cta: "Je veux cette offre",
    prev: "Précédent",
    next: "Suivant",
    items: [
      { title: "Famille", text: "Plusieurs écrans connectés en même temps, sans ralentissement.", tag: "Jusqu'à 10 appareils" },
      { title: "Télétravail", text: "Visios stables toute la journée, partage de fichiers rapide.", tag: "Visio HD sans coupure" },
      { title: "Gaming", text: "Latence réduite et jeu fluide, même en soirée.", tag: "Ping bas" },
      { title: "Streaming", text: "Films et séries en 4K, sans mise en mémoire tampon.", tag: "4K fluide" },
      { title: "Études", text: "Cours en ligne et révisions sans interruption.", tag: "Idéal étudiants" },
      { title: "Petit commerce", text: "Caisse, paiement et gestion en ligne toujours connectés.", tag: "Connexion pro" },
    ],
  },
  coverage: {
    eyebrow: "Couverture",
    title: "Disponible près de chez vous.",
    sub: "Du nord au sud, dans les 24 gouvernorats.",
    cta: "Je m'inscris",
  },
  steps: {
    eyebrow: "Étapes",
    title: "Trois étapes, aucun engagement.",
    items: [
      {
        title: "Vous laissez vos coordonnées",
        text: "Nom, téléphone et ville. Rien de plus, aucun paiement en ligne.",
        meta: "moins d'une minute",
      },
      {
        title: "Un conseiller vous rappelle",
        text: "Une équipe basée en Tunisie vérifie la couverture et l'offre adaptée à votre foyer.",
        meta: "rappel le jour même",
      },
      {
        title: "Le technicien installe chez vous",
        text: "Rendez-vous à l'heure qui vous arrange, mise en service et test du débit sur place.",
        meta: "installation à domicile",
      },
    ],
  },
  proof: {
    eyebrow: "Avis clients",
    title: "Ils sont déjà connectés.",
    items: [
      { quote: "Toute la famille est connectée sans ralentissement.", name: "Amine Ben Salah", city: "Ariana" },
      { quote: "Inscrit le matin, rappelé dans la journée.", name: "Sonia Mabrouk", city: "Sousse" },
      { quote: "Mes visios ne coupent plus, même en heure de pointe.", name: "Karim Trabelsi", city: "Sfax" },
      { quote: "Le conseiller a compris mon besoin en deux minutes.", name: "Hela Gharbi", city: "Tunis" },
      { quote: "Installation faite à domicile, propre et rapide.", name: "Mehdi Chaabane", city: "Nabeul" },
      { quote: "Je payais plus cher pour moins de débit avant.", name: "Rim Ayari", city: "Bizerte" },
      { quote: "Mes enfants suivent leurs cours en ligne sans coupure.", name: "Nizar Hammami", city: "Monastir" },
      { quote: "Aucune pression à la vente, juste des conseils clairs.", name: "Ines Jelassi", city: "Ben Arous" },
      { quote: "Le technicien est passé le lendemain de mon appel.", name: "Walid Ferchichi", city: "Kairouan" },
      { quote: "Enfin un débit stable le soir à la maison.", name: "Emna Bouazizi", city: "Gabès" },
      { quote: "Le suivi par téléphone a été impeccable.", name: "Slim Ouertani", city: "Manouba" },
      { quote: "Je télétravaille sans plus jamais couper une réunion.", name: "Yosra Khelifi", city: "Béja" },
      { quote: "Bon rapport qualité prix pour mon petit commerce.", name: "Fethi Zouari", city: "Médenine" },
      { quote: "Tout a été expliqué en tunisien, très rassurant.", name: "Meriem Souissi", city: "Le Kef" },
      { quote: "Le ping en jeu est passé de catastrophique à parfait.", name: "Oussama Riahi", city: "Mahdia" },
      { quote: "Deux téléviseurs en streaming et ça tient sans souci.", name: "Nadia Belhaj", city: "Zaghouan" },
      { quote: "Rappel exactement à l'heure convenue.", name: "Anis Mejri", city: "Gafsa" },
      { quote: "J'ai upgradé mon abonnement en un seul appel.", name: "Sarra Landolsi", city: "Tozeur" },
      { quote: "Le wifi couvre enfin toute la maison.", name: "Chokri Nasri", city: "Sidi Bouzid" },
      { quote: "Service sérieux, je l'ai conseillé à mes voisins.", name: "Leila Abdennadher", city: "Jendouba" },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Questions fréquentes",
    items: [
      { q: "L'inscription est-elle gratuite ?", a: "Oui, gratuite et sans engagement." },
      { q: "Quand serai-je rappelé ?", a: "Le jour même, pendant les heures ouvrables." },
      { q: "Quelles informations dois-je donner ?", a: "Votre nom, votre téléphone et votre ville." },
      { q: "Puis-je améliorer mon abonnement actuel ?", a: "Oui, choisissez « Plus de débit » dans le formulaire." },
      { q: "Mes données sont-elles protégées ?", a: "Elles servent uniquement à vous rappeler et ne sont jamais revendues." },
    ],
  },
  final: {
    title: "Prêt pour un meilleur internet ?",
    sub: "Inscrivez-vous, on s'occupe du reste.",
    or: "Ou appelez-nous au",
  },
  footer: {
    tagline: "Internet haut débit en Tunisie.",
    rights: "Tous droits réservés.",
    links: "Liens",
    contact: "Contact",
    legal: "Légal",
    privacy: "Confidentialité",
    terms: "Conditions",
  },
  reassurance: ["Conseillers basés en Tunisie", "Installation par un technicien", "Données protégées"],
};

const ar: Dict = {
  nav: { offers: "العروض", usages: "الاستعمالات", coverage: "التغطية", steps: "المراحل", faq: "أسئلة" },
  cta: {
    main: "سجّل الآن",
    call: "اتصل بنا",
    menu: "فتح القائمة",
    close: "غلق القائمة",
    backToTop: "العودة إلى الأعلى",
  },
  hero: {
    badge: "في كامل تونس · 24 ولاية",
    title: "أنترنت أسرع في منزلك.",
    sub: "اتركوا رقمكم ونحن نتصل بكم بأفضل عرض.",
    slides: ["كل العائلة متصلة", "عمل عن بعد بلا انقطاع", "ألعاب بلا تقطيع", "دراسة في البيت"],
    formTitle: "اطلب مكالمة من مستشار",
    formSub: "إجابة في نفس اليوم من مستشار في تونس.",
  },
  form: {
    name: "اللقب",
    namePh: "لقبك",
    firstName: "الاسم",
    firstNamePh: "اسمك",
    phone: "الهاتف (جوال 1)",
    phonePh: "20 123 456",
    cin: "بطاقة التعريف",
    cinPh: "8 أرقام",
    errCin: "بطاقة التعريف تتكون من 8 أرقام.",
    cinChecking: "جار التحقق…",
    cinKnown: "أنت من حرفائنا القدامى، سنجد ملفك.",
    cinNew: "رقم صالح.",
    optional: "اختياري",
    gov: "الولاية",
    govPh: "اختر",
    need: "حاجتي",
    submit: "سجّل الآن",
    sending: "جار الإرسال…",
    privacy: "نستعمل معطياتكم فقط للاتصال بكم.",
    doneTitle: "تم التسجيل!",
    doneText: "سيتصل بكم أحد مستشارينا قريبا.",
    doneCall: "الأمر مستعجل؟ اتصلوا بنا.",
    errName: "أدخل اسمك.",
    errPhone: "الرقم يتكون من 8 أرقام.",
    errGov: "اختر ولايتك.",
    next: "التالي",
    back: "رجوع",
    step: (n) => `الخطوة ${n} من 2`,
  },
  needs: ["ربط جديد", "صبيب أعلى", "العائلة", "العمل عن بعد", "الألعاب"],
  stats: [{ label: "عائلة مرافقة" }, { label: "ولاية" }, { label: "رضا الحرفاء" }],
  offers: {
    eyebrow: "العروض",
    title: "أي صبيب يناسبك؟",
    items: [
      { name: "الأساسي", who: "شخص إلى شخصين", speed: "10–20 Mbps" },
      { name: "العائلي", who: "3 إلى 5 أشخاص", speed: "20–100 Mbps" },
      { name: "المحترف والألعاب", who: "استعمال مكثف", speed: "100 Mbps +" },
    ],
    link: "أريد هذا العرض",
    families: {
      title: "عائلتان من عروض الصبيب العالي",
      sub: "اختاروا التقنية ثم الصبيب المناسب لمنزلكم.",
      more: "مزيد من المعلومات",
      items: [
        {
          name: "Fibre Premium",
          tag: "الألياف البصرية",
          text: "الألياف البصرية إلى المنزل لصبيب عالٍ جدًا ومستقر، مثالي للاستعمال المكثف.",
          points: ["صبيب عالٍ جدًا", "زمن استجابة منخفض", "تركيب في المنزل"],
          href: "https://www.topnet.tn/offres/detail/haut-debit/fibre-premium",
        },
        {
          name: "Smart Rapido",
          tag: "ADSL / VDSL",
          text: "صبيب عالٍ عبر الخط الهاتفي، متوفر على نطاق واسع وسريع التفعيل.",
          points: ["متوفر في كل مكان", "تفعيل سريع", "جودة بسعر مناسب"],
          href: "https://www.topnet.tn/offres/detail/haut-debit/smart-rapido",
        },
      ],
    },
  },
  usages: {
    eyebrow: "الاستعمالات",
    title: "مصمّم ليوميّاتكم.",
    sub: "مهما كان استعمالكم، مستشارنا يقترح عليكم الصبيب المناسب.",
    cta: "نحب هذا العرض",
    prev: "السابق",
    next: "التالي",
    items: [
      { title: "العائلة", text: "عدة شاشات متصلة في نفس الوقت بلا بطء.", tag: "حتى 10 أجهزة" },
      { title: "العمل عن بعد", text: "مكالمات مرئية مستقرة طول النهار.", tag: "فيديو HD بلا انقطاع" },
      { title: "الألعاب", text: "زمن استجابة منخفض ولعب سلس حتى في الليل.", tag: "بينغ منخفض" },
      { title: "المشاهدة", text: "أفلام ومسلسلات بجودة 4K بلا تقطيع.", tag: "4K سلس" },
      { title: "الدراسة", text: "دروس عن بعد ومراجعة بلا انقطاع.", tag: "مثالي للطلبة" },
      { title: "التجارة الصغيرة", text: "الخلاص والتصرف عبر الأنترنت دائما متصل.", tag: "اتصال احترافي" },
    ],
  },
  coverage: {
    eyebrow: "التغطية",
    title: "متوفّر قريبا منكم.",
    sub: "من الشمال إلى الجنوب، في 24 ولاية.",
    cta: "سجّل الآن",
  },
  steps: {
    eyebrow: "المراحل",
    title: "ثلاث مراحل بدون التزام.",
    items: [
      {
        title: "تتركو معطياتكم",
        text: "الاسم، الهاتف والمدينة. بلا خلاص على الأنترنت.",
        meta: "أقل من دقيقة",
      },
      {
        title: "مستشار يتصل بيكم",
        text: "فريق في تونس يتثبت في التغطية ويقترح العرض المناسب لداركم.",
        meta: "اتصال في نفس اليوم",
      },
      {
        title: "الفني يركّب في داركم",
        text: "موعد في الوقت اللي يناسبكم، تركيب وتجربة الصبيب في المكان.",
        meta: "تركيب في المنزل",
      },
    ],
  },
  proof: {
    eyebrow: "رأي الحرفاء",
    title: "هم متصلون فعلا.",
    items: [
      { quote: "كل العائلة متصلة دون تقطيع.", name: "أمين بن صالح", city: "أريانة" },
      { quote: "سجّلت صباحا واتصلوا بي في نفس اليوم.", name: "سنية المبروك", city: "سوسة" },
      { quote: "مكالماتي المرئية لم تعد تنقطع حتى في ساعات الذروة.", name: "كريم الطرابلسي", city: "صفاقس" },
      { quote: "المستشار فهم حاجتي في دقيقتين.", name: "هالة الغربي", city: "تونس" },
      { quote: "التركيب تم في المنزل بسرعة وباحترافية.", name: "مهدي شعبان", city: "نابل" },
      { quote: "كنت نخلص أكثر وناخو صبيب أقل قبل.", name: "ريم العياري", city: "بنزرت" },
      { quote: "أولادي يتابعون دروسهم عن بعد بلا انقطاع.", name: "نزار الهمامي", city: "المنستير" },
      { quote: "بلا ضغط للبيع، نصائح واضحة فقط.", name: "إيناس الجلاصي", city: "بن عروس" },
      { quote: "الفني جاء في اليوم الموالي للمكالمة.", name: "وليد الفرشيشي", city: "القيروان" },
      { quote: "أخيرا صبيب مستقر في الليل.", name: "آمنة البوعزيزي", city: "قابس" },
      { quote: "المتابعة بالهاتف كانت ممتازة.", name: "سليم الورتاني", city: "منوبة" },
      { quote: "نخدم عن بعد وما عادش تقطع الاجتماعات.", name: "يسرى الخليفي", city: "باجة" },
      { quote: "جودة بثمن معقول لمحلي الصغير.", name: "فتحي الزواري", city: "مدنين" },
      { quote: "شرحولي كل شيء بالتونسي، حاجة مطمئنة.", name: "مريم السويسي", city: "الكاف" },
      { quote: "زمن الاستجابة في الألعاب ولّى ممتاز.", name: "أسامة الرياحي", city: "المهدية" },
      { quote: "شاشتين ستريمينغ في نفس الوقت بلا مشاكل.", name: "نادية بالحاج", city: "زغوان" },
      { quote: "الاتصال جاء في الوقت المتفق عليه بالضبط.", name: "أنيس الماجري", city: "قفصة" },
      { quote: "طوّرت اشتراكي في مكالمة واحدة.", name: "سارة العندليسي", city: "توزر" },
      { quote: "الواي فاي يغطي الدار الكل.", name: "شكري الناصري", city: "سيدي بوزيد" },
      { quote: "خدمة جدية ونصحت بيها جيراني.", name: "ليلى عبد النادر", city: "جندوبة" },
    ],
  },
  faq: {
    eyebrow: "أسئلة",
    title: "أسئلة متكررة",
    items: [
      { q: "هل التسجيل مجاني؟", a: "نعم، مجاني وبدون التزام." },
      { q: "متى يتم الاتصال بي؟", a: "في نفس اليوم خلال أوقات العمل." },
      { q: "ما هي المعطيات المطلوبة؟", a: "الاسم، الهاتف والمدينة." },
      { q: "هل يمكنني تحسين اشتراكي الحالي؟", a: "نعم، اختر «صبيب أعلى» في الاستمارة." },
      { q: "هل معطياتي محمية؟", a: "تستعمل فقط للاتصال بكم ولا تباع أبدا." },
    ],
  },
  final: {
    title: "جاهزون لأنترنت أفضل؟",
    sub: "سجّلوا ونحن نتولّى الباقي.",
    or: "أو اتصلوا بنا على",
  },
  footer: {
    tagline: "أنترنت عالي الصبيب في تونس.",
    rights: "كل الحقوق محفوظة.",
    links: "روابط",
    contact: "اتصل بنا",
    legal: "قانوني",
    privacy: "الخصوصية",
    terms: "الشروط",
  },
  reassurance: ["مستشارون في تونس", "تركيب من طرف فني", "معطيات محمية"],
};

export const dict: Record<Lang, Dict> = { fr, ar };
