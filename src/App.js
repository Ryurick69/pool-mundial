import React, { useState, useEffect, useCallback } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";

// ─── FIREBASE CONFIG ──────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyCE508Z32exSEYZ07hYE7IUEPXsSuUltlQ",
  authDomain: "pool-mundial-2026-f1fb5.firebaseapp.com",
  projectId: "pool-mundial-2026-f1fb5",
  storageBucket: "pool-mundial-2026-f1fb5.firebasestorage.app",
  messagingSenderId: "383275674762",
  appId: "1:383275674762:web:f284cbfb7d2e686b119173"
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// ─── FIREBASE HELPERS ─────────────────────────────────────────────────────
async function fbGet(coleccion, id) {
  try {
    const snap = await getDoc(doc(db, coleccion, id));
    return snap.exists() ? snap.data() : null;
  } catch { return null; }
}
async function fbSet(coleccion, id, data) {
  try {
    await setDoc(doc(db, coleccion, id), data, { merge: true });
    return true;
  } catch { return false; }
}
async function fbGetAll(coleccion) {
  try {
    const snap = await getDocs(collection(db, coleccion));
    const result = {};
    snap.forEach(d => { result[d.id] = d.data(); });
    return result;
  } catch { return {}; }
}

// ─── DATOS DEL MUNDIAL 2026 (OFICIAL FIFA) ────────────────────────────────
const GRUPOS = {
  A: ["México", "Sudáfrica", "Corea del Sur", "Chequia"],
  B: ["Canadá", "Bosnia", "Qatar", "Suiza"],
  C: ["Brasil", "Marruecos", "Haití", "Escocia"],
  D: ["Estados Unidos", "Paraguay", "Australia", "Turquía"],
  E: ["Alemania", "Curazao", "Costa de Marfil", "Ecuador"],
  F: ["Países Bajos", "Japón", "Suecia", "Túnez"],
  G: ["Bélgica", "Egipto", "Irán", "Nueva Zelanda"],
  H: ["España", "Cabo Verde", "Arabia Saudita", "Uruguay"],
  I: ["Francia", "Senegal", "Irak", "Noruega"],
  J: ["Argentina", "Argelia", "Austria", "Jordania"],
  K: ["Portugal", "Congo DR", "Uzbekistán", "Colombia"],
  L: ["Inglaterra", "Croacia", "Ghana", "Panamá"],
};

const FLAG_EMOJI = {
  "México": "🇲🇽", "Sudáfrica": "🇿🇦", "Corea del Sur": "🇰🇷", "Chequia": "🇨🇿",
  "Canadá": "🇨🇦", "Bosnia": "🇧🇦", "Qatar": "🇶🇦", "Suiza": "🇨🇭",
  "Brasil": "🇧🇷", "Marruecos": "🇲🇦", "Haití": "🇭🇹", "Escocia": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "Estados Unidos": "🇺🇸", "Paraguay": "🇵🇾", "Australia": "🇦🇺", "Turquía": "🇹🇷",
  "Alemania": "🇩🇪", "Curazao": "🇨🇼", "Costa de Marfil": "🇨🇮", "Ecuador": "🇪🇨",
  "Países Bajos": "🇳🇱", "Japón": "🇯🇵", "Suecia": "🇸🇪", "Túnez": "🇹🇳",
  "Bélgica": "🇧🇪", "Egipto": "🇪🇬", "Irán": "🇮🇷", "Nueva Zelanda": "🇳🇿",
  "España": "🇪🇸", "Cabo Verde": "🇨🇻", "Arabia Saudita": "🇸🇦", "Uruguay": "🇺🇾",
  "Francia": "🇫🇷", "Senegal": "🇸🇳", "Irak": "🇮🇶", "Noruega": "🇳🇴",
  "Argentina": "🇦🇷", "Argelia": "🇩🇿", "Austria": "🇦🇹", "Jordania": "🇯🇴",
  "Portugal": "🇵🇹", "Congo DR": "🇨🇩", "Uzbekistán": "🇺🇿", "Colombia": "🇨🇴",
  "Inglaterra": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Croacia": "🇭🇷", "Ghana": "🇬🇭", "Panamá": "🇵🇦",
};

