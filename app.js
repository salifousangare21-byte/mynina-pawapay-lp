/* ==========================================================================
   MyNina — Landing multi-programmes — Configuration
   ========================================================================== */

// ⚠️ À remplacer par l'URL réelle du Worker une fois déployé (ex: https://mynina-pawapay.<compte>.workers.dev)
const WORKER_BASE_URL = "https://mynina-pawapay.marketing-03f.workers.dev";
const INITIATE_PAYMENT_URL = `${WORKER_BASE_URL}/api/initiate-payment`;
const PAYMENT_STATUS_URL = `${WORKER_BASE_URL}/api/payment-status`;
const POLL_INTERVAL_MS = 3000;
const POLL_MAX_ATTEMPTS = 30; // ~90s d'attente avant timeout affiché à l'utilisateur

// Trois formules (Jour / Semaine / Mois) avec tarif de lancement et ancien prix barré.
// ⚠️ OFFER_END doit être IDENTIQUE à OFFER_END dans worker.js : c'est le Worker qui fait foi
// pour le montant réellement débité. Passé cette date, la page et le Worker repassent
// automatiquement aux prix normaux (regularPrice).
// Important : PawaPay ne gère aucun prélèvement récurrent — chaque formule est payée une fois,
// sans reconduction automatique. Les "7 premiers jours" de la formule mensuelle sont inclus dans
// le mois payé (ce n'est pas un essai gratuit).
const OFFER_END = "2026-11-04T23:59:00Z"; // fin de l'offre de lancement (7 jours) — heure UTC = heure d'Abidjan
const PLANS = {
  jour:    { key: "jour",    label: "Jour",    title: "Pass Jour",           price: 150,  regularPrice: 300,  suffix: "/ jour",    duration: "1 jour d'accès" },
  semaine: { key: "semaine", label: "Semaine", title: "Pass Semaine",        price: 750,  regularPrice: 1000, suffix: "/ semaine", duration: "7 jours d'accès" },
  // label "Mensuel" conservé : c'est la valeur déjà utilisée par le parcours Make en production.
  mensuel: { key: "mensuel", label: "Mensuel", title: "Abonnement Mensuel",  price: 2000, regularPrice: 3200, suffix: "/ mois",    duration: "1 mois d'accès", trialDays: 7, highlighted: true },
};
const PLAN_ORDER = ["jour", "semaine", "mensuel"];
const PAYMENT_CURRENCY = "XOF";
const PAYMENT_CURRENCY_LABEL = "FCFA";
const SHARED_TRAILER = "assets/videos/trailer.mp4";

let selectedPlanKey = "mensuel";
function offerActive() { return Date.now() < Date.parse(OFFER_END); }
function planPrice(plan) { return offerActive() ? plan.price : plan.regularPrice; }
function currentPlan() { return PLANS[selectedPlanKey]; }
function currentPrice() { return planPrice(currentPlan()); }
function currentPlanLabel() { return currentPlan().label; }
function fmtPrice(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0"); }
function discountPct(plan) { return Math.round((1 - plan.price / plan.regularPrice) * 100); }
function submitLabel() { return `S'abonner — ${fmtPrice(currentPrice())} ${PAYMENT_CURRENCY_LABEL} ${currentPlan().suffix}`; }
function offerEndLabel() {
  const d = new Date(OFFER_END);
  const day = d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "Africa/Abidjan" });
  const [hh, mm] = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Africa/Abidjan" }).split(":");
  return `${day} à ${parseInt(hh, 10)} h${mm === "00" ? "" : " " + mm}`;
}


const PROGRAMS = {
  "rosalinda": {
    title: "Rosalinda", genre: "Drame romantique",
    poster: "assets/vignettes/rosalinda.jpg", trailer: SHARED_TRAILER,
    synopsis: "Rosalinda, jeune marchande de fleurs au cœur pur, découvre qu'elle est l'héritière d'une riche famille. Entre amour passionnel, trahisons, manipulations et secrets du passé, elle devra lutter pour préserver son identité et protéger ceux qu'elle aime malgré les épreuves du destin.",
  },
  "marimar": {
    title: "Marimar", genre: "Drame romantique",
    poster: "assets/vignettes/marimar.jpg", trailer: SHARED_TRAILER,
    synopsis: "Marimar, une fille pauvre, épouse le riche Sergio mais est humiliée par sa belle-famille et chassée. Des années plus tard, devenue une riche héritière méconnaissable, elle revient pour se venger de ceux qui l'ont détruite, en particulier son ex-mari.",
  },
  "une-note-despoir": {
    title: "Une note d'espoir", genre: "Drame",
    poster: "assets/vignettes/une-note-despoir.jpg", trailer: SHARED_TRAILER,
    synopsis: "Sol est une femme travailleuse qui a la chance de travailler comme choriste pour une chanteuse de funk et de retourner à la danse, comme elle le faisait dans sa jeunesse. Tiraillée entre la pression familiale et la passion de la scène, elle doit faire face au jugement des membres de son église et aux conflits avec sa famille. La nouvelle chance la reconnectera à son passé de bien des façons, la menant à retrouver son grand amour de jeunesse.",
  },
  "coeurs-brulants": {
    title: "Coeurs brûlants", genre: "Drame romantique",
    poster: "assets/vignettes/coeurs-brulants.jpg", trailer: SHARED_TRAILER,
    synopsis: "Dans le quartier traditionnel de Mooca à São Paulo, Tancinha, marchande de fruits au grand cœur, est partagée entre Apolo, son fiancé camionneur passionné, et Beto, un séducteur de la haute société venu la séduire par pari avant de tomber réellement amoureux d'elle. Entre secrets de famille, rivalités amoureuses et la disparition mystérieuse de son père Guido, Tancinha bouleverse toutes les règles pour faire éclater la vérité et suivre son cœur.",
  },
  "pauvre-riche": {
    title: "Pauvre riche", genre: "Drame",
    poster: "assets/vignettes/pauvre-riche.jpg", trailer: SHARED_TRAILER,
    synopsis: "Veuve et mère de deux enfants, Maria vit une vie tranquille dans un village. Elle travaille dur et vend des fruits sur le marché pour élever ses enfants et s'occuper de ses parents. Du jour au lendemain, elle gagne à la loterie et devient l'une des femmes les plus riches du pays. Mais le but de Maria reste simple : elle veut juste que sa famille vive une vie agréable et retrouver son fils qui lui avait été enlevé à la naissance.",
  },
  "la-vie-a-tout-prix": {
    title: "La vie à tout prix", genre: "Drame",
    poster: "assets/vignettes/la-vie-a-tout-prix.jpg", trailer: SHARED_TRAILER,
    synopsis: "Paloma, courageuse couturière et mère célibataire de trois enfants à Rio de Janeiro, voit sa vie basculer le jour où elle reçoit par erreur des résultats médicaux lui annonçant qu'il ne lui reste que six mois à vivre. Décidée à profiter de chaque instant, elle découvre que les résultats appartenaient en réalité à Alberto, un riche éditeur millionnaire en phase terminale. Malgré leurs mondes opposés, une amitié profonde naît entre eux, redonnant à chacun le goût de savourer l'existence.",
  },
};

