import { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function App() {
  const [pointA, setPointA] = useState('');
  const [pointB, setPointB] = useState('');

  const handlePointAChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPointA(event.target.value);
  };

  const handlePointBChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPointB(event.target.value);
  };

  const handleFindRoute = () => {};

  return (
    <div className='flex'>
      <div className='w-1/4 p-4'>
        <input
          type='text'
          value={pointA}
          onChange={handlePointAChange}
          placeholder='Point A'
          className='w-full p-2 mb-2 border border-gray-300 rounded'
        />
        <input
          type='text'
          value={pointB}
          onChange={handlePointBChange}
          placeholder='Point B'
          className='w-full p-2 mb-2 border border-gray-300 rounded'
        />
        <button
          onClick={handleFindRoute}
          className='w-full p-2 bg-blue-500 text-white rounded'
        >
          Find Route
        </button>
      </div>
      <div className='w-3/4'>
        <MapContainer
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          center={[41.8719, 12.5674]}
          zoom={6}
          className='w-full h-screen'
        >
          <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
          {/* {points.map((point, index) => (
            <Marker position={[point.lat, point.lng]} key={index} />
          ))} */}
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
