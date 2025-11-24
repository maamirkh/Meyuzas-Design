'use client'
import { Product } from "../../types/product";
import { addToCart } from "../../actions/actions";
import { useCart } from "../context/CartContext"; // ✅ Import useCart
import Swal from "sweetalert2";

export default function AddToCartButton({ product }: { product: Product }) {
  const { updateCartCount } = useCart(); // ✅ Get updateCartCount function

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Add product to cart
    addToCart(product);
    
    // ✅ Update cart counter in navbar
    updateCartCount();
    
    // Show success message with better styling
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: '<span style="color: #10b981; font-weight: 700;">Added to Cart!</span>',
      html: `
        <div style="text-align: center; padding: 10px;">
          <p style="color: #64748b; font-size: 14px; margin-top: 8px;">
            <strong style="color: #3b82f6;">${product.productName}</strong> has been added to your cart
          </p>
        </div>
      `,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      toast: true,
      background: '#ffffff',
      customClass: {
        popup: 'rounded-2xl shadow-2xl',
        title: 'text-lg',
        htmlContainer: 'text-sm'
      }
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
    >
      Add to Cart
    </button>
  );
}


// "use client";

// import { Product } from "../../types/product";
// import { addToCart } from "../../actions/actions";
// import Swal from "sweetalert2";

// export default function AddToCartButton({ product }: { product: Product }) {
//   const handleAddToCart = (e: React.MouseEvent) => {
//     e.preventDefault();
//     Swal.fire({
//       position: "top-right",
//       icon: "success",
//       title: `${product.productName} added to cart`,
//       showConfirmButton: false,
//       timer: 1000
//     });
//     addToCart(product);
//   };

//   return (
//     <button
//       onClick={handleAddToCart}
//       className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//     >
//       Add to Cart
//     </button>
//   );
// }