const COUNTRIES = {
  CIV: { name: "Côte d'Ivoire", flag: "🇨🇮", dial: "225", currency: "XOF",
    operators: [
      { code: "ORANGE_CIV", label: "Orange Money", color: "#FF7900" },
      { code: "MTN_MOMO_CIV", label: "MTN Money", color: "#FFCC00" },
      { code: "MOOV_CIV", label: "Moov Money", color: "#0072CE" },
      // Wave masqué temporairement (activation en cours chez PawaPay) — retirer les // pour le réactiver
      // { code: "WAVE_CIV", label: "Wave", color: "#1DC8CD" },
    ] },
  SEN: { name: "Sénégal", flag: "🇸🇳", dial: "221", currency: "XOF",
    operators: [
      { code: "ORANGE_SEN", label: "Orange Money", color: "#FF7900" },
      { code: "FREE_SEN", label: "Free Money", color: "#7B2FF7" },
    ] },
  CMR: { name: "Cameroun", flag: "🇨🇲", dial: "237", currency: "XAF",
    operators: [
      { code: "ORANGE_CMR", label: "Orange Money", color: "#FF7900" },
      { code: "MTN_MOMO_CMR", label: "MTN Mobile Money", color: "#FFCC00" },
    ] },
  BEN: { name: "Bénin", flag: "🇧🇯", dial: "229", currency: "XOF",
    operators: [
      { code: "MTN_MOMO_BEN", label: "MTN Mobile Money", color: "#FFCC00" },
      { code: "MOOV_BEN", label: "Moov Money", color: "#0072CE" },
    ] },
  BFA: { name: "Burkina Faso", flag: "🇧🇫", dial: "226", currency: "XOF",
    operators: [
      { code: "ORANGE_BFA", label: "Orange Money", color: "#FF7900" },
      { code: "MOOV_BFA", label: "Moov Money", color: "#0072CE" },
    ] },
};
const DEFAULT_COUNTRY = "CIV";

/* ==========================================================================
   Tracking (dataLayer + UTMs + contexte de visite)
   ========================================================================== */
// Filet de sécurité pour la hauteur du hero : certains navigateurs intégrés
// (WhatsApp, Instagram, TikTok in-app — fréquents pour des clics publicitaires
// mobile) gèrent mal dvh/vh. On fixe la hauteur réelle mesurée en JS, qui
// fonctionne partout, et on la met à jour au redimensionnement/rotation.
function setHeroHeightFallback() {
  document.querySelectorAll(".media-hero").forEach((hero) => {
    hero.style.minHeight = `${Math.round(window.innerHeight * 0.92)}px`;
  });
}
window.addEventListener("resize", setHeroHeightFallback);
window.addEventListener("orientationchange", setHeroHeightFallback);

window.dataLayer = window.dataLayer || [];
function track(event, payload) { window.dataLayer.push(Object.assign({ event }, payload || {})); }

function persistVisitContext() {
  if (!sessionStorage.getItem("visit_timestamp")) {
    sessionStorage.setItem("visit_timestamp", new Date().toISOString());
    sessionStorage.setItem("landing_url", window.location.href);
    sessionStorage.setItem("landing_path", window.location.pathname);
    sessionStorage.setItem("landing_query", window.location.search);
  }
  const params = new URLSearchParams(window.location.search);
  ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "campaign_name"].forEach((key) => {
    const val = params.get(key);
    if (val) sessionStorage.setItem(key, val);
  });
}
function getVisitContext() {
  return {
    Utm_Source: sessionStorage.getItem("utm_source") || "",
    Utm_Medium: sessionStorage.getItem("utm_medium") || "",
    Utm_Campaign: sessionStorage.getItem("utm_campaign") || "",
    Utm_Content: sessionStorage.getItem("utm_content") || "",
    Utm_Term: sessionStorage.getItem("utm_term") || "",
    Gclid_Ads: sessionStorage.getItem("gclid") || "",
    Campaign_Name: sessionStorage.getItem("campaign_name") || sessionStorage.getItem("utm_campaign") || "",
    Landing_url: sessionStorage.getItem("landing_url") || window.location.href,
    Landing_path: sessionStorage.getItem("landing_path") || window.location.pathname,
    Landing_query: sessionStorage.getItem("landing_query") || window.location.search,
    Visit_timestamp: sessionStorage.getItem("visit_timestamp") || new Date().toISOString(),
    Traffic_type: (sessionStorage.getItem("gclid") || sessionStorage.getItem("utm_source")) ? "paid" : "organic",
    Device_type: /Mobi|Android|iPhone/i.test(navigator.userAgent) ? "mobile" : "desktop",
    User_agent: navigator.userAgent,
  };
}

