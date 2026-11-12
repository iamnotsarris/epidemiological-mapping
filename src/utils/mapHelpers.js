export const normalizar = (s) =>
  String(s || "")
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export function extrairBairro(endereco) {
  if (!endereco) return "";
  const partes = endereco.split(",");
  let bairro = partes[partes.length - 1].trim();
  if (/^[0-9-]+$/.test(bairro) && partes.length >= 2) {
    bairro = partes[partes.length - 2].trim();
  } else if (/^[0-9-]+$/.test(bairro)) {
    return "";
  }
  return normalizar(bairro);
}

export function filtrarPorPeriodo(
  pacientes,
  filtroPeriodo,
  dataInicio,
  dataFim,
) {
  if (filtroPeriodo === "todos") return pacientes;
  if (filtroPeriodo === "personalizado" && (!dataInicio || !dataFim))
    return pacientes;

  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  let inicio = new Date();
  let fim = hoje;

  switch (filtroPeriodo) {
    case "ultimoMes":
      inicio.setMonth(hoje.getMonth() - 1);
      break;
    case "ultimos3Meses":
      inicio.setMonth(hoje.getMonth() - 3);
      break;
    case "ultimos6Meses":
      inicio.setMonth(hoje.getMonth() - 6);
      break;
    case "esteAno":
      inicio = new Date(anoAtual, 0, 1);
      break;
    case "anoPassado":
      inicio = new Date(anoAtual - 1, 0, 1);
      fim = new Date(anoAtual - 1, 11, 31, 23, 59, 59);
      break;
    case "personalizado":
      inicio = new Date(dataInicio + "T00:00:00");
      fim = new Date(dataFim + "T23:59:59");
      break;
  }

  return pacientes.filter((p) => {
    const dt = p.data_notificacao || p.dt_notific;
    if (dt) {
      const [a, m, d] = dt.split("T")[0].split("-").map(Number);
      const data = new Date(a, m - 1, d, 12, 0, 0);
      return data >= inicio && data <= fim;
    }
    const anoNotif = Number(p.ano_notific || p["ANO NOTIFIC"] || p.ano);
    if (!anoNotif) return false;
    if (filtroPeriodo === "anoPassado") return anoNotif === anoAtual - 1;
    if (filtroPeriodo === "esteAno") return anoNotif === anoAtual;
    if (["ultimoMes", "ultimos3Meses", "ultimos6Meses"].includes(filtroPeriodo))
      return anoNotif === anoAtual;
    if (filtroPeriodo === "personalizado" && dataInicio && dataFim) {
      const ai = new Date(dataInicio).getFullYear();
      const af = new Date(dataFim).getFullYear();
      return anoNotif >= ai && anoNotif <= af;
    }
    return false;
  });
}

// Heurística única de nome de UBS → área do polígono
export function resolverAreaPorNome(nomeUbsRaw) {
  const n = normalizar(nomeUbsRaw);
  if (!n) return null;
  if (n.includes("DIRCEU") || n.includes("ARCOVERDE"))
    return "AREA UBS DIRCEU ARCOVERDE";
  if (n.includes("PARAGUASSU")) return "AREA UBS JOSE PARAGUASSU";
  if (n.includes("THEODORO") || n.includes("SOBRAL"))
    return "AREA UBS THEODORO FERREIRA SOBRAL";
  if (n.includes("PEDRO SIMPLICIO")) return "AREA DA UBS PEDRO SIMPLICIO";
  if (n.includes("ALFREDO")) return "AREA UBS ALFREDO DE CARVALHO";
  if (n.includes("LUIZ TAVARES") || n.includes("TABOCA"))
    return "AREA DA UBS LUIZ TAVARES";
  if (n.includes("CAMILO")) return "AREA UBS CAMILO FILHO";
  if (n.includes("GUIA")) return "AREA UBS NOSSA SENHORA DA GUIA";
  if (n.includes("RAIMUNDO FILHO")) return "AREA UBS RAIMUNDO FILHO";
  if (n.includes("KALUME")) return "AREA UBS PAULO KALUME";
  if (n.includes("OKA") || n.includes("ELIAS"))
    return "AREA UBS JOAO ELIAS OKA";
  if (n.includes("VIANA")) return "AREA UBS VIANA DE CARVALHO";
  if (n.includes("PAULO MARTINS")) return "AREA UBS PAULO MARTINS";
  if (n.includes("HELVIDIO") || n.includes("HOLANDA"))
    return "AREA UBS HELVIDIO DE HOLANDA BARROS";
  if (n.includes("JASMINA") || n.includes("BUCAR"))
    return "AREA DA UBS JASMINA BUCAR";
  if (n.includes("PAM") || n.includes("P.A.M")) return "AREA UBS PAM";
  if (n.includes("SANTA CRUZ")) return "AREA UBS SANTA CRUZ";
  if (n.includes("FLORIANO") || n.includes("CENTRO"))
    return "AREA UBS FLORIANO";
  if (n.includes("L3")) return "AREA UBS L3";
  if (n.includes("LEONARDO") || n.includes("DUDIMA"))
    return "AREA UBS LEONARDO DUDIMA";
  if (n.includes("MORRINHOS")) return "AREA UBS MORRINHOS";
  if (n.includes("MARGARIDA") || n.includes("ALVES"))
    return "AREA UBS MARGARIDA ALVES";
  if (n.includes("PROTASIO")) return "AREA UBS PROTASIO DE MORAES";
  if (n.includes("BENVINDO")) return "AREA UBS RAIMUNDO BENVINDO LIMA";
  if (n.includes("RETIRO") || n.includes("AMOLAR"))
    return "AREA UBS RETIRO AMOLAR";
  return null;
}

// Orquestra: CNES → Bairro → Nome
export function resolverArea(paciente, { cnesMap, bairroMap }) {
  if (cnesMap) {
    const cnes = String(paciente.id_unidade || "")
      .replace(".0", "")
      .trim();
    if (cnesMap[cnes]) return cnesMap[cnes];
  }
  if (bairroMap && paciente.endereco) {
    const bairro = extrairBairro(paciente.endereco);
    if (bairroMap[bairro]) return bairroMap[bairro];
  }
  const ubs = paciente.nm_ubs || paciente.un_saude || paciente.id_unidade || "";
  return resolverAreaPorNome(ubs);
}
