import EndemicMap from "../EndemicMap.jsx";

export default function MapChagas({ isPrivateView }) {
  return (
    <EndemicMap
      isPrivateView={isPrivateView}
      endemiaId="chagas"
      apiEndpoint="/api/chagas/"
      title="Mapa Epidemiológico - Chagas"
      countMode="nu_notific"
      colorTheme="amber"
    />
  );
}
