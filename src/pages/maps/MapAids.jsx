import EndemicMap from "../EndemicMap.jsx";
import { cnesParaAreaMapa } from "../../data/mapMappings.js";

export default function MapAids({ isPrivateView }) {
  return (
    <EndemicMap
      isPrivateView={isPrivateView}
      endemiaId="aidsadulta"
      apiEndpoint="/api/aidsadulta/"
      title="Mapa Epidemiológico - AIDS"
      countMode="nu_notific"
      colorTheme="rose"
      cnesMap={cnesParaAreaMapa}
    />
  );
}
