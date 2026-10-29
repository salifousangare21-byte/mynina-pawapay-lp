/* ==========================================================================
   MyNina — Landing multi-programmes — Configuration
   ========================================================================== */

// ⚠️ À remplacer par l'URL réelle du Worker une fois déployé (ex: https://mynina-pawapay.<compte>.workers.dev)
const WORKER_BASE_URL = "https://mynina-pawapay.marketing-03f.workers.dev";
const INITIATE_PAYMENT_URL = `${WORKER_BASE_URL}/api/initiate-payment`;
const PAYMENT_STATUS_URL = `${WORKER_BASE_URL}/api/payment-status`;
const POLL_INTERVAL_MS = 3000;
const POLL_MAX_ATTEMPTS = 40; // ~2 min d'attente avant le message « confirmation plus longue que prévu »
const PENDING_KEY = "mynina_pending_payment"; // paiement en attente : survit à un rechargement de page
const PENDING_TTL_MS = 8 * 60 * 1000;
const FAIL_COUNT_KEY = "mynina_fail_count";

// Trois formules (Jour / Semaine / Mois) avec tarif de lancement et ancien prix barré.
// ⚠️ OFFER_END doit être IDENTIQUE à OFFER_END dans worker.js : c'est le Worker qui fait foi
// pour le montant réellement débité. Passé cette date, la page et le Worker repassent
// automatiquement aux prix normaux (regularPrice).
// Important : PawaPay ne gère aucun prélèvement récurrent — chaque formule est payée une fois,
// sans reconduction automatique. Les "7 premiers jours" de la formule mensuelle sont inclus dans
// le mois payé (ce n'est pas un essai gratuit).
const OFFER_END = "2026-11-15T23:59:00Z"; // fin de l'offre de lancement (dimanche 15 novembre 2026) — heure UTC = heure d'Abidjan
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
function offerEndShort() {
  return new Date(OFFER_END).toLocaleDateString("fr-FR", { day: "numeric", month: "long", timeZone: "Africa/Abidjan" });
}
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

// Pages « dynamiques » pour les campagnes : ?plan=jour|semaine|mois et ?serie=pauvre-riche|coeurs-brulants…
// Sans paramètre (ou plan=tous) : page générique avec les 3 formules.
const LANDING = (function () {
  const q = new URLSearchParams(window.location.search);
  let plan = (q.get("plan") || "").toLowerCase();
  if (plan === "mois") plan = "mensuel";
  const serie = (q.get("serie") || "").toLowerCase();
  return { plan: PLANS[plan] ? plan : null, serie: PROGRAMS[serie] ? serie : null, showAll: false };
})();
if (LANDING.plan) selectedPlanKey = LANDING.plan;
function singleMode() { return !!LANDING.plan && !LANDING.showAll; }

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

// Côte d'Ivoire : numéros à 10 chiffres commençant par 0. Le préfixe indique l'opérateur
// d'origine (01-03 Moov, 04-06 MTN, 07-09 Orange). Avec la portabilité, ce n'est qu'une
// SUGGESTION : le client garde toujours la main sur le choix de l'opérateur.
const PHONE_RULES = {
  CIV: { length: 10, prefixes: { ORANGE_CIV: ["07", "08", "09"], MTN_MOMO_CIV: ["04", "05", "06"], MOOV_CIV: ["01", "02", "03"] } },
};
function detectOperator(country, local) {
  const rule = PHONE_RULES[country];
  if (!rule || local.length < 2) return null;
  const prefix = local.slice(0, 2);
  for (const [code, list] of Object.entries(rule.prefixes)) if (list.includes(prefix)) return code;
  return null;
}
function operatorLabel(code) {
  for (const c of Object.values(COUNTRIES)) {
    const op = c.operators.find((o) => o.code === code);
    if (op) return op.label;
  }
  return "Mobile Money";
}

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

let paymentInFlight = false;
let selectedCountry = DEFAULT_COUNTRY;
let selectedOperator = COUNTRIES[DEFAULT_COUNTRY].operators[0].code;

// Anciennement "openPaymentPopup" : fait défiler jusqu'au formulaire (toujours
// présent dans la page) et réinitialise son état — ne bascule plus de visibilité.
function openPaymentPopup() {
  if (!paymentSection) return;
  if (!stepStatus.classList.contains("is-pending")) { // ne masque pas une demande de paiement en cours
    stepForm.classList.add("active");
    stepStatus.classList.remove("active", "show");
  }
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
      operatorManual = true;
      setOperator(card.querySelector("input").value);
      updatePhoneHint();
    });
  });
  operatorManual = false;
  updatePayGuide();
  updatePhoneHint();
}

