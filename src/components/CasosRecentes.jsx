// CasosRecentes.jsx
import React from "react";
import { ArrowRight, Clock } from "lucide-react";

export default function CasosRecentes({ casos, onSelectPaciente }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 md:p-6 flex flex-col w-full overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Casos Recentes</h3>
          <p className="text-sm text-slate-500">Últimos registros inseridos</p>
        </div>
        <div className="p-2 bg-slate-50 rounded-lg">
          <Clock className="size-4 text-slate-400" />
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1">
        {casos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 py-8">
            <p className="text-sm">Nenhum caso encontrado.</p>
          </div>
        ) : (
          casos.map((caso, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3.5 bg-slate-50/50 hover:bg-white rounded-xl transition-all duration-200 group cursor-pointer border border-transparent hover:border-slate-200 hover:shadow-sm"
              onClick={() => onSelectPaciente(caso.dadosOriginais)}
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Indicador de status mais visual */}
                <div
                  className={`w-1.5 h-10 rounded-full flex-shrink-0 ${caso.corClassificacao} shadow-sm`}
                ></div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-800 truncate">
                      {caso.name}
                    </p>
                    {/* Badge de status */}
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        caso.corClassificacao.includes("rose")
                          ? "bg-rose-100 text-rose-700"
                          : caso.corClassificacao.includes("emerald")
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {caso.corClassificacao.includes("rose")
                        ? "Alarme"
                        : caso.corClassificacao.includes("emerald")
                          ? "Descartado"
                          : "Suspeito"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {caso.condition}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5 font-medium">
                    {caso.ubs}
                  </p>
                </div>
              </div>
              <ArrowRight className="size-4 text-slate-300 group-hover:text-[#4180ab] group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 ml-2" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
