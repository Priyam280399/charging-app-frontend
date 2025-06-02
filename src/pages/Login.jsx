// import { useState } from 'react';
// // import axios from 'axios';
// import API from "../services/api";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//     //   const res = await axios.post('/auth/login', form);
//         const res = await API.post("/auth/login", {
//         email: form.email,
//         password: form.password,
//       });
//       localStorage.setItem('token', res.data.token);
//       // Redirect to Chargers Page (will add routing soon)
//       alert('Login successful');
//       navigate("/chargers");
//     } catch (err) {
//       setError('Invalid credentials');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">
//         <h2 className="text-xl font-bold mb-4">Login</h2>

//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           className="border p-2 mb-3 w-full"
//           onChange={handleChange}
//           required
//         />

//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           className="border p-2 mb-3 w-full"
//           onChange={handleChange}
//           required
//         />

//         {error && <p className="text-red-500 text-sm">{error}</p>}

//         <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded">
//           Login
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      alert("Login successful");
      navigate("/chargers");
    } catch (err) {
      setError("Invalid email or password");
      
    }
    
  };
//   navigate("/register");

//   // 👉 Navigate to /register
//   const goToRegister = () => {
   
//   };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 px-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 sm:p-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-700 mb-6">
          Login to Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Login
          </button>
        </form>

        {/* Register link
        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <a href="/Register" className="text-blue-500 hover:underline">
            Register
          </a>
        </p> */}
      </div>
    </div>
  );
};

export default Login;