/* ==========================================================================
   Animations d'apparition au scroll
   ========================================================================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add("in"); revealObserver.unobserve(entry.target); }
  });
}, { threshold: 0.12 });
function observeReveals(root) {
  (root || document).querySelectorAll(".reveal:not(.in)").forEach((el) => revealObserver.observe(el));
}

/* ==========================================================================
   Routing — /programmes/{slug}
   ========================================================================== */
function getSlugFromPath(pathname) {
  const match = pathname.match(/programmes\/([a-z0-9-]+)/i);
  return match ? match[1] : null;
}
// Détecte automatiquement si le site est servi sous /abonnements (mynina.tv)
// ou à la racine (ex: mynina-pawapay-lp2.pages.dev, pour les tests directs).
// Permet d'utiliser exactement le même code dans les deux cas, sans build séparé.
const BASE_PATH = window.location.pathname.startsWith("/abonnements") ? "/abonnements" : "";

function programUrl(slug) { return `${BASE_PATH}/programmes/${slug}`; }

let currentSlug = getSlugFromPath(window.location.pathname);
// Filet de sécurité : si on est bien sur une page programme mais que le slug
// n'a pas été résolu (lien direct, souci de routage), on retombe sur le
// premier programme plutôt que de laisser la page vide.
if (!PROGRAMS[currentSlug] && document.getElementById("programHero")) {
  currentSlug = Object.keys(PROGRAMS)[0];
}
let currentProgram = PROGRAMS[currentSlug] || null;

/* ==========================================================================
   Composant carrousel réutilisable (accueil + "autres programmes")
   ========================================================================== */
function programCardHTML(slug, p) {
  return `
    <a href="${programUrl(slug)}" class="program-card reveal">
      <video src="${p.trailer}" muted loop playsinline preload="metadata" class="program-card-video"></video>
      <img src="${p.poster}" alt="${p.title}" loading="lazy" class="program-card-poster" />
      <div class="program-card-overlay"><div class="program-card-title">${p.title}</div></div>
    </a>
  `;
}

function attachCardHoverPlay(container) {
  container.querySelectorAll(".program-card").forEach((card) => {
    const video = card.querySelector("video");
    if (!video) return;
    card.addEventListener("mouseenter", () => video.play().catch(() => {}));
    card.addEventListener("mouseleave", () => { video.pause(); video.currentTime = 0; });
  });
}

// slugs: liste explicite des programmes à afficher dans ce carrousel
function renderCarousel(rowId, trackId, slugs) {
  const row = document.getElementById(rowId);
  const track = document.getElementById(trackId);
  if (!row || !track) return;

  if (!slugs.length) { row.style.display = "none"; return; }

  track.innerHTML = slugs.map((slug) => programCardHTML(slug, PROGRAMS[slug])).join("");
  attachCardHoverPlay(track);
  observeReveals(track);

  const prevBtn = row.querySelector(".carousel-arrow-left");
  const nextBtn = row.querySelector(".carousel-arrow-right");
  const scrollByAmount = () => track.clientWidth * 0.9;
  prevBtn?.addEventListener("click", () => track.scrollBy({ left: -scrollByAmount(), behavior: "smooth" }));
  nextBtn?.addEventListener("click", () => track.scrollBy({ left: scrollByAmount(), behavior: "smooth" }));
}

/* ==========================================================================
   Rendu — HUB (page d'accueil)
   ========================================================================== */
function renderHub() {
  if (!document.getElementById("programCarousel")) return;
  renderCarousel("carouselRow", "programCarousel", Object.keys(PROGRAMS));

  const heroVideo = document.getElementById("hubHeroVideo");
  if (heroVideo) heroVideo.src = SHARED_TRAILER;

  observeReveals(document);
}

/* ==========================================================================
   Bouton son (hero vidéo)
   ========================================================================== */
function setupSoundToggle(videoId, btnId) {
  const video = document.getElementById(videoId);
  const btn = document.getElementById(btnId);
  if (!video || !btn) return;
  const iconMuted = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>';
  const iconOn = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 010 7"/><path d="M18.5 6a9 9 0 010 12"/></svg>';
  btn.innerHTML = video.muted ? iconMuted : iconOn;
  btn.addEventListener("click", () => {
    video.muted = !video.muted;
    if (!video.muted) video.play().catch(() => {});
    btn.innerHTML = video.muted ? iconMuted : iconOn;
  });
}

/* ==========================================================================
   Rendu — page détail programme
   ========================================================================== */
