import EndemicMap from "../EndemicMap.jsx";
import { bairroParaAreaUbs, cnesParaAreaMapa } from "../../data/mapMappings.js";

export default function MapDengue({ isPrivateView }) {
  return (
    <EndemicMap
      isPrivateView={isPrivateView}
      endemiaId="dengue"
      apiEndpoint="/api/dengue/"
      title="Mapa Epidemiológico - Dengue"
      countMode="increment"
      colorTheme="red"
      bairroMap={bairroParaAreaUbs}
      cnesMap={cnesParaAreaMapa}
      filterPredicate={(p) => {
        const a = (p.id_agravo || "").toUpperCase();
        return a.includes("A90") || a === "";
      }}
    />
  );
}