let operatorManual = false;
function setOperator(code) {
  selectedOperator = code;
  const wrap = document.getElementById("operatorGroup");
  if (!wrap) return;
  wrap.querySelectorAll(".operator-card").forEach((card) => {
    const input = card.querySelector("input");
    const on = input.value === code;
    input.checked = on;
    card.classList.toggle("is-selected", on);
  });
  updatePayGuide();
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
// Garde uniquement les chiffres, retire l'indicatif s'il est collé (+225…), limite à la longueur du pays.
function normalizeLocalInput(raw) {
  let v = String(raw).replace(/[^\d]/g, "");
  const dial = COUNTRIES[selectedCountry]?.dial;
  const max = PHONE_RULES[selectedCountry]?.length || 12;
  if (dial && v.startsWith(dial) && v.length > max) v = v.slice(dial.length);
  return v.slice(0, max);
}
function updatePhoneHint() {
  const hint = document.getElementById("phoneHint");
  if (!hint || !phoneInput) return;
  hint.className = "field-hint phone-hint";
  hint.textContent = "";
  const detected = detectOperator(selectedCountry, normalizeLocalInput(phoneInput.value));
  if (!detected) return;
  if (detected === selectedOperator) {
    hint.textContent = `✓ Numéro ${operatorLabel(detected)} détecté.`;
    hint.classList.add("is-ok");
  } else {
    hint.textContent = `Ce numéro ressemble à un numéro ${operatorLabel(detected)}, mais vous avez choisi ${operatorLabel(selectedOperator)}. Vérifiez l'opérateur : un mauvais choix fait échouer le paiement.`;
    hint.classList.add("is-warn");
    track("operator_mismatch_warning", { detected, selected: selectedOperator });
  }
}
if (phoneInput) {
  phoneInput.setAttribute("maxlength", "16"); // large pour accepter un collage « +225 07… », normalisé ensuite
  phoneInput.setAttribute("enterkeyhint", "next");
  phoneInput.addEventListener("input", (e) => {
    if (e.target.value.includes("@")) {
      formNote.style.color = "var(--danger)";
      formNote.textContent = "⚠️ Ceci ressemble à un e-mail — entrez votre numéro Mobile Money ici.";
      return;
    }
    if (formNote.textContent.startsWith("⚠️")) formNote.textContent = "";
    const cleaned = normalizeLocalInput(e.target.value);
    if (cleaned !== e.target.value) e.target.value = cleaned;
    const detected = detectOperator(selectedCountry, cleaned);
    if (detected && !operatorManual && detected !== selectedOperator) setOperator(detected);
    updatePhoneHint();
  });
}

// Faute de frappe fréquente dans l'e-mail (gmial.com…) : on propose la correction en un clic.
// Un e-mail faux = paiement sans confirmation reçue, donc on le rattrape avant le paiement.
const EMAIL_FIXES = { "gmial.com": "gmail.com", "gmai.com": "gmail.com", "gamil.com": "gmail.com", "gnail.com": "gmail.com", "gmail.con": "gmail.com", "gmail.co": "gmail.com", "yahoo.con": "yahoo.com", "yaho.com": "yahoo.com", "hotmail.con": "hotmail.com", "hotmal.com": "hotmail.com", "outlook.con": "outlook.com" };
const emailInput = document.getElementById("email");
if (emailInput) {
  emailInput.addEventListener("blur", () => {
    const hint = document.getElementById("emailHint");
    if (!hint) return;
    hint.textContent = "";
    const v = emailInput.value.trim();
    const at = v.lastIndexOf("@");
    if (at < 1) return;
    const fixed = EMAIL_FIXES[v.slice(at + 1).toLowerCase()];
    if (!fixed) return;
    const suggestion = `${v.slice(0, at)}@${fixed}`;
    hint.innerHTML = `Vouliez-vous dire <button type="button" class="link-btn" id="emailFixBtn"></button> ?`;
    const btn = document.getElementById("emailFixBtn");
    btn.textContent = suggestion;
    btn.addEventListener("click", () => { emailInput.value = suggestion; hint.textContent = ""; track("email_suggestion_used", {}); });
    track("email_suggestion_shown", {});
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
    const localNumber = normalizeLocalInput(phoneRaw);
    const dial = COUNTRIES[selectedCountry].dial;
    const rule = PHONE_RULES[selectedCountry];
    if (rule ? (localNumber.length !== rule.length || !localNumber.startsWith("0")) : localNumber.length < 7) {
      formNote.style.color = "var(--danger)";
      formNote.textContent = rule
        ? `Numéro invalide : il faut ${rule.length} chiffres, en commençant par 0 (ex : 0758356184).`
        : "Numéro de téléphone invalide.";
      track("form_error", { field: "phone", country: selectedCountry });
      phoneInput.focus();
      return;
    }

    showConfirmStep({ fullName, email, localNumber, dial });
  });
}

function returnToForm() {
  stepStatus.classList.remove("active", "show", "is-failed", "is-pending", "is-success");
  stepForm.classList.add("active");
  paymentSection?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Dernière vérification avant l'envoi de la demande de paiement : récapitulatif + case à cocher.
function showConfirmStep(fields) {
  const plan = currentPlan();
  const amount = `${fmtPrice(currentPrice())} ${PAYMENT_CURRENCY_LABEL}`;
  const opName = operatorLabel(selectedOperator);
  const detected = detectOperator(selectedCountry, fields.localNumber);
  stepForm.classList.remove("active");
  stepStatus.classList.remove("is-pending", "is-success", "is-failed");
  stepStatus.classList.add("active", "show");
  stepStatus.innerHTML = `
    <div class="confirm-wrap">
      <h4>Vérifiez avant de payer</h4>
      <p class="confirm-lead">Vous êtes sur le point de vous abonner à <strong>MyNina</strong> avec l'offre <strong id="cfOffer"></strong>.</p>
      <dl class="confirm-recap">
        <div><dt>Offre</dt><dd id="cfPlan"></dd></div>
        <div><dt>Montant</dt><dd id="cfAmount"></dd></div>
        <div><dt>Nom</dt><dd id="cfName"></dd></div>
        <div><dt>E-mail</dt><dd id="cfEmail"></dd></div>
        <div><dt>Numéro Mobile Money</dt><dd id="cfPhone"></dd></div>
        <div><dt>Opérateur</dt><dd id="cfOp"></dd></div>
      </dl>
      <p class="confirm-mismatch" id="cfMismatch" hidden></p>
      <p class="confirm-warn">Juste après, vous recevrez une <strong>demande de confirmation sur ce numéro</strong> (message ou notification de votre opérateur). Vous devrez la <strong>valider avec votre code secret</strong> pour finaliser le paiement. Vérifiez que le numéro, l'e-mail et vos informations sont corrects : votre confirmation et votre accès seront envoyés à cet e-mail.</p>
      <label class="confirm-check"><input type="checkbox" id="cfCheck" /><span>Je confirme que mes informations sont correctes et je suis conscient(e) que je dois valider la demande de paiement de <b id="cfAmount2"></b> sur mon téléphone.</span></label>
      <button class="btn-primary" id="cfPay" type="button" disabled style="width:100%;"></button>
      <button class="btn-secondary-lite" id="cfEdit" type="button">Modifier mes informations</button>
    </div>`;
  const set = (id, v) => { document.getElementById(id).textContent = v; }; // textContent : aucune injection possible
  set("cfOffer", plan.title);
  set("cfPlan", `${plan.title} (${plan.duration})`);
  set("cfAmount", `${amount} ${plan.suffix}`);
  set("cfName", fields.fullName);
  set("cfEmail", fields.email);
  set("cfPhone", `+${fields.dial} ${fields.localNumber}`);
  set("cfOp", opName);
  set("cfAmount2", amount);
  set("cfPay", `Confirmer et payer ${amount}`);
  if (detected && detected !== selectedOperator) {
    const m = document.getElementById("cfMismatch");
    m.hidden = false;
    m.textContent = `⚠️ Ce numéro ressemble à un numéro ${operatorLabel(detected)}, mais l'opérateur choisi est ${opName}. Si c'est une erreur, cliquez sur « Modifier mes informations ».`;
  }
  const check = document.getElementById("cfCheck");
  const pay = document.getElementById("cfPay");
  check.addEventListener("change", () => { pay.disabled = !check.checked; });
  pay.addEventListener("click", () => {
    if (!check.checked || pay.disabled) return;
    pay.disabled = true;
    track("confirm_accepted", { plan: plan.key, value: currentPrice(), operator: selectedOperator });
    runPayment(fields);
  });
  document.getElementById("cfEdit").addEventListener("click", () => { track("confirm_edit", { plan: plan.key }); returnToForm(); });
  track("confirm_step_shown", { plan: plan.key, value: currentPrice(), currency: "XOF", operator: selectedOperator, mismatch: !!(detected && detected !== selectedOperator) });
  paymentSection?.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function runPayment({ fullName, email, localNumber, dial }) {
    if (paymentInFlight) return; // anti double-clic : une seule demande de paiement à la fois
    paymentInFlight = true;
    submitBtn.disabled = true;
    submitBtn.textContent = "Envoi de la demande…";
    track("payment_started", { program: currentSlug, plan: currentPlan().key, value: currentPrice(), currency: "XOF", operator: selectedOperator, attempt: getFailCount() + 1 });

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
      paymentInFlight = false;
      submitBtn.disabled = false;
      submitBtn.textContent = submitLabel();
      returnToForm();
      formNote.style.color = "var(--danger)";
      formNote.textContent = isDebug
        ? `[debug] erreur réseau — ${err.message}`
        : "Connexion interrompue. Vérifiez votre réseau puis réessayez.";
      return;
    }

    // Le Worker fait foi sur le prix : si l'offre a pris fin entre l'affichage et l'envoi,
    // aucun débit n'a eu lieu — on met la page à jour et on invite à revalider.
    if (initData.status === "PRICE_CHANGED") {
      track("price_changed", { program: currentSlug, plan: currentPlan().key });
      renderAllPrices();
      paymentInFlight = false;
      submitBtn.disabled = false;
      submitBtn.textContent = submitLabel();
      returnToForm();
      formNote.style.color = "var(--danger)";
      formNote.textContent = "Les tarifs viennent d'être mis à jour. Vérifiez le montant affiché puis validez à nouveau.";
      return;
    }

    // Abonnement déjà actif détecté par le Worker AVANT tout débit PawaPay —
    // aucun paiement n'a été tenté, donc pas de remboursement à gérer.
    if (initData.status === "ALREADY_SUBSCRIBED") {
      track("already_subscribed", { program: currentSlug, plan: initData.plan });
      paymentInFlight = false;
      showAlreadySubscribedState(initData.plan, initData.expiresAt);
      return;
    }

    // REJECTED / DUPLICATE_IGNORED sans depositId exploitable → on arrête tout de suite,
    // pas de compte créé, pas de faux message de succès.
    // Une demande est déjà en cours pour cet e-mail (ex : double clic, page rechargée) :
    // on reprend le suivi de CETTE demande au lieu d'en envoyer une seconde au téléphone.
    if (initData.status === "PAYMENT_IN_PROGRESS" && initData.depositId) {
      paymentInFlight = false;
      track("payment_resumed", { program: currentSlug, depositId: initData.depositId, source: "server" });
      startPending({ depositId: initData.depositId, displayPhone, planKey: currentPlan().key, price: currentPrice(), operator: selectedOperator }, isDebug);
      return;
    }

    if (initData.status === "REJECTED" || !initData.depositId) {
      paymentInFlight = false;
      handleFailure(initData.failureReason, { planKey: currentPlan().key, price: currentPrice(), operator: selectedOperator });
      return;
    }

    paymentInFlight = false;
    track("payment_pending", { program: currentSlug, depositId: initData.depositId, transaction_id: initData.depositId, value: currentPrice(), currency: "XOF", plan: currentPlan().key, operator: selectedOperator });
    startPending({ depositId: initData.depositId, displayPhone, planKey: currentPlan().key, price: currentPrice(), operator: selectedOperator }, isDebug);
}

/* ==========================================================================
   Suivi du paiement — attente guidée, échecs expliqués, reprise après rechargement
   ========================================================================== */
function getFailCount() { try { return parseInt(sessionStorage.getItem(FAIL_COUNT_KEY) || "0", 10) || 0; } catch (e) { return 0; } }
function bumpFailCount() { try { sessionStorage.setItem(FAIL_COUNT_KEY, String(getFailCount() + 1)); } catch (e) {} return getFailCount(); }
function resetFailCount() { try { sessionStorage.removeItem(FAIL_COUNT_KEY); } catch (e) {} }
function savePending(ctx) { try { localStorage.setItem(PENDING_KEY, JSON.stringify(Object.assign({}, ctx, { ts: Date.now() }))); } catch (e) {} }
function clearPending() { try { localStorage.removeItem(PENDING_KEY); } catch (e) {} }
function loadPending() {
  try {
    const raw = JSON.parse(localStorage.getItem(PENDING_KEY) || "null");
    if (raw && raw.depositId && Date.now() - raw.ts < PENDING_TTL_MS) return raw;
  } catch (e) {}
  clearPending();
  return null;
}

let activePoll = null;
function startPending(ctx, isDebug) {
  savePending(ctx);
  showPendingState(ctx);
  pollPaymentStatus(ctx, isDebug);
}

function openHelpChat() {
  track("help_opened", { source: "payment" });
  try { if (window.Tawk_API && typeof window.Tawk_API.maximize === "function") window.Tawk_API.maximize(); } catch (e) {}
}

function showPendingState(ctx) {
  const op = ctx.operator ? operatorLabel(ctx.operator) : "Mobile Money";
  stepForm.classList.remove("active");
  stepStatus.classList.add("active", "show", "is-pending");
  stepStatus.classList.remove("is-success", "is-failed");
  stepStatus.innerHTML = `
    <svg class="status-spinner" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20"></circle></svg>
    <h4>Validez sur votre téléphone</h4>
    <p>Une demande de paiement de <strong>${fmtPrice(ctx.price)} ${PAYMENT_CURRENCY_LABEL}</strong> vient d'être envoyée au <strong>${ctx.displayPhone}</strong>.</p>
    <ol class="pay-steps-list">
      <li>Ouvrez la demande ${op} qui s'affiche sur votre téléphone.</li>
      <li>Entrez votre code secret pour confirmer.</li>
      <li>Restez sur cette page : elle se met à jour toute seule.</li>
    </ol>
    <div class="pay-progress" aria-hidden="true"><span id="payProgressBar"></span></div>
    <p class="pay-wait-tip" id="payWaitTip" hidden>Rien reçu ? Vérifiez que votre téléphone a du réseau et n'est pas en mode avion, et regardez aussi dans votre application ${op}. Ne relancez pas le paiement tout de suite : la demande peut encore arriver.</p>
  `;
}

function showSuccessState() {
  clearPending();
  resetFailCount();
  stepStatus.classList.remove("is-pending", "is-failed");
  stepStatus.classList.add("is-success");
  stepStatus.innerHTML = `
    <div class="status-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20 6 9 17l-5-5"/></svg></div>
    <h4>Paiement confirmé</h4>
    <p>Votre abonnement MyNina est en cours d'activation. Vous recevrez un e-mail et un message WhatsApp de confirmation d'ici quelques instants. Pensez à vérifier vos courriers indésirables.</p>
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

// Transforme le code/texte renvoyé par PawaPay en une cause lisible.
function classifyFailure(code, message) {
  const c = String(code || "").toUpperCase();
  const m = String(message || "").toLowerCase();
  if (c.includes("INSUFFICIENT") || /insufficient|balance|solde/.test(m)) return "balance";
  if (c.includes("PAYER_NOT_FOUND") || /not found|introuvable/.test(m)) return "notfound";
  if (c.includes("LIMIT") || /limit|plafond/.test(m)) return "limit";
  if (/cancel|annul/.test(m)) return "cancelled";
  if (c.includes("NOT_APPROVED") || /not approve|timed out|time out|délai|expired/.test(m)) return "timeout";
  return "other";
}

function failureCopy(kind, price, op) {
  const amount = `${fmtPrice(price)} ${PAYMENT_CURRENCY_LABEL}`;
  const map = {
    balance: { title: "Solde insuffisant", text: `Votre compte ${op} ne contient pas assez pour régler ${amount}. Rechargez-le puis réessayez, ou choisissez une formule moins chère.`, retry: "Réessayer après recharge" },
    timeout: { title: "Demande non validée à temps", text: `La demande de paiement n'a pas été confirmée avant la fin du délai. Cliquez sur « Réessayer », puis entrez votre code secret dès que la demande apparaît sur votre téléphone.`, retry: "Réessayer" },
    cancelled: { title: "Paiement annulé", text: "Vous avez annulé la demande de paiement. Rien n'a été débité. Vous pouvez recommencer quand vous voulez.", retry: "Réessayer" },
    notfound: { title: "Numéro ou opérateur incorrect", text: `Aucun compte ${op} n'a été trouvé pour ce numéro. Vérifiez le numéro et l'opérateur (il peut avoir changé si vous avez conservé votre numéro en changeant d'opérateur).`, retry: "Modifier mon numéro" },
    limit: { title: "Plafond du compte atteint", text: `Le plafond de votre compte ${op} est atteint pour le moment. Réessayez plus tard ou avec un autre numéro.`, retry: "Réessayer" },
    other: { title: "Paiement non abouti", text: "Le paiement n'a pas pu être confirmé par votre opérateur. Vérifiez votre numéro et votre solde, puis réessayez.", retry: "Réessayer" },
  };
  return map[kind] || map.other;
}

function handleFailure(failureReason, ctx) {
  const code = failureReason && failureReason.failureCode;
  const kind = classifyFailure(code, failureReason && failureReason.failureMessage);
  const count = bumpFailCount();
  clearPending();
  track("payment_failed", {
    program: currentSlug, reason: code || "", reason_type: kind, plan: ctx.planKey, value: ctx.price, currency: "XOF",
    operator: ctx.operator || "", attempt: count, depositId: ctx.depositId || "",
  });
  showFailedState(kind, ctx, count);
}

function showFailedState(kind, ctx, count) {
  const price = ctx.price;
  const op = ctx.operator ? operatorLabel(ctx.operator) : "Mobile Money";
  const copy = failureCopy(kind, price, op);
  // Si le solde est en cause : proposer les formules moins chères en un clic (la moins chère d'abord).
  const cheaper = kind === "balance"
    ? PLAN_ORDER.map((k) => PLANS[k]).filter((p) => planPrice(p) < price).sort((a, b) => planPrice(a) - planPrice(b))
    : [];
  stepForm.classList.remove("active");
  stepStatus.classList.add("active", "show", "is-failed");
  stepStatus.classList.remove("is-pending", "is-success");
  stepStatus.innerHTML = `
    <div class="status-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M18 6 6 18M6 6l12 12"/></svg></div>
    <h4>${copy.title}</h4>
    <p>${copy.text} Aucun montant n'est débité tant que le paiement n'est pas confirmé.</p>
    ${cheaper.map((p) => `<button class="btn-secondary-lite" type="button" data-fallback-plan="${p.key}">Prendre le pass ${p.label === "Mensuel" ? "Mois" : p.label} — ${fmtPrice(planPrice(p))} ${PAYMENT_CURRENCY_LABEL}</button>`).join("")}
    <button class="btn-primary" id="retryBtn" type="button" style="width:100%;">${copy.retry}</button>
    ${count >= 2 ? `<button class="btn-secondary-lite" id="helpBtn" type="button">Besoin d'aide ? Discuter avec nous</button>` : ""}
  `;
  const backToForm = (focusPhone) => {
    stepStatus.classList.remove("active", "show", "is-failed");
    stepForm.classList.add("active");
    paymentInFlight = false;
    submitBtn.disabled = false;
    submitBtn.textContent = submitLabel();
    if (focusPhone && phoneInput) phoneInput.focus();
    paymentSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  document.getElementById("retryBtn")?.addEventListener("click", () => { track("payment_retry", { reason_type: kind }); backToForm(kind === "notfound"); });
  document.getElementById("helpBtn")?.addEventListener("click", openHelpChat);
  stepStatus.querySelectorAll("[data-fallback-plan]").forEach((btn) => {
    btn.addEventListener("click", () => {
      track("fallback_plan_click", { from: ctx.planKey, to: btn.dataset.fallbackPlan, reason_type: kind });
      selectPlan(btn.dataset.fallbackPlan);
      backToForm(false);
    });
  });
}

function showTimeoutState(ctx) {
  stepStatus.classList.add("active", "show", "is-failed");
  stepStatus.classList.remove("is-pending", "is-success");
  stepStatus.innerHTML = `
    <div class="status-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg></div>
    <h4>La confirmation prend plus de temps que prévu</h4>
    <p>Si vous avez validé le paiement sur votre téléphone, votre abonnement sera activé automatiquement dès réception de la confirmation. Ne payez pas une seconde fois avant d'avoir vérifié.</p>
    <button class="btn-primary" id="recheckBtn" type="button" style="width:100%;">Vérifier à nouveau</button>
    <button class="btn-secondary-lite" id="helpBtn" type="button">Besoin d'aide ? Discuter avec nous</button>
  `;
  document.getElementById("recheckBtn")?.addEventListener("click", () => { track("payment_recheck", { depositId: ctx.depositId }); startPending(ctx, false); });
  document.getElementById("helpBtn")?.addEventListener("click", openHelpChat);
}

async function pollPaymentStatus(ctx, isDebug) {
  const token = {};
  activePoll = token;
  let attempts = 0;
  const tick = async () => {
    if (activePoll !== token) return; // un autre suivi a pris le relais
    attempts += 1;
    const bar = document.getElementById("payProgressBar");
    if (bar) bar.style.width = `${Math.min(100, Math.round((attempts / POLL_MAX_ATTEMPTS) * 100))}%`;
    const tip = document.getElementById("payWaitTip");
    if (tip && attempts * POLL_INTERVAL_MS >= 20000) tip.hidden = false;
    try {
      const res = await fetch(`${PAYMENT_STATUS_URL}?depositId=${encodeURIComponent(ctx.depositId)}`);
      const data = await res.json();
      console.log("[payment-status]", attempts, data);
      if (isDebug) formNote.textContent = `[debug] poll ${attempts} — ${data.status}`;

      if (activePoll !== token) return;
      if (data.status === "COMPLETED") {
        track("payment_completed", { program: currentSlug, depositId: ctx.depositId, transaction_id: ctx.depositId, value: ctx.price, currency: "XOF", plan: ctx.planKey, operator: ctx.operator || "" });
        showSuccessState();
        return;
      }
      if (data.status === "FAILED") {
        handleFailure(data.failureReason, ctx);
        return;
      }
    } catch (err) {
      console.error("[payment-status] erreur:", err);
    }

    if (attempts >= POLL_MAX_ATTEMPTS) {
      track("payment_timeout", { program: currentSlug, depositId: ctx.depositId, plan: ctx.planKey, operator: ctx.operator || "" });
      showTimeoutState(ctx);
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
      ${active ? `<div class="pricing-deadline">Offre valable jusqu'au ${offerEndShort()} · se termine dans <b data-offer-countdown>--:--:--</b></div>` : ""}
      <ul class="pricing-features">
        ${features.map((f) => `<li>${CHECK_ICON}${f}</li>`).join("")}
      </ul>
      <button class="btn-primary pricing-cta" type="button" data-plan="${plan.key}" style="width:100%;">Choisir ${plan.label === "Mensuel" ? "le mois" : "le " + plan.label.toLowerCase()}</button>
    </div>`;
}

function renderHubPricingCards() {
  const grid = document.getElementById("hubPricingGrid");
  if (!grid) return;
  const keys = singleMode() ? [LANDING.plan] : PLAN_ORDER;
  grid.classList.toggle("pricing-grid-3", !singleMode());
  grid.classList.toggle("pricing-grid-1", singleMode());
  grid.innerHTML = keys.map((k) => pricingCardHtml(PLANS[k])).join("");
  let more = document.getElementById("allPlansLink");
  if (!more) {
    more = document.createElement("button");
    more.id = "allPlansLink";
    more.type = "button";
    more.className = "link-btn all-plans-link";
    more.textContent = "Voir les autres formules";
    more.addEventListener("click", showAllPlans);
    grid.parentNode.insertBefore(more, grid.nextSibling);
  }
  more.hidden = !singleMode();
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
  field.id = "planField";
  field.innerHTML = '<label>Formule*</label><div class="plan-chips" id="planChips"></div>';
  priceRow.parentNode.insertBefore(field, priceRow);
  const summary = document.createElement("div");
  summary.id = "planSummary";
  summary.className = "plan-summary";
  summary.hidden = true;
  priceRow.parentNode.insertBefore(summary, field);
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

function showAllPlans() {
  if (LANDING.showAll) return;
  LANDING.showAll = true;
  track("show_all_plans", { from: LANDING.plan || "" });
  renderAllPrices();
}

function selectPlan(key) {
  if (!PLANS[key]) return;
  selectedPlanKey = key;
  renderPriceDisplays();
}

// Met à jour tous les affichages de prix de la page (hero, formulaire, bouton, textes)
function renderLandingCopy() {
  const title = document.querySelector(".hub-hero-title");
  const sub = document.querySelector(".hub-hero-sub");
  const cta = document.getElementById("heroSubscribeCta");
  if (!title || !sub) return; // pas la page d'accueil
  const prog = LANDING.serie ? PROGRAMS[LANDING.serie] : null;
  if (!singleMode()) {
    title.textContent = prog ? `Regardez ${prog.title} et bien d'autres télénovelas` : "Vos télénovelas préférées, en illimité";
    if (cta) cta.textContent = "S'abonner";
    return;
  }
  const plan = PLANS[LANDING.plan];
  const price = planPrice(plan);
  const amount = `${fmtPrice(price)} ${PAYMENT_CURRENCY_LABEL}`;
  const what = prog ? `Regardez ${prog.title}` : "Vos télénovelas préférées";
  const was = offerActive() ? `, au lieu de ${fmtPrice(plan.regularPrice)} ${PAYMENT_CURRENCY_LABEL}` : "";
  if (plan.key === "jour") {
    title.textContent = `${what} pour ${amount}`;
    sub.textContent = `Un jour d'accès à tout le catalogue${was}. Sans engagement, paiement Mobile Money.`;
  } else if (plan.key === "semaine") {
    title.textContent = `${what} pour ${amount} la semaine`;
    sub.textContent = `7 jours d'accès${was}. Moins cher que 7 pass jour (${fmtPrice(7 * planPrice(PLANS.jour))} ${PAYMENT_CURRENCY_LABEL}). Sans engagement.`;
  } else {
    title.textContent = `${what} pour ${amount} par mois`;
    sub.textContent = `Soit environ ${Math.round(price / 30)} ${PAYMENT_CURRENCY_LABEL} par jour${was}. Sans engagement, sans reconduction automatique.`;
  }
  if (cta) cta.textContent = `S'abonner — ${amount}`;
}

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
  if (hubSub && !singleMode()) {
    hubSub.textContent = active
      ? "Rosalinda, Marimar, Cœurs brûlants et bien d'autres. Offre de lancement : jusqu'à −50 %, valable jusqu'au 15 novembre. Sans engagement."
      : "Rosalinda, Marimar, Cœurs brûlants et bien d'autres. Dès 300 FCFA, sans engagement.";
  }
  const pricingHeading = document.querySelector(".pricing-section .section-heading");
  if (pricingHeading) pricingHeading.textContent = singleMode() ? "Votre formule" : "Choisissez votre formule";
  const pricingIntro = document.querySelector(".pricing-section .pricing-intro");
  if (pricingIntro) pricingIntro.textContent = singleMode()
    ? "Accès à tout le catalogue. Sans engagement, sans reconduction automatique."
    : "Jour, semaine ou mois : accès illimité à tout le catalogue. Sans engagement, sans reconduction automatique.";

  // Page à formule unique : le sélecteur est remplacé par un récapitulatif + lien « Changer »
  const planField = document.getElementById("planField");
  const planSummary = document.getElementById("planSummary");
  if (planField) planField.hidden = singleMode();
  if (planSummary) {
    planSummary.hidden = !singleMode();
    planSummary.innerHTML = singleMode()
      ? `<span>Formule : <strong>${plan.title}</strong> — ${fmtPrice(price)} ${PAYMENT_CURRENCY_LABEL} ${plan.suffix}</span> <button type="button" class="link-btn" id="planChangeBtn">Changer de formule</button>`
      : "";
    document.getElementById("planChangeBtn")?.addEventListener("click", showAllPlans);
  }
  renderLandingCopy();

  if (typeof submitBtn !== "undefined" && submitBtn && !submitBtn.disabled) submitBtn.textContent = submitLabel();
  renderOfferPills();
  updatePayGuide();
  tickOffer();
}

