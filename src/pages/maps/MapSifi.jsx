import EndemicMap from "../EndemicMap.jsx";

export default function MapSifi({ isPrivateView }) {
  return (
    <EndemicMap
      isPrivateView={isPrivateView}
      endemiaId="sifilis"
      apiEndpoint="/api/sifilis/"
      title="Mapa Epidemiológico - Sífilis"
      countMode="increment" // ⚠️ sífilis soma +1 por registro, diferente das outras
      colorTheme="purple"
    />
  );
}
