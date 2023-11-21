import { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function App() {
  const [pointA, setPointA] = useState('');
  const [pointB, setPointB] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const handlePointAChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPointA(event.target.value);
  };

  const handlePointBChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPointB(event.target.value);
  };

  const handleFindRoute = () => {};

  return (
    <div className='relative'>
      <div className='absolute top-10 left-10 mt-56 w-1/4 h-64 bg-black rounded-lg bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-20  text-white p-4 z-10'>
      <label style={{padding: "6px"}}>
            Dark Mode 
           
          </label>
          <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              style={{background: "#73AD21"}}
            />
        <input
          type='text'
          value={pointA}
          onChange={handlePointAChange}
          placeholder='Punto di partenza'
          className='w-full p-2 mb-2 mt-6 bg-black rounded-lg bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10    z-10 focus:outline-none focus:ring focus:border-yellow-400  '
        />
        <input
          type='text'
          value={pointB}
          onChange={handlePointBChange}
          placeholder='Punto di arrivo'
          className='w-full p-2 mb-2 bg-black rounded-lg bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10  text-white   z-10 focus:outline-none focus:ring focus:border-yellow-400 '
        />
        <button
          onClick={handleFindRoute}
          className='w-full p-2 mt-6  mb-2 bg-white rounded-lg bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10  text-white  z-10 hover:bg-[#fed683] hover:text-black '
        >
          Calcola la rotta
        </button>
      </div>

      <MapContainer
          center={[43, 10.69222]}
          className='w-100% h-screen'
          zoom={6}
          minZoom={3}
          maxZoom={19}
          maxBounds={[[-85.06, -180], [85.06, 180]]}
          scrollWheelZoom={true}
          style={{ position: 'relative', zIndex: 1 }}>
          <TileLayer
            url={darkMode ? "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png" : "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"}
          />
        </MapContainer>
    </div>
  );
}

export default App;

