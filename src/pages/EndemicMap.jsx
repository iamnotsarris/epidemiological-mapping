import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Sidebar from "@/components/Sidebar.jsx";
import SidebarPrivate from "@/components/private/SidebarPrivate.jsx";
import EndemiasFilter from "@/components/EndemiasFilter.jsx";
import EndemiasFilterPrivate from "@/components/private/EndemiasFilterPrivate.jsx";
import ButtonTheme from "@/components/ButtonTheme.jsx";
import MapPeriodFilter from "@/components/MapPeriodFilter.jsx";
import { useFiltrosMapa } from "@/hooks/useFiltrosMapa.js";
import {
  Map,
  MapGeoJSON,
  MapMarker,
  MarkerContent,
  MarkerLabel,
  MarkerPopup,
} from "@/components/Map.jsx";
import {
  Activity,
  Map as MapIcon,
  Star,
  Navigation,
  Clock,
  Menu,
} from "lucide-react";
import { Button } from "@/components/button.jsx";

import { MAP_STYLES, THEMES } from "../constants/mapStyles.js";
import { bairrosFlorianoGeoJSON } from "../constants/florianoGeoJSON.js";
import { marcadores } from "../constants/ubsMarcadores.js";

import {
  normalizar,
  filtrarPorPeriodo,
  resolverArea,
} from "@/utils/mapHelpers.js";

import "maplibre-gl/dist/maplibre-gl.css";

