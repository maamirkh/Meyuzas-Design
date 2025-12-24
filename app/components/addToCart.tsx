'use client'
import { Product } from "../../types/product";
import { addToCart } from "../../actions/actions";
import { useCart } from "../context/CartContext"; // ✅ Import useCart
import Swal from "sweetalert2";

export default function AddToCartButton({ product }: { product: Product }) {
  const { updateCartCount } = useCart(); // ✅ Get updateCartCount function

  const isOutOfStock = product.inventory !== undefined && product.inventory <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isOutOfStock) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: '<span style="color: #016B61; font-weight: 700;">Out of Stock!</span>',
        html: `
          <div style="text-align: center; padding: 10px;">
            <p style="color: #016B61; font-size: 14px; margin-top: 8px;">
              <strong style="color: #78B9B5;">${product.productName}</strong> is currently unavailable.
            </p>
          </div>
        `,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        toast: true,
        background: '#ffffff',
        customClass: {
          popup: 'rounded-2xl shadow-2xl border-2 border-red-300',
          title: 'text-lg',
          htmlContainer: 'text-sm'
        }
      });
      return;
    }
    
    // Add product to cart
    addToCart(product);
    
    // ✅ Update cart counter in navbar
    updateCartCount();
    
    // Show success message with better styling
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: '<span style="color: #016B61; font-weight: 700;">Added to Cart!</span>',
      html: `
        <div style="text-align: center; padding: 10px;">
          <p style="color: #016B61; font-size: 14px; margin-top: 8px;">
            <strong style="color: #78B9B5;">${product.productName}</strong> has been added to your cart
          </p>
        </div>
      `,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      toast: true,
      background: '#ffffff',
      customClass: {
        popup: 'rounded-2xl shadow-2xl border-2 border-[#9ECFD4]',
        title: 'text-lg',
        htmlContainer: 'text-sm'
      }
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isOutOfStock}
      className="w-40 px-6 py-3 relative bg-gradient-to-r from-[#9ECFD4] via-[#78B9B5] to-[#016B61] hover:from-[#78B9B5] hover:via-[#016B61] hover:to-[#9ECFD4] text-black rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all duration-500 flex items-center justify-center group disabled:bg-slate-300 disabled:from-slate-300 disabled:via-slate-300 disabled:to-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed"
    >
      {isOutOfStock ? "Out of Stock" : "Add to Cart"}
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