import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SelectLocation() {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const navigate = useNavigate();

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

    await fetch(`http://localhost:8080/api/setStore/${selectedStore}`, {
      method: "POST",
      credentials: "include",
    });

    await fetch(`http://localhost:8080/api/createOrder`, {
      method: "POST",
      credentials: "include",
    });

    navigate("/shopping");
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
