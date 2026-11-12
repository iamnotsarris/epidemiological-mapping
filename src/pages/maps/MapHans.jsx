import EndemicMap from "../EndemicMap.jsx";

export default function MapHans({ isPrivateView }) {
  return (
    <EndemicMap
      isPrivateView={isPrivateView}
      endemiaId="hanseniase"
      apiEndpoint="/api/hans/"
      title="Mapa Epidemiológico - Hanseníase"
      countMode="nu_notific"
      colorTheme="violet"
    />
  );
}
