/**
 * data.js
 * Datos del cotizador "Eje Cafetero Recargado 2026-2027".
 * Es la MISMA información que vive en Supabase (tabla pricing_tiers + departures).
 * Sirve de respaldo local (modo demo) y de fuente para sembrar la base de datos.
 *
 * Cada tarifario (tier) trae, además del precio, el detalle específico de esa
 * salida: qué incluye, cómo es el alojamiento/alimentación, notas especiales
 * y qué itinerario le aplica. Esto es lo que se muestra en el "descriptivo"
 * DESPUÉS de cotizar — porque no todas las salidas incluyen lo mismo
 * (ej: Fin de Año trae cena especial y paseo a caballo, Semana de Receso no
 * trae cócteles, Festival de Velas tiene una restricción de toque de queda).
 */

// ---------------------------------------------------------------------------
// Lo que NUNCA incluye ninguna salida (igual en todo el PDF)
// ---------------------------------------------------------------------------
const NO_INCLUYE = [
  "Gastos no especificados en el plan",
  "Gastos de índole personal",
  "Ingreso a ningún mirador",
];

// ---------------------------------------------------------------------------
// Itinerarios (solo existen 2 variantes en el PDF)
// ---------------------------------------------------------------------------
const ITINERARIES = {
  regular: [
    { dia: "Día 1", titulo: "Inicia la aventura", detalle: "Encuentro en el Centro Comercial Outlet Factory (entrada 3), 9:00 p.m. Salida desde Bogotá con destino al Eje Cafetero." },
    { dia: "Día 2", titulo: "Termales de Santa Rosa & Bioparque Ukumarí", detalle: "Desayuno, Termales de Santa Rosa de Cabal y Bioparque Ukumarí. Check-in en la finca hotel, cena y cócteles." },
    { dia: "Día 3", titulo: "Salento, Valle del Cócora & Filandia", detalle: "Bajada en jeep Willys al Valle del Cócora, tiempo libre en Salento (almuerzo por cuenta del pasajero) y visita a Filandia. Regreso a la finca para la cena." },
    { dia: "Día 4", titulo: "Parque del Café & Quimbaya", detalle: "Parque del Café con pasaporte múltiple y recorrido por las calles de Quimbaya. Cena y cócteles en la finca." },
    { dia: "Día 5", titulo: "Regreso a Bogotá", detalle: "Tiempo libre en la finca, almuerzo incluido, check-out y regreso a Bogotá." },
  ],
  findeanio: [
    { dia: "Día 1 · 29 dic", titulo: "Inicia la aventura", detalle: "Encuentro en el Centro Comercial Outlet Factory (entrada 3), 9:00 p.m. Salida desde Bogotá con destino al Eje Cafetero." },
    { dia: "Día 2 · 30 dic", titulo: "Termales de Santa Rosa & Bioparque Ukumarí", detalle: "Desayuno, Termales de Santa Rosa de Cabal y Bioparque Ukumarí. Check-in en la finca hotel, cena y cócteles." },
    { dia: "Día 3 · 31 dic", titulo: "Salento, Valle del Cócora & Filandia", detalle: "Jeep al Valle del Cócora, tiempo libre en Salento y visita a Filandia. Regreso a la finca para la cena especial de fin de año (entrada, plato fuerte y postre) y cócteles." },
    { dia: "Día 4 · 01 ene", titulo: "Paseo a caballo", detalle: "Tiempo libre en la finca, almuerzo incluido y paseo a caballo (20 minutos). Cena y cócteles." },
    { dia: "Día 5 · 02 ene", titulo: "Parque del Café & Quimbaya", detalle: "Parque del Café con pasaporte múltiple y recorrido por Quimbaya. Cena y cócteles." },
    { dia: "Día 6 · 03 ene", titulo: "Regreso a Bogotá", detalle: "Tiempo libre en la finca, almuerzo incluido, check-out y regreso a Bogotá." },
  ],
};

