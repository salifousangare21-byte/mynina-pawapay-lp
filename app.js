/* ==========================================================================
   MyNina — Landing multi-programmes — Configuration
   ========================================================================== */

// ⚠️ À remplacer par l'URL réelle du Worker une fois déployé (ex: https://mynina-pawapay.<compte>.workers.dev)
const WORKER_BASE_URL = "https://mynina-pawapay.marketing-03f.workers.dev";
const INITIATE_PAYMENT_URL = `${WORKER_BASE_URL}/api/initiate-payment`;
const PAYMENT_STATUS_URL = `${WORKER_BASE_URL}/api/payment-status`;
const POLL_INTERVAL_MS = 3000;
const POLL_MAX_ATTEMPTS = 30; // ~90s d'attente avant timeout affiché à l'utilisateur

const PLANS = {
  jour:    { label: "Jour",    price: 5,  suffix: "/ jour" },
  semaine: { label: "Semaine", price: 10, suffix: "/ semaine" },
  mois:    { label: "Mois",    price: 15, suffix: "/ mois" },
};
const DEFAULT_PLAN = "mois";
let selectedPlan = DEFAULT_PLAN;

const PAYMENT_CURRENCY = "XOF";
const PAYMENT_CURRENCY_LABEL = "FCFA";
const SHARED_TRAILER = "assets/videos/trailer.mp4";

function currentPlan() { return PLANS[selectedPlan]; }
function currentPrice() { return currentPlan().price; }
function currentPlanLabel() { return currentPlan().label; }

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
      { code: "WAVE_CIV", label: "Wave", color: "#1DC8CD" },
    ] },
  SEN: { name: "Sénégal", flag: "🇸🇳", dial: "221", currency: "XOF",
    operators: [
      { code: "ORANGE_SEN", label: "Orange Money", color: "#FF7900" },
      { code: "FREE_SEN", label: "Free Money", color: "#7B2FF7" },
      { code: "WAVE_SEN", label: "Wave", color: "#1DC8CD" },
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
function programUrl(slug) { return `/programmes/${slug}`; }

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

  const priceEl = document.getElementById("heroPrice");
  if (priceEl) priceEl.textContent = `${currentPrice()} ${PAYMENT_CURRENCY_LABEL}`;
  const priceSuffixEl = document.getElementById("heroPriceSuffix");
  if (priceSuffixEl) priceSuffixEl.textContent = currentPlan().suffix;
  const priceAmountEl = document.getElementById("priceAmount");
  if (priceAmountEl) priceAmountEl.textContent = `${currentPrice()} ${PAYMENT_CURRENCY_LABEL}`;

  const otherSlugs = Object.keys(PROGRAMS).filter((s) => s !== currentSlug);
  renderCarousel("otherProgramsRow", "otherProgramsCarousel", otherSlugs);

  observeReveals(document);
  track("program_view", { program: currentSlug });
}

/* ==========================================================================
   Sélection de l'offre (Jour / Semaine / Mois)
   ========================================================================== */
function renderPlanCards() {
  const wrap = document.getElementById("planGroup");
  if (!wrap) return;
  wrap.innerHTML = Object.entries(PLANS).map(([key, plan]) => `
    <label class="plan-card ${key === selectedPlan ? "is-selected" : ""}">
      <input type="radio" name="plan" value="${key}" ${key === selectedPlan ? "checked" : ""}/>
      <div class="plan-name">${plan.label}</div>
      <div class="plan-price">${plan.price} ${PAYMENT_CURRENCY_LABEL}</div>
    </label>
  `).join("");
  wrap.querySelectorAll(".plan-card").forEach((card) => {
    card.querySelector("input").addEventListener("change", () => {
      selectedPlan = card.querySelector("input").value;
      wrap.querySelectorAll(".plan-card").forEach((el) => el.classList.remove("is-selected"));
      card.classList.add("is-selected");
      const priceAmountEl = document.getElementById("priceAmount");
      if (priceAmountEl) priceAmountEl.textContent = `${currentPrice()} ${PAYMENT_CURRENCY_LABEL}`;
      if (submitBtn) submitBtn.textContent = `Profiter de l'offre — ${currentPrice()} ${PAYMENT_CURRENCY_LABEL}`;
      track("plan_selected", { program: currentSlug, plan: selectedPlan });
    });
  });
}

/* ==========================================================================
   Popup — formulaire (sans mot de passe) + message SMS
   ========================================================================== */
const modal = document.getElementById("paymentModal");
const stepForm = document.getElementById("stepForm");
const stepStatus = document.getElementById("stepStatus");
const form = document.getElementById("accountForm");
const formNote = document.getElementById("formNote");
const submitBtn = document.getElementById("submitBtn");

let selectedCountry = DEFAULT_COUNTRY;
let selectedOperator = COUNTRIES[DEFAULT_COUNTRY].operators[0].code;

function openPaymentPopup() {
  if (!modal) return;
  modal.classList.add("show");
  stepForm.classList.add("active");
  stepStatus.classList.remove("active", "show");
  formNote.textContent = "";
  track("payment_popup_open", { program: currentSlug });
}
function closePaymentPopup() { modal.classList.remove("show"); }

if (modal) {
  document.getElementById("modalCloseBtn")?.addEventListener("click", closePaymentPopup);
  modal.addEventListener("click", (e) => { if (e.target === modal) closePaymentPopup(); });
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
  WAVE_SEN: "assets/payment-methods/wave.png",
  // ⚠️ FREE_SEN : pas de logo fourni — affichage par initiale en attendant.
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
// PawaPay attend le numéro local complet, AVEC le 0 initial, accolé à l'indicatif
// (ex: indicatif 225 + numéro 0758356184 = 2250758356184). On ne retire donc rien.
function cleanLocalNumber(v) {
  return v.replace(/[^\d]/g, "");
}

const phoneInput = document.getElementById("phone");
if (phoneInput) {
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
      Form_Name: `programme_${currentSlug}`,
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
      Product_Id: currentSlug,
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
      submitBtn.textContent = `Profiter de l'offre — ${currentPrice()} ${PAYMENT_CURRENCY_LABEL}`;
      formNote.style.color = "var(--danger)";
      formNote.textContent = isDebug
        ? `[debug] erreur réseau — ${err.message}`
        : "Impossible de contacter le service de paiement. Réessayez dans un instant.";
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

    track("payment_pending", { program: currentSlug, depositId: initData.depositId });
    showPendingState(displayPhone);
    pollPaymentStatus(initData.depositId, displayPhone, isDebug);
  });
}

