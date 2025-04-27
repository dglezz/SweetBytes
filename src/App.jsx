import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import HomePage from "./components/HomePage";
import ShoppingPage from "./components/ShoppingPage";
import ItemPage from "./components/ItemPage";
import Header from "./components/Header";
import HomeHeader from "./components/HomeHeader";
import Footer from "./components/Footer";
import "./index.css";

function App() {
  const [itemsData, setItemsData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/getAllItems")
      .then((response) => {
        setItemsData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  }, []);

  return (
    <Router>
      <PageLayout itemsData={itemsData} />
    </Router>
  );
}

function PageLayout({ itemsData }) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      {isHome ? <HomeHeader /> : <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShoppingPage itemsData={itemsData} />} />
        <Route path="/item/:id" element={<ItemPage itemsData={itemsData} />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;

// import { useState, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import axios from 'axios';

// function App() {

//   // testing backend server connection to frontend
//   const [count, setCount] = useState(0);
//   const [itemsData, setItemsData] = useState([]);

//   useEffect(() => {
//     axios.get('http://localhost:8080/api/getAllItems')
//       .then(response => {
//         setItemsData(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching items data:', error);
//       });
//   }, []);

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>

//       <div>
//       <h1>All Items Data:</h1>
//       <ul>
//         {itemsData.map((items, index) => (
//           <li key={index}>
//             {JSON.stringify(items)}
//           </li>
//         ))}
//       </ul>
//     </div>
//     </>
//   )
// }

// export default App