const PARTIDOS_BASE = [
  { id: "A1", grupo: "A", local: "México",        visitante: "Sudáfrica",     fecha: "2026-06-11T19:00:00Z", sede: "Estadio Azteca, Ciudad de México" },
  { id: "A2", grupo: "A", local: "Corea del Sur", visitante: "Chequia",       fecha: "2026-06-12T02:00:00Z", sede: "Estadio Akron, Guadalajara" },
  { id: "A3", grupo: "A", local: "Chequia",        visitante: "Sudáfrica",    fecha: "2026-06-18T16:00:00Z", sede: "Mercedes-Benz Stadium, Atlanta" },
  { id: "A4", grupo: "A", local: "México",         visitante: "Corea del Sur",fecha: "2026-06-19T02:00:00Z", sede: "Estadio Akron, Guadalajara" },
  { id: "A5", grupo: "A", local: "Chequia",        visitante: "México",       fecha: "2026-06-25T01:00:00Z", sede: "Estadio Azteca, Ciudad de México" },
  { id: "A6", grupo: "A", local: "Sudáfrica",      visitante: "Corea del Sur",fecha: "2026-06-25T01:00:00Z", sede: "Estadio Monterrey, Guadalupe" },
  { id: "B1", grupo: "B", local: "Canadá",  visitante: "Bosnia",  fecha: "2026-06-12T19:00:00Z", sede: "BMO Field, Toronto" },
  { id: "B2", grupo: "B", local: "Qatar",   visitante: "Suiza",   fecha: "2026-06-13T19:00:00Z", sede: "Levi's Stadium, San Francisco" },
  { id: "B3", grupo: "B", local: "Suiza",   visitante: "Bosnia",  fecha: "2026-06-18T19:00:00Z", sede: "SoFi Stadium, Los Ángeles" },
  { id: "B4", grupo: "B", local: "Canadá",  visitante: "Qatar",   fecha: "2026-06-18T22:00:00Z", sede: "BC Place, Vancouver" },
  { id: "B5", grupo: "B", local: "Suiza",   visitante: "Canadá",  fecha: "2026-06-24T19:00:00Z", sede: "BC Place, Vancouver" },
  { id: "B6", grupo: "B", local: "Bosnia",  visitante: "Qatar",   fecha: "2026-06-24T19:00:00Z", sede: "Lumen Field, Seattle" },
  { id: "C1", grupo: "C", local: "Brasil",    visitante: "Marruecos", fecha: "2026-06-13T22:00:00Z", sede: "MetLife Stadium, Nueva Jersey" },
  { id: "C2", grupo: "C", local: "Haití",     visitante: "Escocia",   fecha: "2026-06-14T01:00:00Z", sede: "Gillette Stadium, Boston" },
  { id: "C3", grupo: "C", local: "Escocia",   visitante: "Marruecos", fecha: "2026-06-19T22:00:00Z", sede: "Gillette Stadium, Boston" },
  { id: "C4", grupo: "C", local: "Brasil",    visitante: "Haití",     fecha: "2026-06-20T01:00:00Z", sede: "Lincoln Financial Field, Filadelfia" },
  { id: "C5", grupo: "C", local: "Escocia",   visitante: "Brasil",    fecha: "2026-06-24T22:00:00Z", sede: "Hard Rock Stadium, Miami" },
  { id: "C6", grupo: "C", local: "Marruecos", visitante: "Haití",     fecha: "2026-06-24T22:00:00Z", sede: "Mercedes-Benz Stadium, Atlanta" },
  { id: "D1", grupo: "D", local: "Estados Unidos", visitante: "Paraguay",       fecha: "2026-06-13T01:00:00Z", sede: "SoFi Stadium, Los Ángeles" },
  { id: "D2", grupo: "D", local: "Australia",      visitante: "Turquía",        fecha: "2026-06-14T04:00:00Z", sede: "BC Place, Vancouver" },
  { id: "D3", grupo: "D", local: "Estados Unidos", visitante: "Australia",      fecha: "2026-06-19T19:00:00Z", sede: "Lumen Field, Seattle" },
  { id: "D4", grupo: "D", local: "Turquía",        visitante: "Paraguay",       fecha: "2026-06-20T03:00:00Z", sede: "Levi's Stadium, San Francisco" },
  { id: "D5", grupo: "D", local: "Turquía",        visitante: "Estados Unidos", fecha: "2026-06-26T02:00:00Z", sede: "SoFi Stadium, Los Ángeles" },
  { id: "D6", grupo: "D", local: "Paraguay",       visitante: "Australia",      fecha: "2026-06-26T02:00:00Z", sede: "Levi's Stadium, San Francisco" },
  { id: "E1", grupo: "E", local: "Alemania",        visitante: "Curazao",         fecha: "2026-06-14T17:00:00Z", sede: "NRG Stadium, Houston" },
  { id: "E2", grupo: "E", local: "Costa de Marfil", visitante: "Ecuador",         fecha: "2026-06-14T23:00:00Z", sede: "Lincoln Financial Field, Filadelfia" },
  { id: "E3", grupo: "E", local: "Alemania",        visitante: "Costa de Marfil", fecha: "2026-06-20T20:00:00Z", sede: "BMO Field, Toronto" },
  { id: "E3b", grupo: "E", local: "Curazao",        visitante: "Ecuador",         fecha: "2026-06-21T00:00:00Z", sede: "Arrowhead Stadium, Kansas City" },
  { id: "E4", grupo: "E", local: "Curazao",         visitante: "Costa de Marfil", fecha: "2026-06-25T20:00:00Z", sede: "Lincoln Financial Field, Filadelfia" },
  { id: "E5", grupo: "E", local: "Ecuador",         visitante: "Alemania",        fecha: "2026-06-25T20:00:00Z", sede: "MetLife Stadium, Nueva Jersey" },
  { id: "F1", grupo: "F", local: "Países Bajos", visitante: "Japón",        fecha: "2026-06-14T20:00:00Z", sede: "AT&T Stadium, Dallas" },
  { id: "F2", grupo: "F", local: "Suecia",        visitante: "Túnez",        fecha: "2026-06-15T02:00:00Z", sede: "Estadio BBVA, Monterrey" },
  { id: "F3", grupo: "F", local: "Países Bajos", visitante: "Suecia",       fecha: "2026-06-20T17:00:00Z", sede: "NRG Stadium, Houston" },
  { id: "F3b", grupo: "F", local: "Japón",        visitante: "Túnez",        fecha: "2026-06-21T04:00:00Z", sede: "Estadio BBVA, Monterrey" },
  { id: "F4", grupo: "F", local: "Túnez",         visitante: "Países Bajos", fecha: "2026-06-25T23:00:00Z", sede: "AT&T Stadium, Dallas" },
  { id: "F5", grupo: "F", local: "Japón",          visitante: "Suecia",       fecha: "2026-06-25T23:00:00Z", sede: "Arrowhead Stadium, Kansas City" },
  { id: "G1", grupo: "G", local: "Bélgica",       visitante: "Egipto",        fecha: "2026-06-15T19:00:00Z", sede: "BC Place, Vancouver" },
  { id: "G2", grupo: "G", local: "Irán",           visitante: "Nueva Zelanda", fecha: "2026-06-16T01:00:00Z", sede: "SoFi Stadium, Los Ángeles" },
  { id: "G3", grupo: "G", local: "Bélgica",       visitante: "Irán",          fecha: "2026-06-21T19:00:00Z", sede: "SoFi Stadium, Los Ángeles" },
  { id: "G4", grupo: "G", local: "Nueva Zelanda", visitante: "Egipto",        fecha: "2026-06-22T01:00:00Z", sede: "BC Place, Vancouver" },
  { id: "G5", grupo: "G", local: "Nueva Zelanda", visitante: "Bélgica",       fecha: "2026-06-27T03:00:00Z", sede: "BC Place, Vancouver" },
  { id: "G6", grupo: "G", local: "Egipto",         visitante: "Irán",          fecha: "2026-06-27T03:00:00Z", sede: "Lumen Field, Seattle" },
  { id: "H1", grupo: "H", local: "España",         visitante: "Cabo Verde",    fecha: "2026-06-15T16:00:00Z", sede: "Mercedes-Benz Stadium, Atlanta" },
  { id: "H2", grupo: "H", local: "Arabia Saudita", visitante: "Uruguay",       fecha: "2026-06-15T22:00:00Z", sede: "Hard Rock Stadium, Miami" },
  { id: "H3", grupo: "H", local: "España",         visitante: "Arabia Saudita",fecha: "2026-06-21T16:00:00Z", sede: "Mercedes-Benz Stadium, Atlanta" },
  { id: "H4", grupo: "H", local: "Uruguay",        visitante: "Cabo Verde",    fecha: "2026-06-21T22:00:00Z", sede: "Hard Rock Stadium, Miami" },
  { id: "H5", grupo: "H", local: "Cabo Verde",     visitante: "Arabia Saudita",fecha: "2026-06-27T00:00:00Z", sede: "NRG Stadium, Houston" },
  { id: "H6", grupo: "H", local: "Uruguay",        visitante: "España",        fecha: "2026-06-27T00:00:00Z", sede: "Estadio Akron, Guadalajara" },
  { id: "I1", grupo: "I", local: "Francia",  visitante: "Senegal", fecha: "2026-06-16T19:00:00Z", sede: "MetLife Stadium, Nueva Jersey" },
  { id: "I2", grupo: "I", local: "Irak",     visitante: "Noruega", fecha: "2026-06-16T22:00:00Z", sede: "Gillette Stadium, Boston" },
  { id: "I3", grupo: "I", local: "Francia",  visitante: "Irak",    fecha: "2026-06-22T21:00:00Z", sede: "Lincoln Financial Field, Filadelfia" },
  { id: "I4", grupo: "I", local: "Noruega",  visitante: "Senegal", fecha: "2026-06-23T00:00:00Z", sede: "MetLife Stadium, Nueva Jersey" },
  { id: "I5", grupo: "I", local: "Noruega",  visitante: "Francia", fecha: "2026-06-26T19:00:00Z", sede: "Gillette Stadium, Boston" },
  { id: "I6", grupo: "I", local: "Senegal",  visitante: "Irak",    fecha: "2026-06-26T19:00:00Z", sede: "BMO Field, Toronto" },
  { id: "J1", grupo: "J", local: "Argentina", visitante: "Argelia",   fecha: "2026-06-17T01:00:00Z", sede: "Arrowhead Stadium, Kansas City" },
  { id: "J2", grupo: "J", local: "Austria",   visitante: "Jordania",  fecha: "2026-06-17T04:00:00Z", sede: "Levi's Stadium, San Francisco" },
  { id: "J3", grupo: "J", local: "Argentina", visitante: "Austria",   fecha: "2026-06-22T17:00:00Z", sede: "AT&T Stadium, Dallas" },
  { id: "J4", grupo: "J", local: "Jordania",  visitante: "Argelia",   fecha: "2026-06-23T03:00:00Z", sede: "Levi's Stadium, San Francisco" },
  { id: "J5", grupo: "J", local: "Argelia",   visitante: "Austria",   fecha: "2026-06-28T02:00:00Z", sede: "Arrowhead Stadium, Kansas City" },
  { id: "J6", grupo: "J", local: "Jordania",  visitante: "Argentina", fecha: "2026-06-28T02:00:00Z", sede: "AT&T Stadium, Dallas" },
  { id: "K1", grupo: "K", local: "Portugal",   visitante: "Congo DR",   fecha: "2026-06-17T17:00:00Z", sede: "NRG Stadium, Houston" },
  { id: "K2", grupo: "K", local: "Uzbekistán", visitante: "Colombia",   fecha: "2026-06-18T02:00:00Z", sede: "Estadio Azteca, Ciudad de México" },
  { id: "K3", grupo: "K", local: "Portugal",   visitante: "Uzbekistán", fecha: "2026-06-23T17:00:00Z", sede: "NRG Stadium, Houston" },
  { id: "K4", grupo: "K", local: "Colombia",   visitante: "Congo DR",   fecha: "2026-06-24T02:00:00Z", sede: "Estadio Akron, Guadalajara" },
  { id: "K5", grupo: "K", local: "Colombia",   visitante: "Portugal",   fecha: "2026-06-27T23:30:00Z", sede: "Hard Rock Stadium, Miami" },
  { id: "K6", grupo: "K", local: "Congo DR",   visitante: "Uzbekistán", fecha: "2026-06-27T23:30:00Z", sede: "Mercedes-Benz Stadium, Atlanta" },
  { id: "L1", grupo: "L", local: "Inglaterra", visitante: "Croacia", fecha: "2026-06-17T20:00:00Z", sede: "AT&T Stadium, Dallas" },
  { id: "L2", grupo: "L", local: "Ghana",      visitante: "Panamá",  fecha: "2026-06-17T23:00:00Z", sede: "BMO Field, Toronto" },
  { id: "L3", grupo: "L", local: "Inglaterra", visitante: "Ghana",   fecha: "2026-06-23T20:00:00Z", sede: "Gillette Stadium, Boston" },
  { id: "L4", grupo: "L", local: "Panamá",     visitante: "Croacia", fecha: "2026-06-23T23:00:00Z", sede: "BMO Field, Toronto" },
  { id: "L5", grupo: "L", local: "Panamá",     visitante: "Inglaterra", fecha: "2026-06-27T21:00:00Z", sede: "MetLife Stadium, Nueva Jersey" },
  { id: "L6", grupo: "L", local: "Croacia",    visitante: "Ghana",      fecha: "2026-06-27T21:00:00Z", sede: "Lincoln Financial Field, Filadelfia" },
];

