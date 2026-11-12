import EndemicMap from "../EndemicMap.jsx";
import { cnesParaAreaMapa } from "../../data/mapMappings.js";

export default function MapLeishmaniose({ isPrivateView }) {
  return (
    <EndemicMap
      isPrivateView={isPrivateView}
      endemiaId="leish"
      apiEndpoint="/api/leish/"
      title="Mapa Epidemiológico - Leishmaniose"
      countMode="nu_notific"
      colorTheme="teal"
      cnesMap={cnesParaAreaMapa} // cai pra heurística de nome se não bater
    />
  );
}
