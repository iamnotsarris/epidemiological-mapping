import EndemicMap from "../EndemicMap.jsx";

export default function MapHepa({ isPrivateView }) {
  return (
    <EndemicMap
      isPrivateView={isPrivateView}
      endemiaId="hepatite"
      apiEndpoint="/api/hepatite/"
      title="Mapa Epidemiológico - Hepatite"
      countMode="nu_notific"
      colorTheme="amber"
    />
  );
}
