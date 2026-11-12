import EndemicMap from "../EndemicMap.jsx";

export default function MapTubercu({ isPrivateView }) {
  return (
    <EndemicMap
      isPrivateView={isPrivateView}
      endemiaId="tuberculose"
      apiEndpoint="/api/tuberculose/"
      title="Mapa Epidemiológico - Tuberculose"
      countMode="nu_notific"
      colorTheme="emerald"
    />
  );
}