// ─── ELIMINATORIA DE 32 (OCTAVOS DE FINAL) ────────────────────────────────
// IMPORTANTE: el resultado a pronosticar/puntuar es el de 90 minutos + alargue (tiempo extra).
// Los penales NUNCA se consideran para el marcador ni para el punto de ganador/empate.
const PARTIDOS_ELIMINATORIA = [
  { id: "R32_1",  grupo: "R32", local: "Sudáfrica",        visitante: "Canadá",    fecha: "2026-06-28T19:00:00Z", sede: "Por confirmar" },
  { id: "R32_2",  grupo: "R32", local: "Brasil",            visitante: "Japón",     fecha: "2026-06-29T17:00:00Z", sede: "Por confirmar" },
  { id: "R32_3",  grupo: "R32", local: "Alemania",          visitante: "Paraguay",  fecha: "2026-06-29T20:30:00Z", sede: "Por confirmar" },
  { id: "R32_4",  grupo: "R32", local: "Países Bajos",      visitante: "Marruecos", fecha: "2026-06-30T01:00:00Z", sede: "Por confirmar" },
  { id: "R32_5",  grupo: "R32", local: "Costa de Marfil",   visitante: "Noruega",   fecha: "2026-06-30T17:00:00Z", sede: "Por confirmar" },
  { id: "R32_6",  grupo: "R32", local: "Francia",           visitante: "Suecia",    fecha: "2026-06-30T21:00:00Z", sede: "Por confirmar" },
  { id: "R32_7",  grupo: "R32", local: "México",            visitante: "Ecuador",   fecha: "2026-07-01T01:00:00Z", sede: "Por confirmar" },
  { id: "R32_8",  grupo: "R32", local: "Inglaterra",        visitante: "Congo DR",  fecha: "2026-07-01T16:00:00Z", sede: "Por confirmar" },
  { id: "R32_9",  grupo: "R32", local: "Bélgica",           visitante: "Senegal",   fecha: "2026-07-01T20:00:00Z", sede: "Por confirmar" },
  { id: "R32_10", grupo: "R32", local: "Estados Unidos",    visitante: "Bosnia",    fecha: "2026-07-02T00:00:00Z", sede: "Por confirmar" },
  { id: "R32_11", grupo: "R32", local: "España",            visitante: "Austria",   fecha: "2026-07-02T19:00:00Z", sede: "Por confirmar" },
  { id: "R32_12", grupo: "R32", local: "Portugal",          visitante: "Croacia",   fecha: "2026-07-02T23:00:00Z", sede: "Por confirmar" },
  { id: "R32_13", grupo: "R32", local: "Suiza",             visitante: "Argelia",   fecha: "2026-07-03T03:00:00Z", sede: "Por confirmar" },
  { id: "R32_14", grupo: "R32", local: "Australia",         visitante: "Egipto",    fecha: "2026-07-03T18:00:00Z", sede: "Por confirmar" },
  { id: "R32_15", grupo: "R32", local: "Argentina",         visitante: "Cabo Verde",fecha: "2026-07-03T22:00:00Z", sede: "Por confirmar" },
  { id: "R32_16", grupo: "R32", local: "Colombia",          visitante: "Ghana",     fecha: "2026-07-04T01:30:00Z", sede: "Por confirmar" },
];

// Lista combinada de todos los partidos (grupos + eliminatoria) para búsquedas y sincronización
const TODOS_LOS_PARTIDOS = [...PARTIDOS_BASE, ...PARTIDOS_ELIMINATORIA];


const TEAM_MAP = {
  // Grupo A
  "Mexico": "México", "South Africa": "Sudáfrica",
  "South Korea": "Corea del Sur", "Korea Republic": "Corea del Sur", "Czechia": "Chequia", "Czech Republic": "Chequia",
  // Grupo B
  "Canada": "Canadá", "Bosnia-Herzegovina": "Bosnia", "Bosnia and Herzegovina": "Bosnia",
  "Bosnia & Herzegovina": "Bosnia",
  "Qatar": "Qatar", "Switzerland": "Suiza",
  // Grupo C
  "Brazil": "Brasil", "Morocco": "Marruecos", "Haiti": "Haití", "Scotland": "Escocia",
  // Grupo D
  "United States": "Estados Unidos", "USA": "Estados Unidos", "Paraguay": "Paraguay",
  "Australia": "Australia", "Turkey": "Turquía", "Türkiye": "Turquía",
  // Grupo E
  "Germany": "Alemania", "Curaçao": "Curazao", "Curacao": "Curazao",
  "Côte d'Ivoire": "Costa de Marfil", "Cote d'Ivoire": "Costa de Marfil",
  "Ivory Coast": "Costa de Marfil", "Ecuador": "Ecuador",
  // Grupo F
  "Netherlands": "Países Bajos", "Japan": "Japón", "Sweden": "Suecia", "Tunisia": "Túnez",
  // Grupo G
  "Belgium": "Bélgica", "Egypt": "Egipto", "Iran": "Irán",
  "New Zealand": "Nueva Zelanda",
  // Grupo H
  "Spain": "España", "Cape Verde": "Cabo Verde",
  "Saudi Arabia": "Arabia Saudita", "Uruguay": "Uruguay",
  // Grupo I
  "France": "Francia", "Senegal": "Senegal", "Iraq": "Irak", "Norway": "Noruega",
  // Grupo J
  "Argentina": "Argentina", "Algeria": "Argelia", "Austria": "Austria", "Jordan": "Jordania",
  // Grupo K
  "Portugal": "Portugal", "DR Congo": "Congo DR", "Congo DR": "Congo DR",
  "Uzbekistan": "Uzbekistán", "Colombia": "Colombia",
  // Grupo L
  "England": "Inglaterra", "Croatia": "Croacia", "Ghana": "Ghana", "Panama": "Panamá",
};