function renderProgramPage() {
  if (!currentProgram) return;

  document.title = `${currentProgram.title} — MyNina`;

  const heroVideo = document.getElementById("heroVideo");
  if (heroVideo) heroVideo.src = currentProgram.trailer;

  const titleEl = document.getElementById("seriesTitle");
  if (titleEl) titleEl.textContent = currentProgram.title;

  const genreEl = document.getElementById("genrePill");
  if (genreEl) genreEl.textContent = currentProgram.genre;

  const synopsisEl = document.getElementById("synopsisText");
  if (synopsisEl) synopsisEl.textContent = currentProgram.synopsis;

  renderPriceDisplays();

  const otherSlugs = Object.keys(PROGRAMS).filter((s) => s !== currentSlug);
  renderCarousel("otherProgramsRow", "otherProgramsCarousel", otherSlugs);

  observeReveals(document);
  track("program_view", { program: currentSlug });
}

/* ==========================================================================
   Formulaire de paiement — section statique (plus de popup), pour la stabilité mobile
   ========================================================================== */
const paymentSection = document.getElementById("paymentSection");
const stepForm = document.getElementById("stepForm");
const stepStatus = document.getElementById("stepStatus");
const form = document.getElementById("accountForm");
const formNote = document.getElementById("formNote");
const submitBtn = document.getElementById("submitBtn");

let selectedCountry = DEFAULT_COUNTRY;
let selectedOperator = COUNTRIES[DEFAULT_COUNTRY].operators[0].code;

// Anciennement "openPaymentPopup" : fait défiler jusqu'au formulaire (toujours
// présent dans la page) et réinitialise son état — ne bascule plus de visibilité.
function openPaymentPopup() {
  if (!paymentSection) return;
  stepForm.classList.add("active");
  stepStatus.classList.remove("active", "show");
  formNote.textContent = "";
  paymentSection.scrollIntoView({ behavior: "smooth", block: "start" });
  track("payment_popup_open", { program: currentSlug });
}
// Remet le formulaire visible après un échec/succès — remplace l'ancienne fermeture de popup.
function closePaymentPopup() {
  stepStatus.classList.remove("active", "show");
  stepForm.classList.add("active");
}

function renderCountrySelect() {
  const select = document.getElementById("country");
  if (!select) return;
  select.innerHTML = Object.keys(COUNTRIES).map((iso3) => {
    const c = COUNTRIES[iso3];
    return `<option value="${iso3}" ${iso3 === DEFAULT_COUNTRY ? "selected" : ""}>${c.flag} ${c.name}</option>`;
  }).join("");
  select.addEventListener("change", (e) => {
    selectedCountry = e.target.value;
    document.getElementById("phoneDial").textContent = `+${COUNTRIES[selectedCountry].dial}`;
    renderOperatorCards();
  });
  const dialEl = document.getElementById("phoneDial");
  if (dialEl) dialEl.textContent = `+${COUNTRIES[DEFAULT_COUNTRY].dial}`;
}

const OPERATOR_LOGOS = {
  ORANGE_CIV: "assets/payment-methods/orange-money.png",
  ORANGE_SEN: "assets/payment-methods/orange-money.png",
  ORANGE_CMR: "assets/payment-methods/orange-money.png",
  ORANGE_BFA: "assets/payment-methods/orange-money.png",
  MTN_MOMO_CIV: "assets/payment-methods/mtn-momo.png",
  MTN_MOMO_CMR: "assets/payment-methods/mtn-momo.png",
  MTN_MOMO_BEN: "assets/payment-methods/mtn-momo.png",
  MOOV_CIV: "assets/payment-methods/moov-money.png",
  MOOV_BEN: "assets/payment-methods/moov-money.png",
  MOOV_BFA: "assets/payment-methods/moov-money.png",
  WAVE_CIV: "assets/payment-methods/wave.png",
  // ⚠️ Wave Sénégal reste en attente (statut juridique de l'entité non confirmé
  // côté PawaPay) — non réintégré tant que non confirmé actif.
  // ⚠️ Le fichier wave.png actuel est un visuel provisoire, pas le vrai logo
  // Wave — à remplacer dès que le bon fichier est disponible.
  // FREE_SEN : pas de logo fourni — affichage par initiale en attendant.
};

function renderOperatorCards() {
  const wrap = document.getElementById("operatorGroup");
  if (!wrap) return;
  const operators = COUNTRIES[selectedCountry].operators;
  selectedOperator = operators[0].code;
  wrap.innerHTML = operators.map((op, i) => `
    <label class="operator-card ${i === 0 ? "is-selected" : ""}">
      <input type="radio" name="operator" value="${op.code}" ${i === 0 ? "checked" : ""}/>
      ${OPERATOR_LOGOS[op.code]
        ? `<img class="operator-logo" src="${OPERATOR_LOGOS[op.code]}" alt="${op.label}" />`
        : `<div class="operator-badge" style="background:${op.color};">${op.label.charAt(0)}</div>`}
      <div class="operator-name">${op.label}</div>
    </label>
  `).join("");
  wrap.querySelectorAll(".operator-card").forEach((card) => {
    card.querySelector("input").addEventListener("change", () => {
      selectedOperator = card.querySelector("input").value;
      wrap.querySelectorAll(".operator-card").forEach((el) => el.classList.remove("is-selected"));
      card.classList.add("is-selected");
    });
  });
}

function isValidEmail(v) { return /^\S+@\S+\.\S+$/.test(v); }

