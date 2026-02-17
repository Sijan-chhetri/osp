import { icons } from "./icon";

const BrandsList = () => {
  const brands = icons();
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {brands.map((brand) => (
        <div
          key={brand.name}
          className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 hover:shadow-lg transition-all ${
            brand.bgColor ? `${brand.bgColor} text-white` : 'bg-white'
          }`}
        >
          <div className={brand.bgColor ? 'text-white' : brand.color}>
            {brand.icon}
          </div>
          <span className={`mt-2 text-sm font-semibold ${brand.bgColor ? 'text-white' : brand.color}`}>
            {brand.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default BrandsList;