// Encart « Comment ça se passe » au-dessus du bouton : annonce l'étape de validation et le solde requis.
function updatePayGuide() {
  const el = document.getElementById("payGuide");
  if (!el) return;
  const op = operatorLabel(selectedOperator);
  const amount = `${fmtPrice(currentPrice())} ${PAYMENT_CURRENCY_LABEL}`;
  el.innerHTML = `
    <div class="pay-guide-title">Comment ça se passe</div>
    <ol>
      <li>Vous cliquez sur « S'abonner ».</li>
      <li>Une demande de <b>${amount}</b> arrive sur votre téléphone (${op}).</li>
      <li>Vous entrez votre code secret : c'est terminé.</li>
    </ol>
    <p class="pay-guide-note">Avant de payer : vérifiez que votre compte ${op} contient <b>au moins ${amount}</b> et gardez votre téléphone en main.</p>`;
}

// Pastille « offre de lancement » en haut du hero et bandeau au-dessus des tarifs
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
    pill.innerHTML = active ? `Offre de lancement · jusqu'au ${offerEndShort()} · fin dans <b data-offer-countdown>--:--:--</b>` : "";
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
      ? `<strong>Offre de lancement jusqu'à −50 %</strong><span>Jusqu'au ${offerEndLabel()} (heure d'Abidjan) · fin dans <b data-offer-countdown>--:--:--</b></span>`
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
  track("landing_view", { plan: LANDING.plan || "all", serie: LANDING.serie || "" });

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

  // Reprise : le client a quitté la page (appli Mobile Money, rechargement…) pendant une demande en cours.
  const pending = loadPending();
  if (pending && stepStatus) {
    if (pending.planKey && PLANS[pending.planKey]) selectPlan(pending.planKey);
    track("payment_resumed", { program: currentSlug, depositId: pending.depositId, source: "reload" });
    showPendingState(pending);
    pollPaymentStatus(pending, false);
    paymentSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const cta = document.getElementById("convertCta");
  if (cta) cta.addEventListener("click", () => openPaymentPopup());

  const heroSubscribeCta = document.getElementById("heroSubscribeCta");
  if (heroSubscribeCta) heroSubscribeCta.addEventListener("click", () => {
    if (singleMode()) { openPaymentPopup(); return; }
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