export default function EndemicMap({
  isPrivateView = false,
  endemiaId, // "dengue" | "gerais" | ...
  apiEndpoint, // "/api/dengue/"
  title, // "Mapa Epidemiológico - Dengue"
  countMode = "nu_notific", // "increment" | "nu_notific"
  colorTheme = "red", // chave de THEMES
  showMobileHint = false,
  showPeriodFilter = true,
  bairroMap,
  cnesMap,
  filterPredicate, // (paciente) => boolean | undefined
}) {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const {
    filtroTipo,
    setFiltroTipo,
    dataInicio,
    setDataInicio,
    dataFim,
    setDataFim,
  } = useFiltrosMapa();

  const [activeStyle, setActiveStyle] = useState("light");
  const [geoData, setGeoData] = useState(bairrosFlorianoGeoJSON);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [todosPacientes, setTodosPacientes] = useState([]);
  const [zoomAtual, setZoomAtual] = useState(13.5);
  const [showMobile, setShowMobile] = useState(false);

  const theme = THEMES[colorTheme] ?? THEMES.red;
  const is3D = activeStyle === "openstreetmap3d";

  useEffect(() => {
    if (mapRef.current)
      mapRef.current.easeTo({ pitch: is3D ? 60 : 0, duration: 1000 });
  }, [is3D]);

  useEffect(() => {
    if (!showMobileHint || window.innerWidth >= 768) return;
    setShowMobile(true);
    const t = setTimeout(() => setShowMobile(false), 8000);
    return () => clearTimeout(t);
  }, [showMobileHint]);

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}${apiEndpoint}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then(setTodosPacientes)
      .catch((e) => console.error("Erro API mapa:", e))
      .finally(() => setLoading(false));
  }, [apiEndpoint]);

  const handleEndemiaChange = (nova) => {
    if (nova === endemiaId) return;
    const base = isPrivateView
      ? "/profissional/mapa-epidemiologico"
      : "/mapa-epidemiologico";
    navigate(nova === "gerais" ? base : `${base}/endemias/${nova}`);
  };

  // Pipeline de agregação
  useEffect(() => {
    if (!todosPacientes.length) return;

    let lista = filtrarPorPeriodo(
      todosPacientes,
      filtroTipo,
      dataInicio,
      dataFim,
    );
    if (filterPredicate) lista = lista.filter(filterPredicate);

    const contagem = {};
    lista.forEach((p) => {
      const area = resolverArea(p, { cnesMap, bairroMap });
      if (!area) return;
      const peso = countMode === "increment" ? 1 : Number(p.nu_notific) || 1;
      contagem[area] = (contagem[area] || 0) + peso;
    });

    const features = bairrosFlorianoGeoJSON.features.map((f) => {
      const cor = f.properties.fill || f.properties.color || "#808080";
      const nome = normalizar(f.properties.name);
      const casos = contagem[nome] || 0;
      return { ...f, properties: { ...f.properties, color: cor, casos } };
    });

    setGeoData({ ...bairrosFlorianoGeoJSON, features });
  }, [
    todosPacientes,
    filtroTipo,
    dataInicio,
    dataFim,
    cnesMap,
    bairroMap,
    countMode,
    filterPredicate,
  ]);

  // ---- JSX (idêntico ao que você já tem, parametrizado) ----
  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {isPrivateView ? (
        <SidebarPrivate
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      ) : (
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col h-full w-full overflow-y-auto overflow-x-hidden ml-0 md:ml-[var(--sidebar-width,16rem)] transition-all duration-300">
        <header className="...">
          {" "}
          {/* header igual */}
          <h1 className="...">
            <MapIcon /> Mapa Epidemiológico Setorial
          </h1>
        </header>

        <main className="flex-1 p-2 md:p-6 relative flex flex-col">
          <div className="relative w-full h-full rounded-xl md:rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-200 flex-1">
            {isPrivateView ? (
              <EndemiasFilterPrivate
                selected={endemiaId}
                onChange={handleEndemiaChange}
              />
            ) : (
              <EndemiasFilter
                selected={endemiaId}
                onChange={handleEndemiaChange}
              />
            )}

            {loading ? (
              <div className="flex h-full items-center justify-center">
                <Activity className={`size-8 animate-spin ${theme.spinner}`} />
              </div>
            ) : (
              <div className="relative w-full h-full">
                {showMobile && (
                  <div className="...">
                    {" "}
                    {/* hint igual ao EpidemiologyMap */}
                    Toque na área para revelar mais informações.
                  </div>
                )}

                <Map
                  ref={mapRef}
                  center={[-43.0225, -6.7672]}
                  zoom={13.5}
                  onViewportChange={(v) => setZoomAtual(v.zoom)}
                  mapStyle={MAP_STYLES[activeStyle]}
                  styles={{
                    light: MAP_STYLES[activeStyle] || MAP_STYLES.light,
                    dark: MAP_STYLES[activeStyle] || MAP_STYLES.dark,
                  }}
                >
                  <MapGeoJSON
                    data={geoData}
                    fillPaint={{
                      "fill-color": ["get", "color"],
                      "fill-opacity": [
                        "case",
                        ["==", ["get", "casos"], 0],
                        0.15,
                        0.45,
                      ],
                    }}
                    linePaint={{
                      "line-color": ["get", "color"],
                      "line-width": ["case", ["==", ["get", "casos"], 0], 1, 2],
                      "line-dasharray": [1, 0],
                    }}
                    interactive
                    onHover={(e) =>
                      e?.feature
                        ? setHoverInfo({
                            x: e.originalEvent.point.x,
                            y: e.originalEvent.point.y,
                            nome: e.feature.properties.name,
                            casos: e.feature.properties.casos || 0,
                          })
                        : setHoverInfo(null)
                    }
                  />

                  {marcadores.map((p) => (
                    <MapMarker key={p.id} longitude={p.lng} latitude={p.lat}>
                      <MarkerContent>{/* ... igual */}</MarkerContent>
                      <MarkerPopup className="...">
                        {/* ... igual */}
                      </MarkerPopup>
                    </MapMarker>
                  ))}
                </Map>

                {hoverInfo && (
                  <div className="...">
                    <h4>{hoverInfo.nome}</h4>
                    <span className={theme.badge}>{hoverInfo.casos}</span>
                  </div>
                )}
              </div>
            )}

            {showPeriodFilter && (
              <div className="absolute top-20 right-4 z-20 flex items-center gap-2">
                <MapPeriodFilter
                  filtroTipo={filtroTipo}
                  setFiltroTipo={setFiltroTipo}
                  dataInicio={dataInicio}
                  setDataInicio={setDataInicio}
                  dataFim={dataFim}
                  setDataFim={setDataFim}
                />
              </div>
            )}

            <ButtonTheme
              activeStyle={activeStyle}
              setActiveStyle={setActiveStyle}
              toggleTheme={() =>
                setActiveStyle((p) => (p === "dark" ? "light" : "dark"))
              }
            />
          </div>
        </main>
      </div>
    </div>
  );
}
