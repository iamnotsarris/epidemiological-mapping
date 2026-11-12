export const MAP_STYLES = {
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  openstreetmap: "https://tiles.openfreemap.org/styles/bright",
  openstreetmap3d: "https://tiles.openfreemap.org/styles/liberty",
  satellite: {
    version: 8,
    sources: {
      "esri-satellite": {
        type: "raster",
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
        maxzoom: 17,
        attribution: "Tiles &copy; Esri &mdash; Source: Esri",
      },
    },
    layers: [
      {
        id: "satellite-layer",
        type: "raster",
        source: "esri-satellite",
        minzoom: 0,
        maxzoom: 22,
      },
    ],
  },
};

// Cor do spinner e do badge no tooltip de cada mapa
export const THEMES = {
  red: { spinner: "text-red-500", badge: "bg-red-100 text-red-700" },
  rose: { spinner: "text-rose-500", badge: "bg-rose-100 text-rose-700" },
  amber: { spinner: "text-amber-500", badge: "bg-amber-100 text-amber-700" },
  violet: {
    spinner: "text-violet-500",
    badge: "bg-violet-100 text-violet-700",
  },
  emerald: {
    spinner: "text-emerald-500",
    badge: "bg-emerald-100 text-emerald-700",
  },
  teal: { spinner: "text-teal-500", badge: "bg-teal-100 text-teal-700" },
  purple: {
    spinner: "text-purple-500",
    badge: "bg-purple-100 text-purple-700",
  },
  blue: { spinner: "text-blue-500", badge: "bg-blue-100 text-blue-700" },
};
