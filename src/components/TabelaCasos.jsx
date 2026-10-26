import React, { useMemo } from "react";
import {
  Table2,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FileSearch,
} from "lucide-react";
import { formatarBairro } from "@/lib/bairros";

const extrairBairro = (endereco) => {
  if (!endereco) return "—";
  const partes = endereco
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  if (!partes.length) return "—";
  let ultima = partes[partes.length - 1];
  if (/^[0-9-]+$/.test(ultima) && partes.length >= 2) {
    ultima = partes[partes.length - 2];
  }
  return formatarBairro(ultima);
};

export default function TabelaCasos({ pacientes = [], escopo = "unidade" }) {
  const ultimos = useMemo(() => {
    return [...pacientes]
      .sort((a, b) => {
        const dtA = a.data_notificacao || a.dt_notific || "0000-00-00";
        const dtB = b.data_notificacao || b.dt_notific || "0000-00-00";
        if (dtA !== dtB) return dtB.localeCompare(dtA);
        return (b.id || 0) - (a.id || 0);
      })
      .slice(0, 10);
  }, [pacientes]);

  const subtitulo =
    escopo === "unidade"
      ? "Os 10 registros mais recentes da sua unidade"
      : "Os 10 registros mais recentes do município";

  const getStatus = (classi_fin) => {
    const c = String(classi_fin || "").trim();
    if (c === "10" || c === "11")
      return {
        label: "Alarme",
        cor: "bg-rose-500",
        bg: "bg-rose-50 text-rose-700 border-rose-200",
        Icon: AlertCircle,
      };
    if (c === "5")
      return {
        label: "Descartado",
        cor: "bg-emerald-500",
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        Icon: CheckCircle2,
      };
    if (c === "8")
      return {
        label: "Inconclusivo",
        cor: "bg-slate-400",
        bg: "bg-slate-50 text-slate-600 border-slate-200",
        Icon: HelpCircle,
      };
    return {
      label: "Suspeito",
      cor: "bg-amber-500",
      bg: "bg-amber-50 text-amber-700 border-amber-200",
      Icon: AlertTriangle,
    };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 md:p-6 flex flex-col w-full overflow-hidden">
      <div className="mb-4 flex items-center gap-2">
        <Table2 className="size-5 text-[#4180ab]" />
        <div>
          <h3 className="text-lg font-bold text-slate-800">Últimos Casos</h3>
          <p className="text-sm text-slate-500">{subtitulo}</p>
        </div>
      </div>

      <div className="overflow-x-auto -mx-5 md:-mx-6 px-5 md:px-6 max-h-125 overflow-y-auto select-none">
        {ultimos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-300">
            <FileSearch className="size-16 mb-3 opacity-50" />
            <p className="text-sm font-medium text-slate-500">
              Nenhum caso registrado neste período.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Tudo tranquilo por aqui! 🎉
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-600 min-w-[600px]">
            <thead className="text-xs text-slate-500 uppercase sticky top-0 z-10">
              <tr className="border-b border-slate-100">
                <th className="px-4 py-3 font-semibold rounded-tl-lg whitespace-nowrap bg-white">
                  Data
                </th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap bg-white">
                  Notificação
                </th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap bg-white">
                  Bairro
                </th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap bg-white">
                  Sexo
                </th>
                <th className="px-4 py-3 font-semibold rounded-tr-lg whitespace-nowrap text-right bg-white">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {ultimos.map((p) => {
                const status = getStatus(p.classi_fin);
                const StatusIcon = status.Icon;
                const data = p.data_notificacao || p.dt_notific;
                const dataFmt = data
                  ? data.split("-").reverse().join("/")
                  : "—";
                return (
                  <tr
                    key={p.id}
                    className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-4 py-2.5 whitespace-nowrap text-slate-700 font-medium">
                      {dataFmt}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-slate-500 font-mono text-xs">
                      #{p.numero_notificacao || p.nu_notific || "S/N"}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-slate-600 max-w-[180px] truncate">
                      {extrairBairro(p.endereco)}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-[10px] font-bold ${
                          p.cs_sexo === "F"
                            ? "bg-pink-100 text-pink-700"
                            : p.cs_sexo === "M"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {p.cs_sexo || "?"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-right">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold border ${status.bg}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
