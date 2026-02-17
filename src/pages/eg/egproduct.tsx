import React from "react";

interface ProductItem {
  id: number;
  name: string;
  image: string;
  price: string;
  badge?: string;
}

const products: ProductItem[] = [
  {
    id: 1,
    name: "Brother TN 2060 Cartridge",
    image: "/cartridge.png",
    price: "Rs. 1500",
    badge: "FREE 3 TONER",
  },
  {
    id: 2,
    name: "Canon 328 A Cartridge",
    image: "/cartridge.png",
    price: "Rs. 1500",
    badge: "FREE 3 TONER",
  },
  {
    id: 3,
    name: "Cartridge MP1610",
    image: "/cartridge.png",
    price: "Rs. 1500",
  },
];

const ProductCard: React.FC<ProductItem> = ({ name, image, price, badge }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col items-center hover:shadow-xl transition-all duration-300">
      {/* Product Image with Badge */}
      <div className="relative w-full flex items-center justify-center mb-6 h-48">
        {badge && (
          <div className="absolute top-0 right-0 bg-[#dc2626] text-white px-4 py-2 rounded-lg font-bold text-sm transform rotate-12">
            {badge}
          </div>
        )}
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Product Name */}
      <h3 className="text-[#1e3a8a] font-bold text-xl mb-6 text-center min-h-[60px] flex items-center">
        {name}
      </h3>

      {/* Price and Button */}
      <div className="w-full flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">Price</p>
          <p className="text-[#1e3a8a] font-bold text-xl">{price}</p>
        </div>
        <button className="bg-[#1e3a8a] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#1e40af] transition-all duration-200">
          Buy Now
        </button>
      </div>
    </div>
  );
};

const EgProduct: React.FC = () => {
  return (
    <section className="relative w-full bg-white py-5 px-8">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">
          FIND OUR <span className="text-[#dc2626]">PRODUCTS</span>
        </h1>
        <p className="text-gray-500 text-lg">
          Browse our collection of high-quality ink and toner cartridges
        </p>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
      <br />
    </section>
  );
};

export default EgProduct;