// ---------------------------------------------------------------------------
// TARIFARIOS (pricing_tiers) — precio + detalle de cada salida
// ---------------------------------------------------------------------------
const PRICING_TIERS = {
  tb2026: {
    id: "tb2026",
    nombre: "Temporada baja 2026",
    noches: 3,
    sencilla: 1399000, doble: 1199000, triple: 1099000, cuadruple: 1099000, quintuple: 1099000,
    nino: 1049000, infante: 70000,
    lodging: "Habitación privada con TV, toallas y baño",
    meals_note: "4 desayunos, 3 cenas y 1 almuerzo",
    incluye: [
      "Transporte terrestre en bus, van o vehículo particular según el número de pasajeros",
      "3 noches de alojamiento en habitación privada con TV, toallas y baño",
      "4 desayunos, 3 cenas y 1 almuerzo",
      "Ingreso a las Termales de Santa Rosa de Cabal",
      "Ingreso al Bioparque Ukumarí",
      "Recorrido en Jeep Willys hacia el Valle del Cócora",
      "Visita a Salento, Filandia y Quimbaya",
      "Ingreso al Parque del Café con pasaporte múltiple",
      "2 horas de cócteles seleccionados ilimitados (8:00 p.m. a 10:00 p.m., no cervezas). Aplican condiciones y restricciones",
      "Guía profesional de turismo y asistencia médica durante el recorrido",
      "Obsequio: paseo a caballo en el hotel",
    ],
    special_note: "Salidas cerradas en 2026: 17 al 21 de junio · 01 al 05, 08 al 12 y 22 al 26 de julio.",
    itinerario_key: "regular",
  },
  puentes2026: {
    id: "puentes2026",
    nombre: "Puente festivo 2026",
    noches: 3,
    sencilla: 1399000, doble: 1199000, triple: 1099000, cuadruple: 1099000, quintuple: 1099000,
    nino: 1049000, infante: 70000,
    lodging: "Habitación privada con TV, toallas y baño",
    meals_note: "4 desayunos, 3 cenas y 1 almuerzo",
    incluye: [
      "Transporte terrestre en bus, van o vehículo particular según el número de pasajeros",
      "3 noches de alojamiento en habitación privada con TV, toallas y baño",
      "4 desayunos, 3 cenas y 1 almuerzo",
      "Ingreso a las Termales de Santa Rosa de Cabal",
      "Ingreso al Bioparque Ukumarí",
      "Recorrido en Jeep Willys hacia el Valle del Cócora",
      "Visita a Salento, Filandia y Quimbaya",
      "Ingreso al Parque del Café con pasaporte múltiple",
      "2 horas de cócteles seleccionados ilimitados (8:00 p.m. a 10:00 p.m., no cervezas). Aplican condiciones y restricciones",
      "Guía profesional de turismo y asistencia médica durante el recorrido",
      "Obsequio: paseo a caballo en el hotel",
    ],
    special_note: "Salida de puente festivo: jueves a lunes festivo.",
    itinerario_key: "regular",
  },
  receso2026: {
    id: "receso2026",
    nombre: "Semana de receso",
    noches: 3,
    sencilla: 1499000, doble: 1299000, triple: 1199000, cuadruple: 1199000, quintuple: 1199000,
    nino: 1149000, infante: 70000,
    lodging: "Finca hotel con piscina, habitación privada con TV, baño y toallas",
    meals_note: "4 desayunos, 3 cenas y 1 almuerzo",
    incluye: [
      "Transporte terrestre en bus, van o vehículo particular según el número de pasajeros",
      "3 noches de alojamiento en finca hotel con piscina, habitación privada con TV, baño y toallas",
      "4 desayunos, 3 cenas y 1 almuerzo",
      "Ingreso a las Termales de Santa Rosa de Cabal",
      "Ingreso al Bioparque Ukumarí",
      "Recorrido en Jeep Willys hacia el Valle del Cócora",
      "Visita a Salento, Filandia y Quimbaya",
      "Ingreso al Parque del Café con pasaporte múltiple",
      "Guía profesional de turismo y asistencia médica durante el recorrido",
      "Obsequio: paseo a caballo en el hotel",
    ],
    special_note: null,
    itinerario_key: "regular",
  },
  velas2026: {
    id: "velas2026",
    nombre: "Festival de Velas y Faroles",
    noches: 3,
    sencilla: 1499000, doble: 1299000, triple: 1199000, cuadruple: 1199000, quintuple: 1199000,
    nino: 1149000, infante: 70000,
    lodging: "Finca hotel con piscina, habitación privada con TV, baño y toallas",
    meals_note: "4 desayunos, 3 cenas y 1 almuerzo",
    incluye: [
      "Transporte terrestre en bus, van o vehículo particular según el número de pasajeros",
      "3 noches de alojamiento en finca hotel con piscina, habitación privada con TV, baño y toallas",
      "4 desayunos, 3 cenas y 1 almuerzo",
      "Ingreso a las Termales de Santa Rosa de Cabal",
      "Ingreso al Bioparque Ukumarí",
      "Recorrido en Jeep Willys hacia el Valle del Cócora",
      "Visita a Salento, Filandia y Quimbaya",
      "Ingreso al Parque del Café con pasaporte múltiple",
      "Salida el 7 de diciembre a Quimbaya al Festival de Velas y Faroles",
      "Guía profesional de turismo y asistencia médica durante el recorrido",
      "Obsequio: paseo a caballo en el hotel",
    ],
    special_note: "Por el toque de queda que decreta la alcaldía de Quimbaya durante el festival, el bus se queda a la entrada del pueblo: se debe entrar y salir caminando. No se hace la salida del 02 de diciembre.",
    itinerario_key: "regular",
  },
  navidad2026: {
    id: "navidad2026",
    nombre: "Navidad",
    noches: 3,
    sencilla: 1649000, doble: 1449000, triple: 1349000, cuadruple: 1349000, quintuple: 1349000,
    nino: 1299000, infante: 70000,
    lodging: "Finca Hotel Nuestro Sueño, habitación privada con TV, baño y toallas",
    meals_note: "4 desayunos, 3 cenas y 1 almuerzo",
    incluye: [
      "Transporte terrestre en bus, van o vehículo particular según el número de pasajeros",
      "3 noches de alojamiento en Finca Hotel Nuestro Sueño, habitación privada con TV, baño y toallas",
      "4 desayunos, 3 cenas y 1 almuerzo",
      "Ingreso a las Termales de Santa Rosa de Cabal",
      "Ingreso al Bioparque Ukumarí",
      "Recorrido en Jeep Willys hacia el Valle del Cócora",
      "Visita a Salento, Filandia y Quimbaya",
      "Ingreso al Parque del Café con pasaporte múltiple",
      "2 horas de cócteles seleccionados ilimitados (8:00 p.m. a 10:00 p.m., no cervezas). Aplican condiciones y restricciones",
      "Guía profesional de turismo y asistencia médica durante el recorrido",
      "Obsequio: paseo a caballo en el hotel",
    ],
    special_note: null,
    itinerario_key: "regular",
  },
  prefin2026: {
    id: "prefin2026",
    nombre: "Pre fin de año",
    noches: 3,
    sencilla: 1649000, doble: 1449000, triple: 1349000, cuadruple: 1349000, quintuple: 1349000,
    nino: 1299000, infante: 70000,
    lodging: "Finca Hotel Nuestro Sueño, habitación privada con TV, baño y toallas",
    meals_note: "4 desayunos, 3 cenas y 1 almuerzo",
    incluye: [
      "Transporte terrestre en bus, van o vehículo particular según el número de pasajeros",
      "3 noches de alojamiento en Finca Hotel Nuestro Sueño, habitación privada con TV, baño y toallas",
      "4 desayunos, 3 cenas y 1 almuerzo",
      "Ingreso a las Termales de Santa Rosa de Cabal",
      "Ingreso al Bioparque Ukumarí",
      "Recorrido en Jeep Willys hacia el Valle del Cócora",
      "Visita a Salento, Filandia y Quimbaya",
      "Ingreso al Parque del Café con pasaporte múltiple",
      "2 horas de cócteles seleccionados ilimitados (8:00 p.m. a 10:00 p.m., no cervezas). Aplican condiciones y restricciones",
      "Guía profesional de turismo y asistencia médica durante el recorrido",
      "Obsequio: paseo a caballo en el hotel",
    ],
    special_note: "Salida sábado a miércoles.",
    itinerario_key: "regular",
  },
  findeanio2026: {
    id: "findeanio2026",
    nombre: "Fin de año",
    noches: 4,
    sencilla: null, doble: 1849000, triple: 1749000, cuadruple: 1749000, quintuple: 1749000,
    nino: 1699000, infante: 80000,
    lodging: "Finca Hotel Nuestro Sueño, habitación privada con TV, baño y toallas",
    meals_note: "5 desayunos, 4 cenas y 2 almuerzos. La noche del 31 de diciembre incluye una cena especial de tres tiempos (entrada, plato fuerte y postre).",
    incluye: [
      "Transporte terrestre en bus, van o vehículo particular según el número de pasajeros",
      "4 noches de alojamiento en Finca Hotel Nuestro Sueño, habitación privada con TV, baño y toallas",
      "5 desayunos, 4 cenas y 2 almuerzos",
      "Cena especial de tres tiempos la noche del 31 de diciembre (entrada, plato fuerte y postre)",
      "Ingreso a las Termales de Santa Rosa de Cabal",
      "Ingreso al Bioparque Ukumarí",
      "Recorrido en Jeep Willys hacia el Valle del Cócora",
      "Visita a Salento, Valle del Cócora, Filandia y Quimbaya",
      "Ingreso al Parque del Café con pasaporte múltiple",
      "2 horas de cócteles seleccionados ilimitados (8:00 p.m. a 10:00 p.m., no cervezas). Aplican condiciones y restricciones",
      "Guía profesional de turismo y asistencia médica durante el recorrido",
      "Obsequio: paseo a caballo en el hotel",
    ],
    special_note: "¡Últimos cupos en acomodación múltiple! Esta salida no tiene tarifa sencilla.",
    itinerario_key: "findeanio",
  },
  prereyes2027: {
    id: "prereyes2027",
    nombre: "Pre reyes",
    noches: 3,
    sencilla: 1649000, doble: 1449000, triple: 1349000, cuadruple: 1349000, quintuple: 1349000,
    nino: 1299000, infante: 70000,
    lodging: "Finca Hotel Nuestro Sueño, habitación privada con TV, baño y toallas",
    meals_note: "4 desayunos, 3 cenas y 1 almuerzo",
    incluye: [
      "Transporte terrestre en bus, van o vehículo particular según el número de pasajeros",
      "3 noches de alojamiento en Finca Hotel Nuestro Sueño, habitación privada con TV, baño y toallas",
      "4 desayunos, 3 cenas y 1 almuerzo",
      "Ingreso a las Termales de Santa Rosa de Cabal",
      "Ingreso al Bioparque Ukumarí",
      "Recorrido en Jeep Willys hacia el Valle del Cócora",
      "Visita a Salento, Valle del Cócora, Filandia y Quimbaya",
      "Ingreso al Parque del Café con pasaporte múltiple",
      "2 horas de cócteles seleccionados ilimitados (8:00 p.m. a 10:00 p.m., no cervezas). Aplican condiciones y restricciones",
      "Guía profesional de turismo y asistencia médica durante el recorrido",
      "Obsequio: paseo a caballo en el hotel",
    ],
    special_note: "Salida domingo a jueves.",
    itinerario_key: "regular",
  },
  reyes2027: {
    id: "reyes2027",
    nombre: "Reyes",
    noches: 3,
    sencilla: 1649000, doble: 1449000, triple: 1349000, cuadruple: 1349000, quintuple: 1349000,
    nino: 1299000, infante: 70000,
    lodging: "Finca Hotel Nuestro Sueño, habitación privada con TV, baño y toallas",
    meals_note: "4 desayunos, 3 cenas y 1 almuerzo",
    incluye: [
      "Transporte terrestre en bus, van o vehículo particular según el número de pasajeros",
      "3 noches de alojamiento en Finca Hotel Nuestro Sueño, habitación privada con TV, baño y toallas",
      "4 desayunos, 3 cenas y 1 almuerzo",
      "Ingreso a las Termales de Santa Rosa de Cabal",
      "Ingreso al Bioparque Ukumarí",
      "Recorrido en Jeep Willys hacia el Valle del Cócora",
      "Visita a Salento, Valle del Cócora, Filandia y Quimbaya",
      "Ingreso al Parque del Café con pasaporte múltiple",
      "2 horas de cócteles seleccionados ilimitados (8:00 p.m. a 10:00 p.m., no cervezas). Aplican condiciones y restricciones",
      "Guía profesional de turismo y asistencia médica durante el recorrido",
      "Obsequio: paseo a caballo en el hotel",
    ],
    special_note: "Puente festivo: jueves a lunes festivo.",
    itinerario_key: "regular",
  },
  tb2027: {
    id: "tb2027",
    nombre: "Temporada baja 2027",
    noches: 3,
    sencilla: 1499000, doble: 1299000, triple: 1199000, cuadruple: 1199000, quintuple: 1199000,
    nino: 1149000, infante: 70000,
    lodging: "Finca Hotel Nuestro Sueño, habitación privada con TV, baño y toallas",
    meals_note: "4 desayunos, 3 cenas y 1 almuerzo",
    incluye: [
      "Transporte terrestre en bus, van o vehículo particular según el número de pasajeros",
      "3 noches de alojamiento en Finca Hotel Nuestro Sueño, habitación privada con TV, baño y toallas",
      "4 desayunos, 3 cenas y 1 almuerzo",
      "Ingreso a las Termales de Santa Rosa de Cabal",
      "Ingreso al Bioparque Ukumarí",
      "Recorrido en Jeep Willys hacia el Valle del Cócora",
      "Visita a Salento, Valle del Cócora, Filandia y Quimbaya",
      "Ingreso al Parque del Café con pasaporte múltiple",
      "2 horas de cócteles seleccionados ilimitados (8:00 p.m. a 10:00 p.m., no cervezas). Aplican condiciones y restricciones",
      "Guía profesional de turismo y asistencia médica durante el recorrido",
      "Obsequio: paseo a caballo en el hotel",
    ],
    special_note: null,
    itinerario_key: "regular",
  },
};