function showPendingState(displayPhone) {
  stepForm.classList.remove("active");
  stepStatus.classList.add("active", "show", "is-pending");
  stepStatus.classList.remove("is-success", "is-failed");
  stepStatus.innerHTML = `
    <div class="status-icon status-spinner"></div>
    <h4>Vérifiez votre téléphone</h4>
    <p>Vous avez reçu une demande de confirmation au <strong>${displayPhone}</strong> pour valider votre paiement de ${currentPrice()} ${PAYMENT_CURRENCY_LABEL}. Entrez votre code PIN Mobile Money pour continuer — cette page se met à jour automatiquement.</p>
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
    <button class="btn-primary" id="closeAlreadySubBtn" type="button" style="width:100%;">Fermer</button>
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
    submitBtn.textContent = `Profiter de l'offre — ${currentPrice()} ${PAYMENT_CURRENCY_LABEL}`;
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
        track("payment_completed", { program: currentSlug, depositId });
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
   Init
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  persistVisitContext();
  renderHub();
  renderCountrySelect();
  renderOperatorCards();
  renderPlanCards();
  renderProgramPage();
  setupSoundToggle("hubHeroVideo", "hubSoundToggle");
  setupSoundToggle("heroVideo", "heroSoundToggle");

  const cta = document.getElementById("convertCta");
  if (cta) cta.addEventListener("click", () => openPaymentPopup());

  const scrollCue = document.getElementById("scrollCue");
  if (scrollCue) scrollCue.addEventListener("click", () => {
    document.getElementById("carouselRow")?.scrollIntoView({ behavior: "smooth" });
  });
});