function encontrarPartidoId(homeEn, awayEn, fechaPartido) {
  const homeEs = TEAM_MAP[homeEn] || homeEn;
  const awayEs = TEAM_MAP[awayEn] || awayEn;
  // Buscar TODOS los candidatos que coincidan por nombre (puede haber más de uno si los mismos equipos juegan dos veces, aunque no debería en fase de grupos)
  const candidatos = TODOS_LOS_PARTIDOS.filter(p =>
    (p.local === homeEs && p.visitante === awayEs) ||
    (p.local === awayEs && p.visitante === homeEs)
  );
  if (candidatos.length === 0) return null;
  if (candidatos.length === 1) {
    const p = candidatos[0];
    return { id: p.id, invertido: p.local === awayEs };
  }
  // Si hay más de un candidato, elegir el más cercano en fecha a la fecha real del partido
  if (fechaPartido) {
    const fechaPartidoMs = new Date(fechaPartido).getTime();
    let mejor = candidatos[0];
    let mejorDiff = Math.abs(new Date(mejor.fecha).getTime() - fechaPartidoMs);
    for (const c of candidatos) {
      const diff = Math.abs(new Date(c.fecha).getTime() - fechaPartidoMs);
      if (diff < mejorDiff) { mejor = c; mejorDiff = diff; }
    }
    return { id: mejor.id, invertido: mejor.local === awayEs };
  }
  const p = candidatos[0];
  return { id: p.id, invertido: p.local === awayEs };
}

// IDs de partidos excluidos del sync automático — se actualizan SOLO manualmente desde el panel Admin.
// Los partidos de eliminatoria (R32_*) se bloquean siempre: la fuente externa no distingue
// entre resultado de 90min+alargue y el resultado final con penales, así que deben ingresarse a mano.
const IDS_SYNC_BLOQUEADOS = ["E4", "F4",
  "R32_1","R32_2","R32_3","R32_4","R32_5","R32_6","R32_7","R32_8",
  "R32_9","R32_10","R32_11","R32_12","R32_13","R32_14","R32_15","R32_16"];

// eslint-disable-next-line no-unused-vars
async function sincronizarResultados(setResultados, setTodosPronosticos) {
  try {
    const res = await fetch("https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json");
    if (!res.ok) return;
    const data = await res.json();
    const partidos = data.matches || [];

    const resultadosActuales = await fbGet("global", "resultados") || {};
    let huboCambios = false;

    for (const m of partidos) {
      // Solo procesar partidos con resultado (tienen score.ft)
      if (!m.score || !m.score.ft) continue;
      const homeEn = m.team1;
      const awayEn = m.team2;
      const golesHome = m.score.ft[0];
      const golesAway = m.score.ft[1];
      if (golesHome === undefined || golesAway === undefined) continue;
      if (golesHome === null || golesAway === null) continue;

      // Construir fecha aproximada del partido desde la API (date + time con offset UTC-X)
      let fechaPartidoApi = null;
      if (m.date) {
        // m.time viene como "15:00 UTC-4" — extraemos la hora local y el offset
        const timeMatch = (m.time || "").match(/(\d{1,2}):(\d{2})\s*UTC([+-]\d+)/);
        if (timeMatch) {
          const [, hh, mm, offset] = timeMatch;
          const offsetNum = parseInt(offset);
          const horaUTC = (parseInt(hh) - offsetNum + 24) % 24;
          fechaPartidoApi = `${m.date}T${String(horaUTC).padStart(2,"0")}:${mm}:00Z`;
        } else {
          fechaPartidoApi = `${m.date}T12:00:00Z`; // fallback aproximado
        }
      }

      const match = encontrarPartidoId(homeEn, awayEn, fechaPartidoApi);
      if (!match) {
        console.warn("No se encontró partido para:", homeEn, "vs", awayEn);
        continue;
      }

      // Si este partido está en la lista de bloqueados, NUNCA lo tocamos automáticamente
      if (IDS_SYNC_BLOQUEADOS.includes(match.id)) {
        continue;
      }

      // Protección anti falso-positivo: solo aceptar el resultado si el partido,
      // según NUESTRA fecha programada, ya debería haber terminado
      const partidoInfo = TODOS_LOS_PARTIDOS.find(p => p.id === match.id);
      if (partidoInfo) {
        const inicio = new Date(partidoInfo.fecha);
        const minutosTranscurridos = (Date.now() - inicio.getTime()) / 60000;
        if (minutosTranscurridos < 100) {
          console.warn(`Ignorando resultado de ${match.id} — el partido aún no debería haber terminado (${homeEn} vs ${awayEn})`);
          continue;
        }
      }

      const nuevoRes = match.invertido
        ? { localGoles: golesAway, visitanteGoles: golesHome }
        : { localGoles: golesHome, visitanteGoles: golesAway };

      // Solo actualizar si cambió
      const actual = resultadosActuales[match.id];
      if (!actual || actual.localGoles !== nuevoRes.localGoles || actual.visitanteGoles !== nuevoRes.visitanteGoles) {
        resultadosActuales[match.id] = nuevoRes;
        huboCambios = true;
      }
    }

    if (huboCambios) {
      await fbSet("global", "resultados", resultadosActuales);
      setResultados({ ...resultadosActuales });
      await recalcularTodosUsuarios(resultadosActuales, setTodosPronosticos);
    }
  } catch (e) {
    console.warn("Error sincronizando:", e);
  }
}

// Convierte email a clave Firestore reemplazando SOLO los puntos del usuario (no del dominio)
// ej: Saldivar.nunez@gmail.com → saldivar_nunez@gmail_com (Firestore no permite puntos ni @)
// Usamos una clave que sea consistente: todo minúsculas, @ → _AT_, . → _
function emailToKey(email) {
  return email.toLowerCase().replace(/@/g, "_AT_").replace(/\./g, "_");
}

async function recalcularTodosUsuarios(resultadosActuales, setTodosPronosticos) {
  const usuarios = await fbGetAll("usuarios");
  const todosRanking = {};
  const emailsVistos = new Set();

  for (const [, u] of Object.entries(usuarios)) {
    const emailLower = (u.email || "").toLowerCase();
    if (emailsVistos.has(emailLower)) continue;
    emailsVistos.add(emailLower);

    const key = emailToKey(emailLower);
    const sus = await fbGet("pronosticos", key) || {};
    let total = 0, exactos = 0;
    for (const [pid, pro] of Object.entries(sus)) {
      if (resultadosActuales[pid]) {
        const pts = calcularPuntos(pro, resultadosActuales[pid]);
        total += pts;
        if (pts === 2) exactos++;
      }
    }
    todosRanking[emailLower] = { nombre: u.nombre, total, exactos };
  }
  await fbSet("global", "ranking", todosRanking);
  if (setTodosPronosticos) setTodosPronosticos({ ...todosRanking });
}

// ─── HELPERS ──────────────────────────────────────────────────────────────
const flag = (pais) => FLAG_EMOJI[pais] || "🏳️";

function calcularPuntos(pronostico, resultado) {
  if (!resultado || resultado.localGoles === null) return 0;
  let pts = 0;
  const resLocal = parseInt(resultado.localGoles);
  const resVisitante = parseInt(resultado.visitanteGoles);
  const proLocal = parseInt(pronostico.localGoles);
  const proVisitante = parseInt(pronostico.visitanteGoles);
  if (Math.sign(resLocal - resVisitante) === Math.sign(proLocal - proVisitante)) pts += 1;
  if (resLocal === proLocal && resVisitante === proVisitante) pts += 1;
  return pts;
}