// ---------------------------------------------------------------------------
// SALIDAS (departures) — fechas FIJAS de salida
// ---------------------------------------------------------------------------
const DEPARTURES = [
  { id: "dep-receso-2026", tier: "receso2026", etiqueta: "08 al 12 de octubre de 2026", salida: "2026-10-08", regreso: "2026-10-12" },
  { id: "dep-velas-2026", tier: "velas2026", etiqueta: "04 al 08 de diciembre de 2026", salida: "2026-12-04", regreso: "2026-12-08" },
  { id: "dep-navidad-2026", tier: "navidad2026", etiqueta: "23 al 27 de diciembre de 2026", salida: "2026-12-23", regreso: "2026-12-27" },
  { id: "dep-prefin-2026", tier: "prefin2026", etiqueta: "26 al 30 de diciembre de 2026", salida: "2026-12-26", regreso: "2026-12-30" },
  { id: "dep-findeanio-2026", tier: "findeanio2026", etiqueta: "29 de diciembre al 03 de enero de 2027", salida: "2026-12-29", regreso: "2027-01-03" },
  { id: "dep-prereyes-2027", tier: "prereyes2027", etiqueta: "03 al 07 de enero de 2027", salida: "2027-01-03", regreso: "2027-01-07" },
  { id: "dep-reyes-2027", tier: "reyes2027", etiqueta: "07 al 11 de enero de 2027", salida: "2027-01-07", regreso: "2027-01-11" },
  { id: "dep-tb-2026-09-16", tier: "tb2026", etiqueta: "16 al 20 de septiembre de 2026", salida: "2026-09-16", regreso: "2026-09-20" },
  { id: "dep-tb-2026-09-30", tier: "tb2026", etiqueta: "30 sep. al 04 de octubre de 2026", salida: "2026-09-30", regreso: "2026-10-04" },
  { id: "dep-tb-2026-10-14", tier: "tb2026", etiqueta: "14 al 18 de octubre de 2026", salida: "2026-10-14", regreso: "2026-10-18" },
  { id: "dep-tb-2026-11-11", tier: "tb2026", etiqueta: "11 al 15 de noviembre de 2026", salida: "2026-11-11", regreso: "2026-11-15" },
  { id: "dep-tb-2027-01-20", tier: "tb2027", etiqueta: "20 al 24 de enero de 2027", salida: "2027-01-20", regreso: "2027-01-24" },
];

window.NO_INCLUYE = NO_INCLUYE;
window.ITINERARIES = ITINERARIES;
window.PRICING_TIERS = PRICING_TIERS;
window.DEPARTURES = DEPARTURES;