// L'API /registration de Muvi casse sur les caractères accentués (bug confirmé
// par leur support). On les retire au fil de la saisie plutôt que de bloquer
// l'utilisateur avec un message d'erreur après coup.
function stripAccents(v) {
  return v.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
const fullNameInput = document.getElementById("fullName");
if (fullNameInput) {
  fullNameInput.addEventListener("input", (e) => {
    const cleaned = stripAccents(e.target.value);
    if (cleaned !== e.target.value) {
      const pos = e.target.selectionStart;
      e.target.value = cleaned;
      e.target.setSelectionRange(pos, pos);
    }
  });
}

// PawaPay attend le numéro local complet, AVEC le 0 initial, accolé à l'indicatif
// (ex: indicatif 225 + numéro 0758356184 = 2250758356184) — confirmé fonctionnel
// par un paiement réel. Le seul risque à éviter : que l'utilisateur retape
// l'indicatif pays en plus (déjà affiché à gauche du champ), ce qui produirait
// un numéro invalide. On l'en empêche par la limite de longueur ci-dessous,
// et on retire l'indicatif s'il est quand même tapé par erreur.
function cleanLocalNumber(v) {
  const digitsOnly = v.replace(/[^\d]/g, "");
  const dial = COUNTRIES[selectedCountry]?.dial;
  if (dial && digitsOnly.startsWith(dial) && digitsOnly.length > 9) {
    return digitsOnly.slice(dial.length);
  }
  return digitsOnly;
}

const phoneInput = document.getElementById("phone");
if (phoneInput) {
  phoneInput.setAttribute("maxlength", "10");
  phoneInput.addEventListener("input", (e) => {
    if (e.target.value.includes("@")) {
      formNote.textContent = "⚠️ Ceci ressemble à un e-mail — entrez votre numéro Mobile Money ici.";
    } else if (formNote.textContent.startsWith("⚠️")) {
      formNote.textContent = "";
    }
  });
}

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    formNote.textContent = "";

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phoneRaw = document.getElementById("phone").value.trim();

    if (!fullName || !email || !phoneRaw) { formNote.textContent = "Merci de remplir tous les champs."; return; }
    if (!isValidEmail(email)) { formNote.textContent = "Adresse e-mail invalide."; return; }
    const localNumber = cleanLocalNumber(phoneRaw);
    const dial = COUNTRIES[selectedCountry].dial;
    if (localNumber.length < 7) { formNote.textContent = "Numéro de téléphone invalide."; return; }

    submitBtn.disabled = true;
    submitBtn.textContent = "Traitement en cours…";
    track("payment_started", { program: currentSlug });

    const now = new Date().toISOString();
    const visit = getVisitContext();

    const payload = {
      User_Uuid: crypto.randomUUID(),
      User_Email: email,
      "Full-Name": fullName,
      Country_Code: dial,
      Phone_Number: localNumber,
      Created_Date: now,
      Updated_Date: now,
      Plan_Name: currentPlanLabel(),
      Plan_Price: currentPrice(),
      Form_Name: `programme_${currentSlug || "hub"}`,
      Payment_Method: selectedOperator,
      Gclid_Ads: visit.Gclid_Ads,
      Campaign_Name: visit.Campaign_Name,
      Utm_Source: visit.Utm_Source,
      Utm_Medium: visit.Utm_Medium,
      Utm_Campaign: visit.Utm_Campaign,
      Utm_Content: visit.Utm_Content,
      Utm_Term: visit.Utm_Term,
      Landing_url: visit.Landing_url,
      Landing_path: visit.Landing_path,
      Landing_query: visit.Landing_query,
      Traffic_type: visit.Traffic_type,
      Device_type: visit.Device_type,
      User_agent: visit.User_agent,
      Visit_timestamp: visit.Visit_timestamp,
      Product_Id: currentSlug || "hub",
    };

    // Étape 1 — on demande au Worker d'initier le dépôt PawaPay.
    // En mode debug (?debug=1 dans l'URL), la vraie réponse technique
    // s'affiche dans le popup pour diagnostiquer sans outils développeur.
    const isDebug = new URLSearchParams(window.location.search).get("debug") === "1";
    const displayPhone = `+${dial} ${localNumber}`;
    let initData;
    try {
      const res = await fetch(INITIATE_PAYMENT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      console.log("[initiate-payment]", res.status, text);
      initData = JSON.parse(text);
      if (isDebug) {
        formNote.style.color = res.ok ? "var(--success)" : "var(--danger)";
        formNote.textContent = `[debug] statut init ${res.status} — ${text.slice(0, 300)}`;
      }
    } catch (err) {
      console.error("[initiate-payment] erreur:", err);
      submitBtn.disabled = false;
      submitBtn.textContent = submitLabel();
      formNote.style.color = "var(--danger)";
      formNote.textContent = isDebug
        ? `[debug] erreur réseau — ${err.message}`
        : "Impossible de contacter le service de paiement. Réessayez dans un instant.";
      return;
    }

    // Le Worker fait foi sur le prix : si l'offre a pris fin entre l'affichage et l'envoi,
    // aucun débit n'a eu lieu — on met la page à jour et on invite à revalider.
    if (initData.status === "PRICE_CHANGED") {
      track("price_changed", { program: currentSlug, plan: currentPlan().key });
      renderAllPrices();
      submitBtn.disabled = false;
      submitBtn.textContent = submitLabel();
      formNote.style.color = "var(--danger)";
      formNote.textContent = "Les tarifs viennent d'être mis à jour. Vérifiez le montant affiché puis validez à nouveau.";
      return;
    }

    // Abonnement déjà actif détecté par le Worker AVANT tout débit PawaPay —
    // aucun paiement n'a été tenté, donc pas de remboursement à gérer.
    if (initData.status === "ALREADY_SUBSCRIBED") {
      track("already_subscribed", { program: currentSlug, plan: initData.plan });
      showAlreadySubscribedState(initData.plan, initData.expiresAt);
      return;
    }

    // REJECTED / DUPLICATE_IGNORED sans depositId exploitable → on arrête tout de suite,
    // pas de compte créé, pas de faux message de succès.
    if (initData.status === "REJECTED" || !initData.depositId) {
      track("payment_failed", { program: currentSlug, reason: initData.failureReason?.failureCode });
      showFailedState(initData.failureReason?.failureMessage);
      return;
    }

    track("payment_pending", { program: currentSlug, depositId: initData.depositId, transaction_id: initData.depositId, value: currentPrice(), currency: "XOF", plan: currentPlan().key });
    showPendingState(displayPhone);
    pollPaymentStatus(initData.depositId, displayPhone, isDebug);
  });
}

