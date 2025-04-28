import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "./OrderContext";
import axios from "axios"

function SelectLocation() {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const navigate = useNavigate();
  const { setOrderInfo } = useOrder(); 

  useEffect(() => {
    async function fetchStores() {
      const res = await fetch("http://localhost:8080/api/getAllStores", {
        credentials: "include",
      });
      const data = await res.json();
      setStores(data);
    }
    fetchStores();
  }, []);

  const handleSelectStore = (e) => {
    setSelectedStore(e.target.value);
  };

  const handleCreateOrder = async () => {
    if (!selectedStore) {
      alert("Please select a store first!");
      return;
    }

    // // Save storeID to session
    // await axios.post(`http://localhost:8080/api/setStore`, {
    //   storeID: selectedStore,
    // },
    // {
    //   credentials: "include",
    // })

    // Now create order
    await fetch(`http://localhost:8080/api/setStore/${selectedStore}`, {
      method: "POST",
      credentials: "include",
    });

    localStorage.setItem('storeID', selectedStore)

    const response = await fetch(`http://localhost:8080/api/createOrder`, {
      method: "POST",
      credentials: "include",
    });

    console.log("This is the resoponse:")
    console.log(response)
    localStorage.setItem('orderID', response['OrderID'])

    const orderData = await response.json();
    setOrderInfo(orderData); 

    navigate("/shop"); 
  };

  return (
    <div className="select-location-page">
      <h2>Select Your Store</h2>
      <select onChange={handleSelectStore} value={selectedStore}>
        <option value="">-- Choose a store --</option>
        {stores.map((store) => (
          <option key={store.StoreID} value={store.StoreID}>
            {store.Address}
          </option>
        ))}
      </select>
      <br />
      <button onClick={handleCreateOrder} className="create-order-button">
        Create Order
      </button>
    </div>
  );
}

export default SelectLocation;
