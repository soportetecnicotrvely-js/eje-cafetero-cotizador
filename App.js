/**
 * app.js — Cotizador Eje Cafetero (Trvely / Dominick Travel)
 *
 * Se monta dentro de:  <div id="eje-cafetero-cotizador"></div>
 * (más los scripts de config.js, data.js y este archivo).
 *
 * Flujo:
 *  1. El usuario elige una fecha de salida FIJA y ajusta adultos/niños/infantes.
 *  2. Al presionar "Cotizar" se calcula el valor Y se muestra el DESCRIPTIVO
 *     específico de esa salida (qué incluye, alojamiento, itinerario, notas).
 *     Antes de cotizar, ese descriptivo no se muestra en ningún lado.
 *  3. "Continuar con la reserva" abre el formulario de contacto.
 *  4. Al enviarlo, se inserta la prereserva en Supabase (o se simula en modo
 *     demo) y se dispara -vía Database Webhook- el correo al cliente + interno.
 */

(function () {
  "use strict";

  const MOUNT_ID = "eje-cafetero-cotizador";
  const LIMITS = { adults: { min: 1, max: 9 }, kids: { min: 0, max: 8 }, infants: { min: 0, max: 4 } };
  const CATEGORY_BY_COUNT = { 1: "sencilla", 2: "doble", 3: "triple", 4: "cuadruple", 5: "quintuple" };

  const money = (n) =>
    n == null ? "N/A" : n.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

  const state = {
    tiers: {},
    departures: [],
    selectedDeparture: null,
    adults: 2,
    kids: 0,
    infants: 0,
    lastQuote: null,
    supabase: null,
  };

  // ---------------------------------------------------------------------
  // Markup
  // ---------------------------------------------------------------------
  function buildMarkup() {
    return `
      <div class="cw-ticket">
        <div class="cw-ticket__header">
          <p class="cw-eyebrow">Cotizador</p>
          <h2 class="cw-ticket__title">Elige tu salida</h2>
        </div>
        <div class="cw-perforation" aria-hidden="true"></div>
        <div class="cw-ticket__body">

          <div class="cw-field-group">
            <label for="cw-departure">Fecha de salida</label>
            <div class="cw-select-wrap">
              <select id="cw-departure" class="cw-select">
                <option value="" disabled selected>Elige una fecha…</option>
              </select>
            </div>
            <p class="cw-hint" id="cw-departure-nota"></p>
          </div>

          <div class="cw-pax-grid">
            ${paxColumn("adults", "Adultos", "")}
            ${paxColumn("kids", "Niños", "3 a 10 años")}
            ${paxColumn("infants", "Infantes", "0 a 2 años")}
          </div>

          <p class="cw-hint">La tarifa de niño o infante solo aplica si viajan acompañados de mínimo dos adultos en la misma habitación.</p>

          <div class="cw-perforation" aria-hidden="true" style="margin-top:22px;margin-bottom:22px"></div>

          <button type="button" class="cw-cta" id="cw-submit" disabled>Cotizar</button>
        </div>
      </div>

      <!-- Solo aparece DESPUÉS de cotizar -->
      <div class="cw-result-wrap" id="cw-result-wrap" hidden>
        <div class="cw-price-panel" id="cw-price-panel"></div>
        <div class="cw-plan-details" id="cw-plan-details"></div>
        <button type="button" class="cw-cta" id="cw-continue">Continuar con la reserva</button>
      </div>

      <div class="cw-panel" id="cw-contact-panel" hidden>
        <h3>Tus datos de contacto</h3>
        <p class="cw-panel__subtitle">Con esto generamos tu prereserva; el equipo confirma disponibilidad y te escribe con los medios de pago.</p>
        <form id="cw-contact-form" novalidate>
          <div class="cw-field-group">
            <label for="cw-full_name">Nombre completo *</label>
            <input type="text" id="cw-full_name" required autocomplete="name" />
          </div>
          <div class="cw-field-group">
            <label for="cw-document_id">Documento de identidad *</label>
            <input type="text" id="cw-document_id" required />
          </div>
          <div class="cw-field-row">
            <div class="cw-field-group">
              <label for="cw-email">Correo electrónico *</label>
              <input type="email" id="cw-email" required autocomplete="email" />
            </div>
            <div class="cw-field-group">
              <label for="cw-phone">Celular / WhatsApp *</label>
              <input type="tel" id="cw-phone" required autocomplete="tel" />
            </div>
          </div>
          <div class="cw-field-group">
            <label for="cw-emergency_contact">Contacto de emergencia (nombre y teléfono) *</label>
            <input type="text" id="cw-emergency_contact" required />
          </div>
          <div class="cw-field-group">
            <label for="cw-special_requests">Solicitudes especiales (dieta, movilidad, medicamentos…)</label>
            <textarea id="cw-special_requests" rows="2"></textarea>
          </div>
          <label class="cw-checkbox-line">
            <input type="checkbox" id="cw-accept_policy" required />
            Acepto las políticas de reservas, pagos y cancelaciones.
          </label>
          <div class="cw-panel__actions">
            <button type="button" class="cw-cta cw-cta--ghost" id="cw-back">Volver</button>
            <button type="submit" class="cw-cta" id="cw-submit-contact">Enviar prereserva</button>
          </div>
          <p class="cw-form-error" id="cw-form-error" role="alert"></p>
        </form>
      </div>

      <div class="cw-panel cw-panel--done" id="cw-done-panel" hidden>
        <div class="cw-done-icon">✓</div>
        <h3>¡Tu prereserva fue generada!</h3>
        <p>Te enviamos un correo con el resumen. En cuanto confirmemos disponibilidad con el operador, te llegará otro correo con los medios de pago.</p>
        <p class="cw-done-ref">N.º de solicitud: <strong id="cw-done-ref-code">—</strong></p>
        <button type="button" class="cw-cta cw-cta--ghost" id="cw-new-quote">Hacer otra cotización</button>
      </div>
    `;
  }

  function paxColumn(key, label, caption) {
    return `
      <div>
        <span class="cw-stepper__label">${label}</span>
        ${caption ? `<span class="cw-stepper__caption">${caption}</span>` : `<span class="cw-stepper__caption">&nbsp;</span>`}
        <div class="cw-stepper__control">
          <button type="button" class="cw-stepper__btn" data-target="${key}" data-delta="-1" aria-label="Menos ${label.toLowerCase()}">−</button>
          <span class="cw-stepper__value" id="cw-${key}-value">${state[key]}</span>
          <button type="button" class="cw-stepper__btn" data-target="${key}" data-delta="1" aria-label="Más ${label.toLowerCase()}">+</button>
        </div>
      </div>`;
  }

  // ---------------------------------------------------------------------
  // Datos: Supabase si está configurado, si no, data.js local
  // ---------------------------------------------------------------------
  async function loadData() {
    const cfg = window.APP_CONFIG || {};
    if (cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && window.supabase) {
      try {
        state.supabase = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
        const { data: tiersRows, error: tiersErr } = await state.supabase.from("pricing_tiers").select("*");
        if (tiersErr) throw tiersErr;
        const { data: depRows, error: depErr } = await state.supabase
          .from("departures").select("*").eq("active", true).order("salida", { ascending: true });
        if (depErr) throw depErr;
        state.tiers = Object.fromEntries(tiersRows.map((t) => [t.id, t]));
        state.departures = depRows;
        return;
      } catch (err) {
        console.warn("No se pudo cargar Supabase, usando datos locales de respaldo.", err);
      }
    }
    state.tiers = window.PRICING_TIERS;
    state.departures = window.DEPARTURES.slice().sort((a, b) => a.salida.localeCompare(b.salida));
  }

  function minPriceForTier(tier) {
    if (!tier) return null;
    const candidates = [tier.doble, tier.triple, tier.cuadruple, tier.quintuple].filter((v) => v != null);
    return candidates.length ? Math.min(...candidates) : tier.sencilla;
  }

  function renderDepartureOptions(root) {
    const select = root.querySelector("#cw-departure");
    state.departures.forEach((dep) => {
      const tier = state.tiers[dep.tier];
      const opt = document.createElement("option");
      opt.value = dep.id;
      opt.textContent = `${dep.etiqueta} · ${tier ? tier.noches : "?"} noches · desde ${money(minPriceForTier(tier))}`;
      select.appendChild(opt);
    });
  }

  // ---------------------------------------------------------------------
  // Cálculo de tarifa (reglas del PDF)
  // ---------------------------------------------------------------------
  function calculateQuote(tier, adults, kids, infants) {
    if (!tier) return null;
    const kidsCountAsKids = adults >= 2 ? kids : 0;
    const kidsCountAsAdults = adults >= 2 ? 0 : kids;

    let payingCount = Math.max(1, Math.min(5, adults + kids));
    const category = CATEGORY_BY_COUNT[payingCount];
    let adultUnit = tier[category];

    let overrideNote = "";
    if (adults === 1 && kids === 0 && infants > 0) {
      adultUnit = tier.sencilla;
      overrideNote = "acomodación sencilla (1 adulto + infante)";
    }

    if (adultUnit == null) {
      return { error: `No hay tarifa "${category}" disponible para esta salida. Escríbenos por WhatsApp para armar la acomodación.` };
    }

    const kidUnit = tier.nino;
    const infantUnit = tier.infante;
    const total =
      adults * adultUnit +
      kidsCountAsKids * kidUnit +
      kidsCountAsAdults * adultUnit +
      infants * infantUnit;

    const lines = [];
    lines.push(`${adults} adulto${adults !== 1 ? "s" : ""} × ${money(adultUnit)}${overrideNote ? " · " + overrideNote : " · " + category}`);
    if (kidsCountAsKids > 0) lines.push(`${kidsCountAsKids} niño${kidsCountAsKids !== 1 ? "s" : ""} × ${money(kidUnit)}`);
    if (kidsCountAsAdults > 0) lines.push(`${kidsCountAsAdults} niño${kidsCountAsAdults !== 1 ? "s" : ""} × ${money(adultUnit)} (tarifa de adulto)`);
    if (infants > 0) lines.push(`${infants} infante${infants !== 1 ? "s" : ""} × ${money(infantUnit)}`);

    return { total, category, adultUnit, kidUnit, infantUnit, breakdownLines: lines };
  }

  // ---------------------------------------------------------------------
  // Descriptivo (solo se construye/pinta después de cotizar)
  // ---------------------------------------------------------------------
  function renderPlanDetails(tier, departure) {
    const itineraryKey = tier.itinerario_key || "regular";
    const itinerary = (window.ITINERARIES && window.ITINERARIES[itineraryKey]) || [];
    const noIncluye = window.NO_INCLUYE || [];
    const incluye = tier.incluye || [];

    return `
      <h3 class="cw-plan-details__heading">Este plan incluye — ${departure.etiqueta}</h3>
      <p class="cw-plan-details__meta">${tier.lodging || ""}${tier.meals_note ? " · " + tier.meals_note : ""}</p>

      <div class="cw-plan-details__section">
        <ul class="cw-checklist">
          ${incluye.map((item) => `<li>${item}</li>`).join("")}
        </ul>
        ${tier.special_note ? `<p class="cw-special-note">${tier.special_note}</p>` : ""}
      </div>

      ${itinerary.length ? `
      <div class="cw-plan-details__section">
        <h3 class="cw-plan-details__heading" style="font-size:15px">Itinerario</h3>
        <ol class="cw-itinerary">
          ${itinerary.map((paso) => `
            <li>
              <span class="cw-dia">${paso.dia}</span>
              <span class="cw-titulo">${paso.titulo}</span>
              <span class="cw-detalle">${paso.detalle}</span>
            </li>`).join("")}
        </ol>
      </div>` : ""}

      <div class="cw-plan-details__section">
        <h3 class="cw-plan-details__heading" style="font-size:15px">No incluye</h3>
        <ul class="cw-checklist cw-checklist--no">
          ${noIncluye.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </div>
    `;
  }

  // ---------------------------------------------------------------------
  // Interacción
  // ---------------------------------------------------------------------
  function wireForm(root) {
    const departureSelect = root.querySelector("#cw-departure");
    const submitBtn = root.querySelector("#cw-submit");
    const notaEl = root.querySelector("#cw-departure-nota");

    departureSelect.addEventListener("change", () => {
      state.selectedDeparture = state.departures.find((d) => d.id === departureSelect.value) || null;
      const tier = state.selectedDeparture ? state.tiers[state.selectedDeparture.tier] : null;
      notaEl.textContent = tier?.special_note || "";
      submitBtn.disabled = !state.selectedDeparture;
      hideResult(root);
    });

    root.querySelectorAll(".cw-stepper__btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.target;
        const delta = parseInt(btn.dataset.delta, 10);
        const limits = LIMITS[target];
        state[target] = Math.min(limits.max, Math.max(limits.min, state[target] + delta));
        root.querySelector(`#cw-${target}-value`).textContent = state[target];
        hideResult(root);
      });
    });

    submitBtn.addEventListener("click", () => showResult(root));
  }

  function hideResult(root) {
    root.querySelector("#cw-result-wrap").hidden = true;
    root.querySelector("#cw-contact-panel").hidden = true;
    state.lastQuote = null;
  }

  function showResult(root) {
    const resultWrap = root.querySelector("#cw-result-wrap");
    const pricePanel = root.querySelector("#cw-price-panel");
    const planDetails = root.querySelector("#cw-plan-details");
    const continueBtn = root.querySelector("#cw-continue");

    if (!state.selectedDeparture) return;

    const tier = state.tiers[state.selectedDeparture.tier];
    const quote = calculateQuote(tier, state.adults, state.kids, state.infants);

    resultWrap.hidden = false;

    if (!quote || quote.error) {
      pricePanel.innerHTML = `<p class="cw-price-panel__error">${quote?.error || "No fue posible calcular el valor."}</p>`;
      planDetails.innerHTML = "";
      planDetails.hidden = true;
      continueBtn.hidden = true;
      state.lastQuote = null;
    } else {
      pricePanel.innerHTML = `
        <p class="cw-price-panel__label">Valor total del plan</p>
        <span class="cw-price-panel__amount">${money(quote.total)}</span>
        <p class="cw-price-panel__breakdown">${quote.breakdownLines.join("<br>")}</p>
      `;
      // El descriptivo SOLO se pinta aquí, es decir, solo después de cotizar.
      planDetails.hidden = false;
      planDetails.innerHTML = renderPlanDetails(tier, state.selectedDeparture);
      continueBtn.hidden = false;
      state.lastQuote = quote;
    }
    resultWrap.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function wireNavigation(root) {
    root.querySelector("#cw-continue").addEventListener("click", () => {
      root.querySelector("#cw-contact-panel").hidden = false;
      root.querySelector("#cw-contact-panel").scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
    root.querySelector("#cw-back").addEventListener("click", () => {
      root.querySelector("#cw-contact-panel").hidden = true;
    });
    root.querySelector("#cw-new-quote").addEventListener("click", () => {
      root.querySelector("#cw-done-panel").hidden = true;
      root.querySelector("#cw-result-wrap").hidden = true;
      root.querySelector("#cw-contact-form").reset();
      root.querySelector(".cw-ticket").hidden = false;
      root.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function generateLocalRefCode() {
    const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    return `EC-${date}-${rand}`;
  }

  function wireContactForm(root) {
    root.querySelector("#cw-contact-form").addEventListener("submit", async (evt) => {
      evt.preventDefault();
      const errorEl = root.querySelector("#cw-form-error");
      errorEl.textContent = "";

      if (!state.lastQuote || !state.selectedDeparture) {
        errorEl.textContent = "Selecciona una fecha y la cantidad de pasajeros antes de continuar.";
        return;
      }

      const val = (id) => root.querySelector(id).value.trim();
      const payload = {
        destination_slug: "eje-cafetero",
        departure_id: state.selectedDeparture.id,
        departure_label: state.selectedDeparture.etiqueta,
        tier_id: state.selectedDeparture.tier,
        adults: state.adults,
        kids: state.kids,
        infants: state.infants,
        total_price: state.lastQuote.total,
        price_breakdown: state.lastQuote.breakdownLines.join(" | "),
        full_name: val("#cw-full_name"),
        document_id: val("#cw-document_id"),
        email: val("#cw-email"),
        phone: val("#cw-phone"),
        emergency_contact: val("#cw-emergency_contact"),
        special_requests: val("#cw-special_requests"),
        status: "pendiente",
      };

      if (!payload.full_name || !payload.document_id || !payload.email || !payload.phone || !payload.emergency_contact) {
        errorEl.textContent = "Por favor completa todos los campos obligatorios (*).";
        return;
      }
      if (!root.querySelector("#cw-accept_policy").checked) {
        errorEl.textContent = "Debes aceptar las políticas de reservas para continuar.";
        return;
      }

      const submitBtn = root.querySelector("#cw-submit-contact");
      submitBtn.disabled = true;
      submitBtn.textContent = "Enviando…";

      let refCode = generateLocalRefCode();
      try {
        if (state.supabase) {
          const { data, error } = await state.supabase.from("prereservations").insert(payload).select().single();
          if (error) throw error;
          refCode = data.id;
        } else {
          console.info("[DEMO] Prereserva (sin Supabase configurado):", payload);
        }

        const webhookUrl = window.APP_CONFIG?.N8N_PRERESERVA_WEBHOOK_URL;
        if (webhookUrl) {
          fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...payload, ref_code: refCode }),
          }).catch((e) => console.warn("No se pudo notificar a n8n directamente:", e));
        }

        root.querySelector("#cw-done-ref-code").textContent = refCode;
        root.querySelector(".cw-ticket").hidden = true;
        root.querySelector("#cw-result-wrap").hidden = true;
        root.querySelector("#cw-contact-panel").hidden = true;
        root.querySelector("#cw-done-panel").hidden = false;
        root.querySelector("#cw-done-panel").scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (err) {
        console.error(err);
        errorEl.textContent = "No pudimos enviar tu prereserva. Intenta de nuevo o escríbenos por WhatsApp.";
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Enviar prereserva";
      }
    });
  }

  // ---------------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------------
  async function init() {
    const root = document.getElementById(MOUNT_ID);
    if (!root) {
      console.warn(`app.js: no se encontró #${MOUNT_ID} en la página.`);
      return;
    }
    root.classList.add("cw");
    root.innerHTML = buildMarkup();

    await loadData();
    renderDepartureOptions(root);
    wireForm(root);
    wireNavigation(root);
    wireContactForm(root);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
