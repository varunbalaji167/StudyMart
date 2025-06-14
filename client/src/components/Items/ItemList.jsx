import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ItemCard from './ItemCard';
import ItemFilters from './ItemFilters';
import Navbar from '../Navbar';
import { Loader2 } from 'lucide-react';
import { FaBoxOpen, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      toast.dismiss(); 
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}items`,
          { params: filters }
        );

        if (res.data.success && Array.isArray(res.data.data)) {
          setItems(res.data.data);
          setError(null);
        } else {
          console.error("Unexpected API response:", res);
          setItems([]);
          setError("Unexpected response format.");
        }
      } catch (err) {
        console.error("Failed to fetch items:", err);
        setItems([]);
        setError("Failed to load items. Please try again later.");
      }
      setLoading(false);
    };

    fetchData();
  }, [filters]);

  return (
    <>
      <Navbar />
      <div className="bg-[#F3F6FA] min-h-screen px-4 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-[#2A6FDB]">🛍️ Browse Available Items</h1>
          <ItemFilters onFilterChange={setFilters} />

          {loading && (
            <div className="flex justify-center items-center text-[#2A6FDB] mt-10">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2 text-lg font-medium">Loading items...</span>
            </div>
          )}

          {!loading && error && (
            <div className="flex items-center gap-3 text-[#EF4444] bg-red-50 border border-[#EF4444] rounded-lg p-4">
              <FaExclamationTriangle className="text-xl" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="flex flex-col items-center text-[#6B7280] mt-10">
              <FaBoxOpen className="text-5xl mb-3 text-[#FFD54F]" />
              <p className="text-xl font-medium">No items found</p>
              <p className="text-sm">Try adjusting your filters.</p>
            </div>
          )}

          {!loading && !error && items.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ItemList;