function showPendingState(displayPhone) {
  stepForm.classList.remove("active");
  stepStatus.classList.add("active", "show", "is-pending");
  stepStatus.classList.remove("is-success", "is-failed");
  stepStatus.innerHTML = `
    <svg class="status-spinner" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20"></circle></svg>
    <h4>Vérifiez votre téléphone</h4>
    <p>Vous avez reçu une demande de confirmation au <strong>${displayPhone}</strong> pour valider votre paiement de ${fmtPrice(currentPrice())} ${PAYMENT_CURRENCY_LABEL}. Entrez votre code PIN Mobile Money pour continuer — cette page se met à jour automatiquement.</p>
  `;
}

function showSuccessState() {
  stepStatus.classList.remove("is-pending", "is-failed");
  stepStatus.classList.add("is-success");
  stepStatus.innerHTML = `
    <div class="status-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20 6 9 17l-5-5"/></svg></div>
    <h4>Paiement confirmé</h4>
    <p>Votre abonnement MyNina est en cours d'activation. Vous recevrez un e-mail et un message WhatsApp de confirmation d'ici quelques instants.</p>
  `;
}

function showAlreadySubscribedState(plan, expiresAt) {
  const planLabel = plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : "en cours";
  const dateLabel = expiresAt
    ? new Date(expiresAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : null;
  stepForm.classList.remove("active");
  stepStatus.classList.add("active", "show", "is-failed");
  stepStatus.classList.remove("is-pending", "is-success");
  stepStatus.innerHTML = `
    <div class="status-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg></div>
    <h4>Vous avez déjà un abonnement actif</h4>
    <p>Votre offre ${planLabel} est valable${dateLabel ? ` jusqu'au ${dateLabel}` : " actuellement"}. Aucun paiement n'a été effectué.</p>
    <button class="btn-primary" id="closeAlreadySubBtn" type="button" style="width:100%;">Retour</button>
  `;
  document.getElementById("closeAlreadySubBtn")?.addEventListener("click", closePaymentPopup);
}

function showFailedState(reason) {
  stepStatus.classList.add("active", "show", "is-failed");
  stepStatus.classList.remove("is-pending", "is-success");
  stepStatus.innerHTML = `
    <div class="status-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M18 6 6 18M6 6l12 12"/></svg></div>
    <h4>Paiement non abouti</h4>
    <p>${reason || "Le paiement n'a pas pu être confirmé (fonds insuffisants, opération annulée ou délai dépassé)."} Aucun montant n'a été débité pour un abonnement non activé. Vous pouvez réessayer.</p>
    <button class="btn-primary" id="retryBtn" type="button" style="width:100%;">Réessayer</button>
  `;
  document.getElementById("retryBtn")?.addEventListener("click", () => {
    stepStatus.classList.remove("active", "show", "is-failed");
    stepForm.classList.add("active");
    submitBtn.disabled = false;
    submitBtn.textContent = submitLabel();
  });
}

function showTimeoutState() {
  stepStatus.classList.add("active", "show", "is-failed");
  stepStatus.classList.remove("is-pending", "is-success");
  stepStatus.innerHTML = `
    <div class="status-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg></div>
    <h4>La confirmation prend plus de temps que prévu</h4>
    <p>Si vous avez validé le paiement sur votre téléphone, votre abonnement sera activé automatiquement dès réception de la confirmation. Sinon, vous pouvez réessayer.</p>
  `;
}

async function pollPaymentStatus(depositId, displayPhone, isDebug) {
  let attempts = 0;
  const tick = async () => {
    attempts += 1;
    try {
      const res = await fetch(`${PAYMENT_STATUS_URL}?depositId=${encodeURIComponent(depositId)}`);
      const data = await res.json();
      console.log("[payment-status]", attempts, data);
      if (isDebug) formNote.textContent = `[debug] poll ${attempts} — ${data.status}`;

      if (data.status === "COMPLETED") {
        track("payment_completed", { program: currentSlug, depositId, transaction_id: depositId, value: currentPrice(), currency: "XOF", plan: currentPlan().key });
        showSuccessState();
        return;
      }
      if (data.status === "FAILED") {
        track("payment_failed", { program: currentSlug, depositId, reason: data.failureReason?.failureCode });
        showFailedState(data.failureReason?.failureMessage);
        return;
      }
    } catch (err) {
      console.error("[payment-status] erreur:", err);
    }

    if (attempts >= POLL_MAX_ATTEMPTS) {
      track("payment_timeout", { program: currentSlug, depositId });
      showTimeoutState();
      return;
    }
    setTimeout(tick, POLL_INTERVAL_MS);
  };
  setTimeout(tick, POLL_INTERVAL_MS);
}

/* ==========================================================================
   Offres — cartes, sélecteur de formule, bandeau et compte à rebours
   ========================================================================== */
const CHECK_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>';

function pricingCardHtml(plan) {
  const active = offerActive();
  const tag = plan.trialDays
    ? `Meilleure offre · ${plan.trialDays} jours inclus`
    : plan.duration;
  const features = [
    plan.trialDays ? `Vos ${plan.trialDays} premiers jours inclus dès l'inscription` : plan.duration,
    "Accès illimité à tout le catalogue",
    "Sans engagement, sans reconduction automatique",
    "Paiement 100% Mobile Money",
  ];
  return `
    <div class="pricing-card${plan.highlighted ? " is-highlighted" : ""}" data-plan="${plan.key}">
      ${active ? `<div class="pricing-promo">−${discountPct(plan)} %</div>` : ""}
      <div class="pricing-tag">${tag}</div>
      <div class="pricing-name">${plan.title}</div>
      ${active ? `<div class="pricing-old"><s>${fmtPrice(plan.regularPrice)} ${PAYMENT_CURRENCY_LABEL}</s></div>` : ""}
      <div class="pricing-price">${fmtPrice(planPrice(plan))} <span>${PAYMENT_CURRENCY_LABEL}</span></div>
      <div class="pricing-suffix">${plan.suffix}${plan.key === "mensuel" ? ", sans engagement" : ""}</div>
      ${active ? `<div class="pricing-deadline">Offre valable 7 jours · se termine dans <b data-offer-countdown>--:--:--</b></div>` : ""}
      <ul class="pricing-features">
        ${features.map((f) => `<li>${CHECK_ICON}${f}</li>`).join("")}
      </ul>
      <button class="btn-primary pricing-cta" type="button" data-plan="${plan.key}" style="width:100%;">Choisir ${plan.label === "Mensuel" ? "le mois" : "le " + plan.label.toLowerCase()}</button>
    </div>`;
}