function formatFecha(isoStr) {
  const d = new Date(isoStr);
  return d.toLocaleDateString("es-CL", { weekday: "short", day: "numeric", month: "short" }) +
    " · " + d.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
}

function puedePronosticar(isoStr) {
  return new Date() < new Date(new Date(isoStr).getTime() - 60 * 1000);
}

// ─── COMPONENTES PEQUEÑOS ─────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function Badge({ pts }) {
  if (pts === 2) return <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">+2 ⭐</span>;
  if (pts === 1) return <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">+1 ✓</span>;
  return <span className="bg-gray-700 text-gray-400 text-xs px-2 py-0.5 rounded-full">0 pts</span>;
}

// ─── VISTA: LOGIN ─────────────────────────────────────────────────────────
function LoginView({ onLogin }) {
  const [modo, setModo] = useState("login");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [pass, setPass] = useState("");
  const [verPass, setVerPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const INVITE_CODE = "Inge mundial";

  async function handleSubmit() {
    setError(""); setLoading(true);
    if (!email.trim()) { setError("Ingresa tu email"); setLoading(false); return; }

    if (modo === "registro") {
      if (!nombre.trim()) { setError("Ingresa tu nombre"); setLoading(false); return; }
      if (!pass.trim() || pass.length < 4) { setError("Contraseña mínimo 4 caracteres"); setLoading(false); return; }
      if (codigo.trim().toLowerCase() !== INVITE_CODE.toLowerCase()) { setError("Código de invitación incorrecto"); setLoading(false); return; }
      const emailKey = emailToKey(email);
      const existe = await fbGet("usuarios", emailKey);
      if (existe) { setError("Ya existe una cuenta con ese email"); setLoading(false); return; }
      const nuevoUsuario = { nombre, email: email.toLowerCase(), pass, creado: Date.now() };
      await fbSet("usuarios", emailKey, nuevoUsuario);
      onLogin(nuevoUsuario);
    } else {
      const emailKey = emailToKey(email);
      const u = await fbGet("usuarios", emailKey);
      if (!u) { setError("No existe cuenta con ese email"); setLoading(false); return; }
      if (u.pass !== pass) { setError("Contraseña incorrecta"); setLoading(false); return; }
      onLogin(u);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: "linear-gradient(160deg, #0a1628 0%, #0d2e1a 60%, #0a1628 100%)" }}>
      <div className="mb-8 text-center">
        <div className="text-6xl mb-2">⚽</div>
        <h1 className="text-3xl font-black tracking-tight text-white">POOL <span className="text-green-400">2026</span></h1>
        <p className="text-gray-400 text-sm mt-1">FIFA World Cup · USA · CAN · MEX</p>
      </div>
      <div className="w-full max-w-sm bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="flex mb-6 bg-black/30 rounded-xl p-1">
          {["login", "registro"].map(m => (
            <button key={m} onClick={() => { setModo(m); setError(""); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${modo === m ? "bg-green-500 text-black" : "text-gray-400"}`}>
              {m === "login" ? "Entrar" : "Registrarse"}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {modo === "registro" && (
            <input value={nombre} onChange={e => setNombre(e.target.value)}
              placeholder="Tu nombre completo"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-green-400" />
          )}
          <input value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Email" type="email"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-green-400" />
          <div className="relative">
            <input value={pass} onChange={e => setPass(e.target.value)}
              placeholder="Contraseña" type={verPass ? "text" : "password"}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-green-400" />
            <button type="button" onClick={() => setVerPass(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-lg transition-colors">
              {verPass ? "🙈" : "👁️"}
            </button>
          </div>
          {modo === "registro" && (
            <input value={codigo} onChange={e => setCodigo(e.target.value)}
              placeholder="Código de invitación"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-green-400" />
          )}
        </div>
        {error && <p className="mt-3 text-red-400 text-sm text-center">{error}</p>}
        <button onClick={handleSubmit} disabled={loading}
          className="mt-5 w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black font-bold py-3 rounded-xl transition-all text-sm">
          {loading ? "..." : modo === "login" ? "Ingresar" : "Crear cuenta"}
        </button>
        {modo === "registro" && (
          <p className="mt-4 text-center text-xs text-gray-500">
            Código: <span className="text-green-400 font-mono">Inge mundial</span>
          </p>
        )}
      </div>
    </div>
  );
}

// ─── CARD PARTIDO (reutilizable) ──────────────────────────────────────────
function CardPartido({ p, resultados, misPronosticos, pronosticoLocal, setPronosticoLocal, onGuardar, showGrupo = false }) {
  const [guardando, setGuardando] = useState(false);
  const [editando, setEditando] = useState(false);

  const puede = puedePronosticar(p.fecha);
  const resultado = resultados[p.id];
  const proGuardado = misPronosticos[p.id];
  const proActual = pronosticoLocal[p.id] || { localGoles: "", visitanteGoles: "" };
  const pts = proGuardado && resultado ? calcularPuntos(proGuardado, resultado) : null;
  const ahora = new Date();
  const inicio = new Date(p.fecha);
  const fin = new Date(inicio.getTime() + 105 * 60 * 1000);
  const enVivo = ahora >= inicio && ahora <= fin && !resultado;
  const horaLocal = inicio.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });

  async function guardar() {
    const pro = pronosticoLocal[p.id] || {};
    const localGoles = parseInt(pro.localGoles) || 0;
    const visitanteGoles = parseInt(pro.visitanteGoles) || 0;
    setGuardando(true);
    await onGuardar(p.id, { localGoles, visitanteGoles });
    setGuardando(false);
    setEditando(false);
  }

  return (
    <div className={`rounded-2xl border p-4 ${resultado ? "border-green-500/30 bg-green-500/5" : enVivo ? "border-red-500/40 bg-red-500/5" : "border-white/10 bg-white/5"}`}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          {showGrupo && <span className="text-xs font-bold text-gray-400 bg-white/10 px-2 py-0.5 rounded-lg">Grupo {p.grupo}</span>}
          <span className="text-xs text-gray-500">{showGrupo ? horaLocal + " hrs" : formatFecha(p.fecha)}</span>
          {enVivo && <span className="text-xs font-bold text-red-400 animate-pulse">🔴 EN VIVO</span>}
          {resultado && <span className="text-xs text-green-400 font-semibold">✓ Final</span>}
        </div>
        {pts !== null && <Badge pts={pts} />}
      </div>
      <p className="text-xs text-gray-600 mb-3">{p.sede}</p>
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 text-right">
          <p className="text-sm font-bold text-white">{flag(p.local)} {p.local}</p>
        </div>
        {resultado ? (
          <div className="flex items-center gap-1 px-3">
            <span className="text-green-400 font-black text-2xl">{resultado.localGoles}</span>
            <span className="text-gray-500 text-lg">–</span>
            <span className="text-green-400 font-black text-2xl">{resultado.visitanteGoles}</span>
          </div>
        ) : (
          <div className="px-4 py-1 bg-white/5 rounded-xl">
            <span className="text-gray-500 font-bold text-sm">VS</span>
          </div>
        )}
        <div className="flex-1 text-left">
          <p className="text-sm font-bold text-white">{p.visitante} {flag(p.visitante)}</p>
        </div>
      </div>
      {/* Sección pronóstico */}
      {resultado && proGuardado ? (() => {
        // Partido finalizado CON pronóstico — mostrar comparación visual
        const acertoResultado = Math.sign(resultado.localGoles - resultado.visitanteGoles) === Math.sign(proGuardado.localGoles - proGuardado.visitanteGoles);
        const acertoExacto = resultado.localGoles === proGuardado.localGoles && resultado.visitanteGoles === proGuardado.visitanteGoles;
        const colorLocal = acertoExacto ? "text-green-400" : acertoResultado ? "text-green-400" : "text-red-400";
        const colorVisitante = acertoExacto ? "text-green-400" : acertoResultado ? "text-green-400" : "text-red-400";
        const bgPro = acertoExacto ? "bg-green-500/15 border border-green-500/30" : acertoResultado ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20";
        return (
          <div className={`rounded-xl px-3 py-2 ${bgPro}`}>
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-xs text-gray-400">Tu pronóstico:</span>
              <span className={`font-black text-lg ${colorLocal}`}>{proGuardado.localGoles}</span>
              <span className="text-gray-500">–</span>
              <span className={`font-black text-lg ${colorVisitante}`}>{proGuardado.visitanteGoles}</span>
              {acertoExacto
                ? <span className="text-xs text-green-400 font-bold ml-1">✓ Exacto</span>
                : acertoResultado
                  ? <span className="text-xs text-green-400 font-bold ml-1">✓ Ganador</span>
                  : <span className="text-xs text-red-400 font-bold ml-1">✗ Fallaste</span>
              }
            </div>
          </div>
        );
      })() : resultado && !proGuardado ? (
        <p className="text-center text-xs text-gray-600 italic">No ingresaste pronóstico para este partido</p>
      ) : puede ? (
        proGuardado && !editando ? (
          <div className="flex items-center justify-center gap-3 bg-white/5 rounded-xl py-2 px-3">
            <span className="text-xs text-gray-500">Tu pronóstico:</span>
            <span className="text-white font-black">{proGuardado.localGoles}</span>
            <span className="text-gray-500">–</span>
            <span className="text-white font-black">{proGuardado.visitanteGoles}</span>
            <button onClick={() => setEditando(true)}
              className="ml-1 border border-yellow-500/40 text-yellow-400 text-xs font-bold px-2 py-1 rounded-lg hover:bg-yellow-500/10 transition-all">
              ✏️
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input type="number" min="0" max="20" value={proActual.localGoles}
              onChange={e => setPronosticoLocal(prev => ({ ...prev, [p.id]: { ...prev[p.id], localGoles: e.target.value } }))}
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-center text-lg font-bold focus:outline-none focus:border-green-400"
              placeholder="0" />
            <span className="text-gray-500 font-bold">–</span>
            <input type="number" min="0" max="20" value={proActual.visitanteGoles}
              onChange={e => setPronosticoLocal(prev => ({ ...prev, [p.id]: { ...prev[p.id], visitanteGoles: e.target.value } }))}
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-center text-lg font-bold focus:outline-none focus:border-green-400"
              placeholder="0" />
            <div className="flex flex-col gap-1">
              <button onClick={guardar} disabled={guardando}
                className="bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black font-bold px-4 py-2 rounded-xl text-sm transition-all">
                {guardando ? "..." : "Guardar"}
              </button>
              {editando && (
                <button onClick={() => setEditando(false)} className="text-gray-500 text-xs text-center hover:text-gray-300">Cancelar</button>
              )}
            </div>
          </div>
        )
      ) : proGuardado ? (
        <div className="flex items-center justify-center gap-2 bg-white/5 rounded-xl py-2">
          <span className="text-xs text-gray-500">Tu pronóstico:</span>
          <span className="text-gray-300 font-black">{proGuardado.localGoles}</span>
          <span className="text-gray-600">–</span>
          <span className="text-gray-300 font-black">{proGuardado.visitanteGoles}</span>
        </div>
      ) : (
        <p className="text-center text-xs text-gray-600 italic">Partido cerrado — no ingresaste pronóstico</p>
      )}
    </div>
  );
}

// ─── VISTA: HOY ───────────────────────────────────────────────────────────
function HoyView({ resultados, misPronosticos, onGuardar }) {
  const [pronosticoLocal, setPronosticoLocal] = useState({});
  const [msg, setMsg] = useState("");

  useEffect(() => { setPronosticoLocal({ ...misPronosticos }); }, [misPronosticos]);

  const hoy = new Date();
  const hoyStr = hoy.toLocaleDateString("en-CA");
  const mananaStr = new Date(hoy.getTime() + 86400000).toLocaleDateString("en-CA");

  const partidosHoy = TODOS_LOS_PARTIDOS.filter(p => new Date(p.fecha).toLocaleDateString("en-CA") === hoyStr)
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  const partidosManana = TODOS_LOS_PARTIDOS.filter(p => new Date(p.fecha).toLocaleDateString("en-CA") === mananaStr)
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  async function guardar(pid, goles) {
    await onGuardar(pid, goles);
    setMsg("¡Guardado!"); setTimeout(() => setMsg(""), 2000);
  }

  const labelHoy = hoy.toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" });
  const labelManana = new Date(hoy.getTime() + 86400000).toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="pb-4 px-1">
      {msg && <div className="mb-3 bg-green-500/20 border border-green-500/40 text-green-400 text-sm text-center py-2 rounded-xl">{msg}</div>}
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-green-400 font-black text-sm uppercase tracking-wider">Hoy</span>
          <span className="text-gray-500 text-xs capitalize">{labelHoy}</span>
          {partidosHoy.length > 0 && <span className="ml-auto bg-green-500/20 text-green-400 text-xs font-bold px-2 py-0.5 rounded-full">{partidosHoy.length} partidos</span>}
        </div>
        {partidosHoy.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <p className="text-4xl mb-2">😴</p>
            <p className="text-gray-400 font-semibold">Sin partidos hoy</p>
            <p className="text-gray-600 text-xs mt-1">Día de descanso mundialero</p>
          </div>
        ) : (
          <div className="space-y-3">
            {partidosHoy.map(p => (
              <CardPartido key={p.id} p={p} resultados={resultados} misPronosticos={misPronosticos}
                pronosticoLocal={pronosticoLocal} setPronosticoLocal={setPronosticoLocal}
                onGuardar={guardar} showGrupo={true} />
            ))}
          </div>
        )}
      </div>
      {partidosManana.length > 0 && (
        <div className="mt-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-yellow-400 font-black text-sm uppercase tracking-wider">Mañana</span>
            <span className="text-gray-500 text-xs capitalize">{labelManana}</span>
            <span className="ml-auto bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-0.5 rounded-full">{partidosManana.length} partidos</span>
          </div>
          <div className="space-y-3">
            {partidosManana.map(p => (
              <CardPartido key={p.id} p={p} resultados={resultados} misPronosticos={misPronosticos}
                pronosticoLocal={pronosticoLocal} setPronosticoLocal={setPronosticoLocal}
                onGuardar={guardar} showGrupo={true} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── VISTA: PRONÓSTICOS POR GRUPO ─────────────────────────────────────────
function PronosticosView({ resultados, misPronosticos, onGuardar }) {
  const [grupoActivo, setGrupoActivo] = useState("A");
  const [pronosticoLocal, setPronosticoLocal] = useState({});
  const [msg, setMsg] = useState("");

  useEffect(() => { setPronosticoLocal({ ...misPronosticos }); }, [misPronosticos]);

  const esEliminatoria = grupoActivo === "R32";
  const partidosGrupo = esEliminatoria
    ? PARTIDOS_ELIMINATORIA
    : PARTIDOS_BASE.filter(p => p.grupo === grupoActivo);

  async function guardar(pid, goles) {
    await onGuardar(pid, goles);
    setMsg("¡Guardado!"); setTimeout(() => setMsg(""), 2000);
  }

  return (
    <div className="pb-4">
      <div className="flex gap-1 overflow-x-auto pb-2 px-1">
        {Object.keys(GRUPOS).map(g => (
          <button key={g} onClick={() => setGrupoActivo(g)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${grupoActivo === g ? "bg-green-500 text-black" : "bg-white/5 text-gray-400 border border-white/10"}`}>
            Grupo {g}
          </button>
        ))}
        <button onClick={() => setGrupoActivo("R32")}
          className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${grupoActivo === "R32" ? "bg-yellow-500 text-black" : "bg-white/5 text-yellow-400 border border-yellow-500/30"}`}>
          🏆 Octavos
        </button>
      </div>
      {msg && <div className="mx-1 mt-2 bg-green-500/20 border border-green-500/40 text-green-400 text-sm text-center py-2 rounded-xl">{msg}</div>}
      {esEliminatoria ? (
        <div className="mx-1 mt-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 mb-3">
          <p className="text-xs text-yellow-400 font-semibold">⚠️ Fase eliminatoria — Octavos de final</p>
          <p className="text-gray-400 text-xs mt-1">El resultado válido es 90 min + alargue (si lo hay). Los penales no cuentan para el pronóstico.</p>
        </div>
      ) : (
        <div className="mx-1 mt-3 bg-white/5 border border-white/10 rounded-xl p-3 mb-3">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Equipos — Grupo {grupoActivo}</p>
          <div className="flex flex-wrap gap-2">
            {GRUPOS[grupoActivo].map(e => <span key={e} className="text-sm">{flag(e)} {e}</span>)}
          </div>
        </div>
      )}
      <div className="space-y-3 px-1">
        {partidosGrupo.map(p => (
          <CardPartido key={p.id} p={p} resultados={resultados} misPronosticos={misPronosticos}
            pronosticoLocal={pronosticoLocal} setPronosticoLocal={setPronosticoLocal} onGuardar={guardar} showGrupo={esEliminatoria} />
        ))}
      </div>
    </div>
  );
}

// ─── VISTA: TABLA ─────────────────────────────────────────────────────────
function TablaView({ todos }) {
  const ranking = Object.entries(todos)
    .map(([email, data]) => ({ email, nombre: data.nombre, total: data.total || 0, exactos: data.exactos || 0 }))
    .sort((a, b) => b.total - a.total || b.exactos - a.exactos);
  const medals = ["🥇", "🥈", "🥉"];

  if (ranking.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-6">
        <div className="text-5xl mb-4">🏆</div>
        <p className="text-gray-400">Nadie ha ingresado pronósticos aún.</p>
        <p className="text-gray-600 text-sm mt-2">¡Sé el primero!</p>
      </div>
    );
  }

  return (
    <div className="px-1 pt-2">
      <div className="bg-gradient-to-r from-yellow-500/10 to-green-500/10 border border-yellow-500/20 rounded-2xl p-4 mb-4">
        <p className="text-xs text-gray-400 mb-1">🏆 Premio para los 3 mejores al finalizar el Mundial</p>
        <p className="text-yellow-400 font-semibold text-sm">¡Los 3 primeros ganarán un premio!</p>
      </div>
      <div className="space-y-2">
        {ranking.map((u, i) => (
          <div key={u.email}
            className={`flex items-center gap-3 rounded-xl p-3 border ${i === 0 ? "border-yellow-500/40 bg-yellow-500/10" : i === 1 ? "border-gray-400/30 bg-gray-400/5" : i === 2 ? "border-amber-700/30 bg-amber-700/5" : "border-white/5 bg-white/3"}`}>
            <span className="text-2xl w-8 text-center">{medals[i] || `${i + 1}`}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate">{u.nombre}</p>
              <p className="text-xs text-gray-500">{u.exactos} resultados exactos</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-black text-green-400">{u.total}</p>
              <p className="text-xs text-gray-500">pts</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── VISTA: ADMIN ─────────────────────────────────────────────────────────
function AdminView({ resultados, onGuardarResultado }) {
  const [grupoActivo, setGrupoActivo] = useState("A");
  const [inputs, setInputs] = useState({});
  const [guardando, setGuardando] = useState(null);
  const [editandoAdmin, setEditandoAdmin] = useState({});
  const [msg, setMsg] = useState("");

  const partidosGrupo = grupoActivo === "R32" ? PARTIDOS_ELIMINATORIA : PARTIDOS_BASE.filter(p => p.grupo === grupoActivo);

  async function guardar(partido) {
    const inp = inputs[partido.id];
    if (!inp || inp.local === "" || inp.visitante === "") { setMsg("Ingresa ambos goles"); setTimeout(() => setMsg(""), 2000); return; }
    setGuardando(partido.id);
    await onGuardarResultado(partido.id, { localGoles: parseInt(inp.local), visitanteGoles: parseInt(inp.visitante) });
    setGuardando(null);
    setEditandoAdmin(prev => ({ ...prev, [partido.id]: false }));
    setMsg("Resultado guardado ✓"); setTimeout(() => setMsg(""), 2000);
  }

  return (
    <div className="pb-4">
      <div className="mx-1 mb-4 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
        <p className="text-red-400 text-xs font-semibold">⚙️ Panel de administración — solo visible para ti</p>
        <p className="text-gray-500 text-xs mt-1">Ingresa los resultados reales de cada partido aquí. En octavos, ingresa el resultado de 90 min + alargue (sin penales).</p>
      </div>
      {msg && <div className="mx-1 mb-3 bg-green-500/20 border border-green-500/40 text-green-400 text-sm text-center py-2 rounded-xl">{msg}</div>}
      <div className="flex gap-1 overflow-x-auto pb-2 px-1">
        {Object.keys(GRUPOS).map(g => (
          <button key={g} onClick={() => setGrupoActivo(g)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${grupoActivo === g ? "bg-red-500 text-white" : "bg-white/5 text-gray-400 border border-white/10"}`}>
            Grupo {g}
          </button>
        ))}
        <button onClick={() => setGrupoActivo("R32")}
          className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${grupoActivo === "R32" ? "bg-yellow-500 text-black" : "bg-white/5 text-yellow-400 border border-yellow-500/30"}`}>
          🏆 Octavos
        </button>
      </div>
      <div className="space-y-3 px-1 mt-3">
        {partidosGrupo.map(p => {
          const res = resultados[p.id];
          const inp = inputs[p.id] || { local: res?.localGoles ?? "", visitante: res?.visitanteGoles ?? "" };
          const enEdicion = editandoAdmin[p.id];
          return (
            <div key={p.id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-xs text-gray-500 mb-1">{formatFecha(p.fecha)}</p>
              <p className="text-sm font-semibold text-white mb-3">{flag(p.local)} {p.local} vs {p.visitante} {flag(p.visitante)}</p>
              {res && !enEdicion ? (
                <div className="flex items-center justify-center gap-3">
                  <span className="text-green-400 font-black text-xl">{res.localGoles}</span>
                  <span className="text-gray-500 font-bold">–</span>
                  <span className="text-green-400 font-black text-xl">{res.visitanteGoles}</span>
                  <span className="text-xs text-gray-500 self-center">resultado final</span>
                  <button onClick={() => setEditandoAdmin(prev => ({ ...prev, [p.id]: true }))}
                    className="ml-2 border border-yellow-500/40 text-yellow-400 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-yellow-500/10 transition-all">
                    ✏️ Editar
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input type="number" min="0" max="20" value={inp.local}
                    onChange={e => setInputs(prev => ({ ...prev, [p.id]: { ...prev[p.id], local: e.target.value } }))}
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-center text-lg font-bold focus:outline-none focus:border-red-400"
                    placeholder="0" />
                  <span className="text-gray-500 font-bold">–</span>
                  <input type="number" min="0" max="20" value={inp.visitante}
                    onChange={e => setInputs(prev => ({ ...prev, [p.id]: { ...prev[p.id], visitante: e.target.value } }))}
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-center text-lg font-bold focus:outline-none focus:border-red-400"
                    placeholder="0" />
                  <div className="flex flex-col gap-1">
                    <button onClick={() => guardar(p)} disabled={guardando === p.id}
                      className="bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all">
                      {guardando === p.id ? "..." : "Guardar"}
                    </button>
                    {enEdicion && (
                      <button onClick={() => setEditandoAdmin(prev => ({ ...prev, [p.id]: false }))}
                        className="text-gray-500 text-xs text-center hover:text-gray-300 transition-colors">
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── LIMPIEZA: NaN → 0, deduplicar emails y migrar claves antiguas ──────────
async function limpiarNaNyDuplicados() {
  try {
    const usuarios = await fbGetAll("usuarios");
    const todosPronosticos = await fbGetAll("pronosticos");
    const resultados = await fbGet("global", "resultados") || {};

    // Paso 1: Para cada usuario, consolidar todos sus pronósticos bajo la clave correcta
    const emailsVistos = new Set();
    for (const [, u] of Object.entries(usuarios)) {
      const emailLower = (u.email || "").toLowerCase();
      if (emailsVistos.has(emailLower)) continue;
      emailsVistos.add(emailLower);

      const keyCorrecta = emailToKey(emailLower);

      // Buscar pronósticos bajo variantes antiguas de clave
      // Variante 1: solo puntos reemplazados (sin @) → "saldivar_nunez@gmail_com"
      const keyVieja1 = emailLower.replace(/\./g, "_");
      // Variante 2: con mayúsculas original → "Saldivar_nunez@gmail_com"
      const keyVieja2 = (u.email || "").replace(/\./g, "_");

      const proCorrecta = todosPronosticos[keyCorrecta] || {};
      const proVieja1 = todosPronosticos[keyVieja1] || {};
      const proVieja2 = todosPronosticos[keyVieja2] || {};

      // Merge: la clave correcta tiene prioridad, luego vieja1, vieja2
      const merged = { ...proVieja2, ...proVieja1, ...proCorrecta };

      // Paso 2: Limpiar NaN en los pronósticos mergeados
      const limpios = {};
      for (const [pid, pro] of Object.entries(merged)) {
        limpios[pid] = {
          localGoles: isNaN(parseInt(pro.localGoles)) ? 0 : parseInt(pro.localGoles),
          visitanteGoles: isNaN(parseInt(pro.visitanteGoles)) ? 0 : parseInt(pro.visitanteGoles),
        };
      }

      // Guardar bajo la clave correcta
      if (Object.keys(limpios).length > 0) {
        await fbSet("pronosticos", keyCorrecta, limpios);
      }

      // Asegurar que el usuario quede guardado con email en minúsculas
      await fbSet("usuarios", keyCorrecta, { ...u, email: emailLower });
    }

    // Paso 3: Recalcular ranking limpio
    await recalcularTodosUsuarios(resultados, null);

  } catch(e) {
    console.warn("Error en limpieza:", e);
  }
}

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────
const ADMIN_EMAIL = "saldivar.nunez@gmail.com";

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [tab, setTab] = useState("hoy");
  const [loading, setLoading] = useState(true);
  const [resultados, setResultados] = useState({});
  const [todosPronosticos, setTodosPronosticos] = useState({});
  const [misPronosticos, setMisPronosticos] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [ultimaSync, setUltimaSync] = useState(null);

  useEffect(() => {
    async function init() {
      const res = await fbGet("global", "resultados") || {};
      setResultados(res);
      const ranking = await fbGet("global", "ranking") || {};
      setTodosPronosticos(ranking);
      setLoading(false);
      // Limpieza de NaN y duplicados (se ejecuta una vez al cargar)
      await limpiarNaNyDuplicados();
      // SYNC AUTOMÁTICO DESACTIVADO — los resultados se ingresan manualmente desde el panel Admin.
      // sincronizarResultados(setResultados, setTodosPronosticos).then(() => setUltimaSync(new Date()));
    }
    init();
    // Intervalo de sync automático desactivado.
    // const intervalo = setInterval(() => {
    //   sincronizarResultados(setResultados, setTodosPronosticos).then(() => setUltimaSync(new Date()));
    // }, 5 * 60 * 1000);
    // return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    if (!usuario) return;
    async function cargarMis() {
      const emailKey = emailToKey(usuario.email);
      const mis = await fbGet("pronosticos", emailKey) || {};
      setMisPronosticos(mis);
    }
    cargarMis();
  }, [usuario]);

  const recalcularTodos = useCallback(async (nuevosMis, email) => {
    const res = await fbGet("global", "resultados") || {};
    const ranking = await fbGet("global", "ranking") || {};
    let total = 0, exactos = 0;
    for (const [pid, pro] of Object.entries(nuevosMis)) {
      if (res[pid]) {
        const pts = calcularPuntos(pro, res[pid]);
        total += pts;
        if (pts === 2) exactos++;
      }
    }
    ranking[email.toLowerCase()] = { nombre: usuario.nombre, total, exactos };
    await fbSet("global", "ranking", ranking);
    setTodosPronosticos({ ...ranking });
  }, [usuario]);

  async function guardarPronostico(partidoId, goles) {
    const nuevos = { ...misPronosticos, [partidoId]: goles };
    setMisPronosticos(nuevos);
    const emailKey = emailToKey(usuario.email);
    await fbSet("pronosticos", emailKey, nuevos);
    await recalcularTodos(nuevos, usuario.email);
  }

  async function guardarResultado(partidoId, goles) {
    const nuevosRes = { ...resultados, [partidoId]: goles };
    setResultados(nuevosRes);
    await fbSet("global", "resultados", nuevosRes);
    await recalcularTodosUsuarios(nuevosRes, setTodosPronosticos);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(160deg, #0a1628 0%, #0d2e1a 60%, #0a1628 100%)" }}>
        <Spinner />
      </div>
    );
  }

  if (!usuario) return <LoginView onLogin={u => setUsuario(u)} />;

  const isAdmin = usuario.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  const tabs = [
    { id: "hoy",        label: "Hoy",    icon: "📅" },
    { id: "pronosticos",label: "Grupos", icon: "⚽" },
    { id: "tabla",      label: "Tabla",  icon: "🏆" },
    ...(isAdmin ? [{ id: "admin", label: "Admin", icon: "⚙️" }] : []),
  ];

  return (
    <div className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(160deg, #0a1628 0%, #0d2e1a 60%, #0a1628 100%)" }}>
      <header className="sticky top-0 z-10 px-4 pt-4 pb-3 backdrop-blur border-b border-white/5"
        style={{ background: "rgba(10,22,40,0.9)" }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black text-white">⚽ Pool <span className="text-green-400">2026</span></h1>
            <p className="text-xs text-gray-500">
              Hola, {usuario.nombre.split(" ")[0]}
              {ultimaSync && <span className="ml-2 text-green-600">· sync {ultimaSync.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}</span>}
            </p>
          </div>
          <button onClick={() => setUsuario(null)}
            className="text-xs text-gray-500 border border-white/10 px-3 py-1.5 rounded-lg hover:text-white transition-all">
            Salir
          </button>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto px-2 pt-4">
        {tab === "hoy" && <HoyView resultados={resultados} misPronosticos={misPronosticos} onGuardar={guardarPronostico} />}
        {tab === "pronosticos" && <PronosticosView resultados={resultados} misPronosticos={misPronosticos} onGuardar={guardarPronostico} />}
        {tab === "tabla" && <TablaView todos={todosPronosticos} />}
        {tab === "admin" && isAdmin && <AdminView resultados={resultados} onGuardarResultado={guardarResultado} />}
      </main>
      <nav className="sticky bottom-0 flex border-t border-white/10 backdrop-blur"
        style={{ background: "rgba(10,22,40,0.95)" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 py-3 flex flex-col items-center gap-0.5 transition-all ${tab === t.id ? "text-green-400" : "text-gray-600"}`}>
            <span className="text-xl">{t.icon}</span>
            <span className="text-xs font-medium">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
