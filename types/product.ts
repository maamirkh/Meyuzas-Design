// export interface Product {
//     imageUrl: any;
//     rating: any;
//     discount: any;
//     slug: any;
//     _id: string;
//     _type: "product";
//     productName: string;
//     description: string;
//     price: number;
//     inventory: number;
//     colors: string;
//     status: string;
//     image: { asset: { _ref: string } };
//   }



export interface Product {
  _id: string;
  _type: "product" | "onsaleproducts";
  productName: string;
  price: number;
  inventory: number;
  category: string;
  colors?: string[];
  status?: string;
  description?: string;
  slug: {
    current: string;
  };
  image?: {
    asset: {
      _ref: string;
      _type: string;
    };
    _type: string;
  };
  rating?: number;
  discountPercentage?: number;
  currentPrice?: number; // Add this line
}