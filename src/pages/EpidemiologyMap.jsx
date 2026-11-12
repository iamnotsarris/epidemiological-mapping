import EndemicMap from "./EndemicMap.jsx";
import { bairroParaAreaUbs } from "../data/mapMappings.js";

export default function EpidemiologicMap({ isPrivateView }) {
  return (
    <EndemicMap
      isPrivateView={isPrivateView}
      endemiaId="gerais"
      apiEndpoint="/api/dengue/"
      title="Mapa Epidemiológico - Extensão Territorial"
      countMode="increment"
      colorTheme="blue"
      showMobileHint
      showPeriodFilter={false}
      bairroMap={bairroParaAreaUbs}
    />
  );
}
