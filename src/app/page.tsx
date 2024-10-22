"use client";
import { productModel } from "./Models/model";
import { useEffect, useState } from 'react';
import Cart1 from "@/Components/Cart1";


const Home = () => {

  const [products, setProducts] = useState<productModel[]>([]);
  const [toggleCart, setToggleCart] = useState<boolean>(false);
  const [amounts, setAmounts] = useState<{ [key: number]: number }>({});
  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://localhost:7267/api/Shopping/GetAllProducts');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      setProducts(data);
      const initialAmounts = data.reduce((acc: { [key: number]: number }, product: productModel) => {
        acc[product.id] = 0;
        return acc;
      }, {});
      setAmounts(initialAmounts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while fetching products');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }
  if (error) {
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;
  }

  const handleIncrement = (id: number) => {
    console.log("id =", id);
    setAmounts(prevAmounts => {
      const currentAmount = prevAmounts[id];
      const product = products.find(product => product.id === id);
  
      if (product && currentAmount >= product.stock_remain) {
        alert(`Product Name: ${product.product_name} has reached its maximum stock amount!`);
        return prevAmounts;
      }
  
      return { 
        ...prevAmounts, 
        [id]: currentAmount + 1 
      };
    });
  };
  
  const handleDecrement = (id: number) => {
    console.log("id =", id);
    setAmounts(prevAmounts => ({ ...prevAmounts, [id]: Math.max(prevAmounts[id] - 1, 0) }));
  };

  const viewCart = () => {
    setToggleCart(!toggleCart);
  };

  const clearData = () => {
    const resetAmounts: { [key: number]: number } = {}; 
    Object.keys(amounts).forEach(id => {
      resetAmounts[Number(id)] = 0;
    });
    setAmounts(resetAmounts);
  };
  
  
  return (
    <>

      {!toggleCart && <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" >
        {products.length > 0 ? (
          products.map((product1: productModel) => (
            <div
              key={product1.id}
              className="border-2 border-black p-4 rounded-lg shadow-md">
              <p className="font-bold">Product : {product1.product_name}</p>
              <div className="flex justify-end">
                <button className="" onClick={() => handleIncrement(product1.id)}>+</button>
                {/* <button className="" onClick={() => handleDecrement(product1.id)}>-</button> */}
              </div>
              <div>
                <p>{product1.product_name} in Cart = {amounts[product1.id]}</p>
                <p> Price : {product1.price}</p>
                <p> Stock ramins = {product1.stock_remain}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
      }


      {toggleCart && <Cart1  products={products} amounts={amounts} 
      handleIncrement={handleIncrement} handleDecrement={handleDecrement} viewCart={viewCart} clearData={clearData}
      fetchData= {fetchData} />}




      <div className="mt-6 text-center">
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          onClick={viewCart}>
          View Cart
        </button>
      </div>
    </>
  );
};



export default Home;