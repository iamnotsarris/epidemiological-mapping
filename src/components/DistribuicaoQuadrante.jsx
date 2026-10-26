import React from "react";

export default function DistribuicaoUbs({ distribuicaoUbs }) {
  const ubsOrdenadas = [...distribuicaoUbs].sort((a, b) => b.value - a.value);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 md:p-6 flex flex-col w-full overflow-hidden">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-800">
          Distribuição por UBS
        </h3>
        <p className="text-sm text-slate-500">Áreas com mais casos de dengue</p>
      </div>
      <div className="flex-1 space-y-5 overflow-y-auto">
        {ubsOrdenadas.map((item, idx) => (
          <div key={idx}>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="font-medium text-slate-600 flex items-center gap-2">
                <span
                  className={`size-2.5 rounded-full shrink-0 ${item.color}`}
                ></span>
                <span className="truncate">
                  {/* Se for o primeiro da lista, você pode até colocar um ícone ou destaque aqui se quiser */}
                  {idx === 0 ? `🚨 ${item.name}` : item.name}
                </span>
              </span>
              <span className="font-bold text-slate-700 ml-2">
                {item.value}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${item.color}`}
                style={{ width: `${(item.value / item.max) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
