"use client";
import { productModel } from "@/app/Models/model";


interface Cart1Props {
    products: productModel[];
    amounts: { [key: number]: number };
    handleIncrement: (id: number) => void;
    handleDecrement: (id: number) => void;
    viewCart : () => void;
    clearData: () => void;
    fetchData: () => void;
}
;

const Cart1: React.FC<Cart1Props> = ({ products, amounts, handleIncrement, handleDecrement , viewCart,clearData , fetchData }) => {
    const handlePurchase = async () => {
        try {
          const payload = Object.entries(amounts).map(([id, amount]) => ({
            productId: Number(id),
            amount,
          }));
      
          const response = await fetch('https://localhost:7267/api/Shopping/UpdateStock', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          alert('Purchase successful!');
          clearData();
          viewCart();
          fetchData();
        } catch (error) {
          console.error('Error during purchase:', error);
          alert('An error occurred during the purchase.');
        }
      };
      
      const totalPrice = products.reduce((accummurator, product) => {
        return accummurator + product.price * (amounts[product.id] || 0);
      }, 0);

    return (
        <>
            <h1 className="text-center"> Sunnary Order</h1>
            <div>
                {products.map((product) => (
                    <div key={product.id} className={`border-2 border-black p-4 rounded-lg shadow-md ${amounts[product.id] < 1 ? 'hidden' : ''}`}>
                        <p className="font-bold">Product: {product.product_name}</p>

                        <div className="flex justify-end">
                            <button className="" onClick={() => handleIncrement(product.id)}>+</button>
                            <button className="" onClick={() => handleDecrement(product.id)}>-</button>
                        </div>
                        <p>Amount : {amounts[product.id]}</p>
                        <p> Price : {product.price}</p>
                    </div>
                ))}
            </div>
            <p className="text-center">Total Price = {totalPrice}</p>
            <div className=" flex justify-center">
                <button onClick={handlePurchase} className=" py-2 px-2 bg-orange-400 text-white text-2xl"> Purchase </button>
            </div>
        </>
    );
};

export default Cart1