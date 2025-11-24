import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            404
          </h1>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Product Not Found
        </h2>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          Sorry, we couldn't find the product you're looking for.
        </p>
        <Link href="/fetchProduct"
          className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
        >
          ← Back to Products
        </Link>
      </div>
    </div>
  );
}