function renderHubPricingCards() {
  const grid = document.getElementById("hubPricingGrid");
  if (!grid) return;
  grid.classList.add("pricing-grid-3");
  grid.innerHTML = PLAN_ORDER.map((k) => pricingCardHtml(PLANS[k])).join("");
  grid.querySelectorAll(".pricing-cta").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.plan;
      track("plan_selected_hub", { plan: key, offer_active: offerActive() });
      selectPlan(key);
      openPaymentPopup();
    });
  });
}

function planChipsHtml() {
  const active = offerActive();
  return PLAN_ORDER.map((k) => {
    const p = PLANS[k];
    return `<button type="button" class="plan-chip${k === selectedPlanKey ? " is-selected" : ""}" data-plan="${k}" aria-pressed="${k === selectedPlanKey}">
      <span class="plan-chip-name">${p.label === "Mensuel" ? "Mois" : p.label}</span>
      ${active ? `<s class="plan-chip-old">${fmtPrice(p.regularPrice)}</s>` : ""}
      <strong class="plan-chip-price">${fmtPrice(planPrice(p))} ${PAYMENT_CURRENCY_LABEL}</strong>
    </button>`;
  }).join("");
}

function ensurePlanSelector() {
  if (document.getElementById("planChips")) return;
  const priceRow = document.querySelector("#accountForm .price-row");
  if (!priceRow) return;
  const field = document.createElement("div");
  field.className = "field";
  field.innerHTML = '<label>Formule*</label><div class="plan-chips" id="planChips"></div>';
  priceRow.parentNode.insertBefore(field, priceRow);
  field.querySelector("#planChips").addEventListener("click", (e) => {
    const btn = e.target.closest(".plan-chip");
    if (!btn) return;
    track("plan_changed_form", { plan: btn.dataset.plan, offer_active: offerActive() });
    selectPlan(btn.dataset.plan);
  });
  // Note sous le montant : durée de l'offre
  if (!document.getElementById("offerFormNote")) {
    const note = document.createElement("div");
    note.id = "offerFormNote";
    note.className = "offer-form-note";
    priceRow.parentNode.insertBefore(note, priceRow.nextSibling);
  }
}

function selectPlan(key) {
  if (!PLANS[key]) return;
  selectedPlanKey = key;
  renderPriceDisplays();
}

