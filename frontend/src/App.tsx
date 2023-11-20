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
    <div className='flex bg-black'>
      <div className='w-1/4 p-4 '>
        <h1 className='text-white font-bold'>Shortest path hackathon</h1>
        <div className='mt-24'>
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
          className='w-full p-2 mt-6 bg-blue-500 text-white rounded'
        >
          Find Route
        </button>
        </div>
      </div>
      <div className='w-3/4'>
      <MapContainer
  className="full-height-map"
  c
  zoom={6}
  minZoom={3}
  maxZoom={19}
  maxBounds={[[-85.06, -180], [85.06, 180]]}
  scrollWheelZoom={true}>
  <TileLayer
    attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/about" target="_blank">OpenStreetMap</a> contributors'
    url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
  />
  {/* TODO: Add markers */}
</MapContainer>
      </div>
    </div>
  );
}

export default App;
