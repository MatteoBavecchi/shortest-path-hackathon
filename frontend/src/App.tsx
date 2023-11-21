import { useState } from 'react';
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  Tooltip,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const markerIconUrls = {
  'default': 'https://images.emojiterra.com/twitter/v14.0/512px/1f535.png',
  'grayed': 'grayed.png',
  'highlighted': "https://www.federmobili.it/wp-content/uploads/2021/01/pallino-arancione.png"
}

const markerIconProps = {
  iconSize: [10, 10], // dimensioni dell'icona
  iconAnchor: [5, 5], // punto dell'icona che corrisponderà alla posizione del marker
  popupAnchor: [0, 0], // punto relativo all'icona dove verrà ancorato il popup
  shadowSize: [0, 0], // dimensioni dell'ombra
  shadowAnchor: [0, 0], // punto dell'ombra che corrisponderà all'ombra del marker
}

interface IPoiProps {
  id: string;
  uniqId: string;
  latitude: number;
  longitude: number;
  name: string;
}

interface IFindRouteInputProps {
  pointA: string;
  pointB: string;
}

interface IFindRouteResponseProps {
  path: string[];
  total_distance: number;
}

const getPois = async (): Promise<IPoiProps[]> => {
  try {
    const body =
      '{"query":"query {\\n\\tpois {\\n\\t\\tid\\n\\t\\tuniqId\\n\\t\\tlatitude\\n\\t\\tlongitude\\n\\t\\tname\\n\\t}\\n}\\n"}';
    const response = await fetch('https://stg.locatorapi.io/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer c3dbd8793636e5b9e173601bdb0bb191',
      },
      body,
    });

    if (response.ok) {
      const data = await response.json();
      return data?.data?.pois;
    } else {
      console.error('Error:', response.status);
    }
  } catch (error) {
    console.error('Error:', error);
  }
  return [];
};

const handleFindRoute = async (
  props: IFindRouteInputProps,
): Promise<IFindRouteResponseProps> => {
  const { pointA, pointB } = props;

  try {
    const response = await fetch(
      `http://localhost:5173/api/shortest_path?from=${pointA}&to=${pointB}`,
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error('Error:', response.status);
    }
  } catch (error) {
    console.error('Error:', error);
  }
  return { path: [], total_distance: 0 };
};

function App() {
  const [pointA, setPointA] = useState<string>('');
  const [pointB, setPointB] = useState<string>('');
  const [darkMode, setDarkMode] = useState(true);
  const [pois, setPois] = useState<IPoiProps[]>([]);
  const [poisOnMap, setPoisOnMap] = useState<IPoiProps[]>([]);
  const [highlightedPoisOnMap, setHighlightedPoisOnMap] = useState<IPoiProps[]>([]);
  const [totalDistance, setTotalDistance] = useState<string>();
  const [polyline, setPolyline] = useState<number[][]>([]); // pois?.map((poi) => [poi.latitude, poi.longitude])

  const handlePointAChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPointA(event.target.value);
  };

  const handlePointBChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPointB(event.target.value);
  };

  const getIcon = (icon: string) => {
    return L.icon({
      iconUrl: icon,
      ...markerIconProps
    });
  }

  return (
    <div className="relative">
      <div className="absolute top-2 right-5 bg-black  rounded-full bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-20 px-[10px] text-white   z-10">
        <div
          onClick={() => setDarkMode(!darkMode)}
          style={{ cursor: "pointer", fontSize: "35px", color: "white" }}
        >
          {darkMode ? "☀" : "☾"}
        </div>
      </div>
      <div className="absolute top-10 left-10 mt-56 w-1/4 h-64 bg-black rounded-lg bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-20  text-white p-4 z-10">
        {pois.length ? (
          <>
            <select
              onChange={handlePointAChange}
              id="countries"
              className="w-full mt-8 p-2 mb-2 bg-black backdrop-filter backdrop-blur-xl bg-opacity-20 outline-none rounded-lg"
            >
              <option>Punto di partenza</option>
              {pois
                .filter((poi) => poi.id !== pointB)
                .map((poi) => (
                  <option key={"start_".concat(poi.id)} value={poi.id}>
                    {poi.name}
                  </option>
                ))}
            </select>
            <select
              onChange={handlePointBChange}
              id="countries"
              className="w-full p-2 mb-2 bg-black backdrop-filter backdrop-blur-xl bg-opacity-20 outline-none rounded-lg"
            >
              <option>Punto di arrivo</option>
              {pois
                .filter((poi) => poi.id !== pointA)
                .map((poi) => (
                  <option key={"end_".concat(poi.id)} value={poi.id}>
                    {poi.name}
                  </option>
                ))}
            </select>
            <button
              disabled={!pointA || !pointB}
              onClick={() => {
                handleFindRoute({ pointA, pointB }).then((data) => {
                  console.log(data);
                  setPolyline(
                    data?.path?.map((point) => [
                      pois.find((poi) => poi.id === point)?.latitude || 0,
                      pois.find((poi) => poi.id === point)?.longitude || 0,
                    ])
                  );
                  setHighlightedPoisOnMap(
                    pois.filter((poi) =>
                      data.path.find((item) => item === poi.id)
                    )
                  );
                  if (typeof data.total_distance === 'number')
                    setTotalDistance(Math.round(data.total_distance / 1000).toString());
                  else
                    setTotalDistance('');
                });
              }}
              className="w-full p-2 mt-6  mb-2 bg-white rounded-lg bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10  text-white  z-10 hover:bg-[#fed683] hover:text-black "
            >
              Calcola il percorso
            </button>
            {totalDistance && <span>Distanza totale: {totalDistance} Km</span>}
          </>
        ) : (
          <p className="pl-2">Loading data...</p>
        )}
      </div>

      <MapContainer
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        center={[43, 10.69222]}
        className="w-100% h-screen"
        zoom={6}
        minZoom={3}
        maxZoom={19}
        maxBounds={[
          [-85.06, -180],
          [85.06, 180],
        ]}
        whenReady={async () => {
          const data = await getPois();
          setPois(data);
          setPoisOnMap(data);
        }}
        scrollWheelZoom={true}
        style={{ position: "relative", zIndex: 1 }}
      >
        <TileLayer
          url={
            darkMode
              ? "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
              : "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
          }
        />
        {poisOnMap?.length &&
          poisOnMap?.map((point, index) => (
            <Marker
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              icon={getIcon(markerIconUrls["default"])}
              position={[point.latitude, point.longitude]}
              key={index}
            >
              <Tooltip
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                sticky
              >
                {point.name}
              </Tooltip>
            </Marker>
        ))}
        {highlightedPoisOnMap?.length &&
          highlightedPoisOnMap?.map((point, index) => (
            <Marker
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              icon={getIcon(markerIconUrls["highlighted"])}
              position={[point.latitude, point.longitude]}
              key={index}
            >
              <Tooltip
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                sticky
              >
                {point.name}
              </Tooltip>
            </Marker>
        ))}
        <Polyline pathOptions={{ color: "#6b7280" }} positions={polyline} />
      </MapContainer>
    </div>
  );
}

export default App;
