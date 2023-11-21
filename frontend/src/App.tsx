import { useState } from 'react';
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  Tooltip,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

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

  console.log('INIZIA LA CHIAMATA');

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
  const [polyline, setPolyline] = useState<number[][]>([]); // pois?.map((poi) => [poi.latitude, poi.longitude])

  const handlePointAChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPointA(event.target.value);
  };

  const handlePointBChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPointB(event.target.value);
  };

  // useEffect(() => {
  //   if (pointA && pointB) {
  //     console.log('FATTA');

  //     handleFindRoute({ pointA, pointB }).then((data) => {
  //       console.log(data);
  //       setPolyline(
  //         data?.path?.map((point) => [
  //           pois.find((poi) => poi.id === point)?.latitude || 0,
  //           pois.find((poi) => poi.id === point)?.longitude || 0,
  //         ]),
  //       );
  //       setPoisOnMap(
  //         pois.filter((poi) => data.path.find((item) => item === poi.id)),
  //       );
  //     });
  //   }
  // }, [pointA, pointB, pois]);

  return (
    <div className='relative'>
      <div className='absolute top-10 left-10 mt-56 w-1/4 h-64 bg-black rounded-lg bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-20  text-white p-4 z-10'>
        <label className='p-[6px]'>Dark Mode</label>
        <input
          type='checkbox'
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
          style={{ background: '#73AD21' }}
        />
        {pois.length ? (
          <>
            <select
              onChange={handlePointAChange}
              id='countries'
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 my-3'
            >
              <option>Punto di partenza</option>
              {pois
                .filter((poi) => poi.id !== pointB)
                .map((poi) => (
                  <option key={'start_'.concat(poi.id)} value={poi.id}>
                    {poi.name}
                  </option>
                ))}
            </select>
            <select
              onChange={handlePointBChange}
              id='countries'
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            >
              <option>Punto di arrivo</option>
              {pois
                .filter((poi) => poi.id !== pointA)
                .map((poi) => (
                  <option key={'end_'.concat(poi.id)} value={poi.id}>
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
                    ]),
                  );
                  setPoisOnMap(
                    pois.filter((poi) =>
                      data.path.find((item) => item === poi.id),
                    ),
                  );
                });
              }}
              className='w-full p-2 mt-6  mb-2 bg-white rounded-lg bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10  text-white  z-10 hover:bg-[#fed683] hover:text-black '
            >
              Calcola la rotta
            </button>
          </>
        ) : (
          <p className='pl-2'>Loading data...</p>
        )}
      </div>

      <MapContainer
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        center={[43, 10.69222]}
        className='w-100% h-screen'
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
        style={{ position: 'relative', zIndex: 1 }}
      >
        <TileLayer
          url={
            darkMode
              ? 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
              : 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png'
          }
        />
        {poisOnMap?.length &&
          poisOnMap?.map((point, index) => (
            <Marker position={[point.latitude, point.longitude]} key={index}>
              <Tooltip
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                sticky
              >
                {point.name}
              </Tooltip>
            </Marker>
          ))}
        <Polyline pathOptions={{ color: 'lime' }} positions={polyline} />
      </MapContainer>
    </div>
  );
}

export default App;
