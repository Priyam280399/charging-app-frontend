import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from 'leaflet';
import API from "../services/api";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const ChargerList = () => {
  const [chargers, setChargers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    status: "",
    powerOutput: "",
    connectorType: "",
    latitude: "",
    longitude: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch Chargers
  useEffect(() => {
    fetchChargers();
  }, []);

  const fetchChargers = async () => {
    try {
      const res = await API.get("/chargers");
      setChargers(res.data);
    } catch (error) {
      console.error("Failed to fetch chargers:", error);
    }
  };

  // Handle Input Change
  const handleChange = (e) => {
      console.log(e.target.name, e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
       
  };
       console.log('-->', formData);
  // Submit New or Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    const chargerData = {
      name: formData.name,
      status: formData.status,
      powerOutput: formData.powerOutput,
      connectorType: formData.connectorType,
      location: {
        latitude: formData.latitude,
        longitude: formData.longitude,
      },
    };
        console.log(chargerData, 'chargerData');
    try {
      if (editingId) {
        await API.put(`/chargers/${editingId}`, {
          ...chargerData,
          location: chargerData.location,
        });
      } else {
        await API.post("/chargers", chargerData);
      }

      setFormData({
        name: "",
        status: "",
        powerOutput: "",
        connectorType: "",
        latitude: "",
        longitude: "",
      });
      setEditingId(null);
      fetchChargers();
    } catch (err) {
      console.error("Error saving charger:", err);
    }
  };

  // Handle Edit
  const handleEdit = (charger) => {
    setFormData({
      name: charger.name,
      status: charger.status,
      powerOutput: charger.powerOutput,
      connectorType: charger.connectorType,
      latitude: charger.location.latitude,
      longitude: charger.location.longitude,
    });
    setEditingId(charger._id);
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this charger?")) return;
    try {
      await API.delete(`/chargers/${id}`);
      fetchChargers();
    } catch (err) {
      console.error("Failed to delete charger:", err);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Charging Stations</h2>

      {/* Charger Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-100 p-4 rounded">
        <h3 className="font-semibold text-lg">{editingId ? "Edit" : "Add"} Charger</h3>
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="status"
          placeholder="Status (e.g., Available)"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="powerOutput"
          placeholder="Power Output (kW)"
          value={formData.powerOutput}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="connectorType"
          placeholder="Connector Type"
          value={formData.connectorType}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="latitude"
          placeholder="Latitude"
          value={formData.latitude}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="longitude"
          placeholder="Longitude"
          value={formData.longitude}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editingId ? "Update" : "Add"} Charger
        </button>
      </form>

      {/* Charger List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chargers.map((charger) => (
          <div key={charger._id} className="border p-4 rounded shadow bg-white">
            <h3 className="font-semibold text-lg">{charger.name}</h3>
            <p>Status: {charger.status}</p>
            <p>Power Output: {charger.powerOutput} kW</p>
            <p>Connector: {charger.connectorType}</p>
            <p>Lat: {charger.location?.latitude}</p>
            <p>Lng: {charger.location?.longitude}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEdit(charger)}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(charger._id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Map */}
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {chargers.map((charger) => {
          const lat = parseFloat(charger.location?.latitude);
          const lng = parseFloat(charger.location?.longitude);
           console.log(`Charger: ${charger.name}, Lat: ${lat}, Lng: ${lng}`);
           if (isNaN(lat) || isNaN(lng)) {
            console.log(`Skipping charger "${charger.name}" due to invalid coordinates:`, charger.location);
            return null;
          }

          return (
            <Marker key={charger._id} position={[lat, lng]}>
              <Popup>
                <strong>{charger.name}</strong>
                <br />
                Power: {charger.powerOutput} kW
                <br />
                Status: {charger.status}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default ChargerList;



// import React, { useEffect, useState } from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import API from "../services/api";

// // Fix missing marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
//   iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
// });

// const ChargerList = () => {
//   const [chargers, setChargers] = useState([]);
//   const [formData, setFormData] = useState({
//     name: "",
//     status: "",
//     powerOutput: "",
//     connectorType: "",
//     latitude: "",
//     longitude: "",
//   });
//   const [editingId, setEditingId] = useState(null);

//   useEffect(() => {
//     fetchChargers();
//   }, []);

//   const fetchChargers = async () => {
//     try {
//       const res = await API.get("/chargers");
//       setChargers(res.data);
//     } catch (error) {
//       console.error("Failed to fetch chargers:", error);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const chargerData = {
//       name: formData.name,
//       status: formData.status,
//       powerOutput: formData.powerOutput,
//       connectorType: formData.connectorType,
//       location: {
//         latitude: formData.latitude,
//         longitude: formData.longitude,
//       },
//     };

//     try {
//       if (editingId) {
//         await API.put(`/chargers/${editingId}`, chargerData);
//       } else {
//         await API.post("/chargers", chargerData);
//       }

//       setFormData({
//         name: "",
//         status: "",
//         powerOutput: "",
//         connectorType: "",
//         latitude: "",
//         longitude: "",
//       });
//       setEditingId(null);
//       fetchChargers();
//     } catch (err) {
//       console.error("Error saving charger:", err);
//     }
//   };

//   const handleEdit = (charger) => {
//     setFormData({
//       name: charger.name,
//       status: charger.status,
//       powerOutput: charger.powerOutput,
//       connectorType: charger.connectorType,
//       latitude: charger.location.latitude,
//       longitude: charger.location.longitude,
//     });
//     setEditingId(charger._id);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this charger?")) return;
//     try {
//       await API.delete(`/chargers/${id}`);
//       fetchChargers();
//     } catch (err) {
//       console.error("Failed to delete charger:", err);
//     }
//   };

//   return (
//     <div className="p-4 space-y-6">
//       <h2 className="text-2xl font-bold mb-4">Charging Stations</h2>

//       {/* Charger Form */}
//       <form onSubmit={handleSubmit} className="space-y-4 bg-gray-100 p-4 rounded">
//         <h3 className="font-semibold text-lg">{editingId ? "Edit" : "Add"} Charger</h3>
//         <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
//         <input name="status" placeholder="Status (e.g., Available)" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded" required />
//         <input name="powerOutput" placeholder="Power Output (kW)" value={formData.powerOutput} onChange={handleChange} className="w-full p-2 border rounded" required />
//         <input name="connectorType" placeholder="Connector Type" value={formData.connectorType} onChange={handleChange} className="w-full p-2 border rounded" required />
//         <input name="latitude" placeholder="Latitude" value={formData.latitude} onChange={handleChange} className="w-full p-2 border rounded" required />
//         <input name="longitude" placeholder="Longitude" value={formData.longitude} onChange={handleChange} className="w-full p-2 border rounded" required />
//         <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
//           {editingId ? "Update" : "Add"} Charger
//         </button>
//       </form>

//       {/* Charger List */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {chargers.map((charger) => (
//           <div key={charger._id} className="border p-4 rounded shadow bg-white">
//             <h3 className="font-semibold text-lg">{charger.name}</h3>
//             <p>Status: {charger.status}</p>
//             <p>Power Output: {charger.powerOutput} kW</p>
//             <p>Connector: {charger.connectorType}</p>
//             <p>Lat: {charger.location?.latitude}</p>
//             <p>Lng: {charger.location?.longitude}</p>
//             <div className="flex gap-2 mt-2">
//               <button onClick={() => handleEdit(charger)} className="bg-yellow-500 text-white px-2 py-1 rounded">
//                 Edit
//               </button>
//               <button onClick={() => handleDelete(charger._id)} className="bg-red-500 text-white px-2 py-1 rounded">
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Map with TileLayer and Markers */}
//       <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "400px", width: "100%" }}>
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution="&copy; OpenStreetMap contributors"
//         />
//         {chargers.map((charger) => {
//           const lat = parseFloat(charger.location?.latitude);
//           const lng = parseFloat(charger.location?.longitude);
//           if (isNaN(lat) || isNaN(lng)) return null;

//           return (
//             <Marker key={charger._id} position={[lat, lng]}>
//               <Popup>
//                 <strong>{charger.name}</strong>
//                 <br />
//                 Power: {charger.powerOutput} kW
//                 <br />
//                 Status: {charger.status}
//               </Popup>
//             </Marker>
//           );
//         })}
//       </MapContainer>
//     </div>
//   );
// };

// export default ChargerList;