// Met à jour tous les affichages de prix de la page (hero, formulaire, bouton, textes)
function renderPriceDisplays() {
  const plan = currentPlan();
  const price = currentPrice();
  const active = offerActive();

  const priceEl = document.getElementById("heroPrice");
  if (priceEl) priceEl.innerHTML = `${active ? `<s class="old-price">${fmtPrice(plan.regularPrice)}</s> ` : ""}${fmtPrice(price)} ${PAYMENT_CURRENCY_LABEL}`;
  const priceSuffixEl = document.getElementById("heroPriceSuffix");
  if (priceSuffixEl) priceSuffixEl.textContent = plan.suffix;

  const amountEl = document.getElementById("priceAmount");
  if (amountEl) amountEl.innerHTML = `${active ? `<s class="old-price">${fmtPrice(plan.regularPrice)}</s> ` : ""}${fmtPrice(price)} ${PAYMENT_CURRENCY_LABEL}`;

  const modalSub = document.querySelector("#stepForm .modal-sub");
  if (modalSub) {
    modalSub.textContent = `${plan.title} : ${fmtPrice(price)} ${PAYMENT_CURRENCY_LABEL} ${plan.suffix}` +
      (plan.trialDays ? `, ${plan.trialDays} premiers jours inclus` : "") +
      `. Renseignez vos informations pour activer votre abonnement.`;
  }

  const chips = document.getElementById("planChips");
  if (chips) chips.innerHTML = planChipsHtml();

  const formNote = document.getElementById("offerFormNote");
  if (formNote) {
    formNote.innerHTML = active
      ? `Tarif de lancement valable jusqu'au <b>${offerEndLabel()}</b> (heure d'Abidjan) — fin dans <b data-offer-countdown>--:--:--</b>.`
      : "";
    formNote.hidden = !active;
  }

  const hubSub = document.querySelector(".hub-hero-sub");
  if (hubSub) {
    hubSub.textContent = active
      ? "Rosalinda, Marimar, Cœurs brûlants et bien d'autres. Offre de lancement : jusqu'à −50 %, valable 7 jours seulement. Sans engagement."
      : "Rosalinda, Marimar, Cœurs brûlants et bien d'autres. Dès 300 FCFA, sans engagement.";
  }
  const pricingHeading = document.querySelector(".pricing-section .section-heading");
  if (pricingHeading) pricingHeading.textContent = "Choisissez votre formule";
  const pricingIntro = document.querySelector(".pricing-section .pricing-intro");
  if (pricingIntro) pricingIntro.textContent = "Jour, semaine ou mois : accès illimité à tout le catalogue. Sans engagement, sans reconduction automatique.";

  if (typeof submitBtn !== "undefined" && submitBtn && !submitBtn.disabled) submitBtn.textContent = submitLabel();
  renderOfferPills();
  tickOffer();
}

// Pastille « offre 7 jours » en haut du hero et bandeau au-dessus des tarifs
function renderOfferPills() {
  const active = offerActive();
  const heroContent = document.querySelector(".media-hero-content");
  let pill = document.getElementById("offerPill");
  if (heroContent && !pill && active) {
    pill = document.createElement("div");
    pill.id = "offerPill";
    pill.className = "offer-pill";
    heroContent.insertBefore(pill, heroContent.firstChild);
  }
  if (pill) {
    pill.hidden = !active;
    pill.innerHTML = active ? `Offre de lancement · 7 jours · fin dans <b data-offer-countdown>--:--:--</b>` : "";
  }

  const grid = document.getElementById("hubPricingGrid");
  let banner = document.getElementById("offerBanner");
  if (grid && !banner && active) {
    banner = document.createElement("div");
    banner.id = "offerBanner";
    banner.className = "offer-banner";
    grid.parentNode.insertBefore(banner, grid);
  }
  if (banner) {
    banner.hidden = !active;
    banner.innerHTML = active
      ? `<strong>Offre de lancement jusqu'à −50 % · valable 7 jours</strong><span>Jusqu'au ${offerEndLabel()} (heure d'Abidjan) · fin dans <b data-offer-countdown>--:--:--</b></span>`
      : "";
  }
}

function formatRemaining(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const pad = (n) => String(n).padStart(2, "0");
  const days = Math.floor(s / 86400);
  const rest = s % 86400;
  return `${days > 0 ? days + " j " : ""}${pad(Math.floor(rest / 3600))}:${pad(Math.floor((rest % 3600) / 60))}:${pad(rest % 60)}`;
}

let offerWasActive = offerActive();
function tickOffer() {
  const text = formatRemaining(Date.parse(OFFER_END) - Date.now());
  document.querySelectorAll("[data-offer-countdown]").forEach((el) => { el.textContent = text; });
  const active = offerActive();
  if (active !== offerWasActive) {
    offerWasActive = active;
    renderAllPrices(); // l'offre vient de se terminer : retour aux prix normaux
  }
}

function renderAllPrices() {
  renderHubPricingCards();
  renderPriceDisplays();
}


/* ==========================================================================
   Init
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const navBack = document.getElementById("navBackLink");
  if (navBack) navBack.href = `${BASE_PATH}/`;
  persistVisitContext();

  renderHub();
  ensurePlanSelector();
  renderHubPricingCards();
  renderPriceDisplays();
  setInterval(tickOffer, 1000);
  renderCountrySelect();
  renderOperatorCards();
  renderProgramPage();
  setupSoundToggle("hubHeroVideo", "hubSoundToggle");
  setupSoundToggle("heroVideo", "heroSoundToggle");
  setHeroHeightFallback();

  const cta = document.getElementById("convertCta");
  if (cta) cta.addEventListener("click", () => openPaymentPopup());

  const heroSubscribeCta = document.getElementById("heroSubscribeCta");
  if (heroSubscribeCta) heroSubscribeCta.addEventListener("click", () => {
    document.getElementById("hubPricingGrid")?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  const heroRenewCta = document.getElementById("heroRenewCta");
  if (heroRenewCta) heroRenewCta.addEventListener("click", () => {
    track("renew_cta_click", {});
    document.getElementById("hubPricingGrid")?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
});

/* ==========================================================================
   Chat d'aide (Tawk.to) — même compte que la page d'accueil mynina.tv
   La bulle de chat est visible dès l'arrivée sur la page.
   ========================================================================== */
(function () {
  window.Tawk_API = window.Tawk_API || {};
  window.Tawk_LoadStart = new Date();
  var s1 = document.createElement("script");
  var s0 = document.getElementsByTagName("script")[0];
  s1.async = true;
  s1.src = "https://embed.tawk.to/68762b98b00c4c190e1ca14f/1j06pkjdv";
  s1.charset = "UTF-8";
  s1.setAttribute("crossorigin", "*");
  s0.parentNode.insertBefore(s1, s0);
})();
