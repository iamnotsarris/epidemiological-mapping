import EndemicMap from "../EndemicMap.jsx";
import { cnesParaAreaMapa } from "../../data/mapMappings.js";

export default function MapViolencia({ isPrivateView = true }) {
  return (
    <EndemicMap
      isPrivateView={isPrivateView}
      endemiaId="violenciadom"
      apiEndpoint="/api/violenciadomestica/"
      title="Mapa Epidemiológico - Violência Doméstica"
      countMode="nu_notific"
      colorTheme="rose"
      cnesMap={cnesParaAreaMapa}
    />
  );
}
