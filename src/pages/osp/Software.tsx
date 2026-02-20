import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/osp/Navbar";
import WhyOSP from "../../components/osp/WhyOSP";
import StepCard from "../../components/osp/stepcard";
import { API_ENDPOINTS } from "../../api/api";
import { getAuthToken, isDistributor } from "../../utils/auth";

interface BrandFromAPI {
  id: string;
  name: string;
  thumbnail_url: string | null;
}

interface Plan {
  id: string;
  plan_name: string;
  duration_type: string;
  price: string;
  special_price: string | null;
  original_price: string | null;
  features: string;
  has_discount: boolean;
}

interface Product {
  id: string;
  brand_id: string;
  category_id: string;
  name: string;
  description: string;
  brand_name: string;
  brand_image_url: string;
  category_name: string;
  plans: Plan[];
}

interface CartItem {
  product: Product;
  plan: Plan;
  quantity: number;
  addedAt: string;
}

interface SoftwareItem {
  id: string;
  name: string;
  title: string;
  category: string;
  color: string;
  imageUrl?: string;
  bgColor?: string;
}

interface StepItem {
  number: number;
  title: string;
  description: string;
  icon: string;
}

const SoftwareCard: React.FC<SoftwareItem & { onSeeOptions: () => void }> = ({ 
  name, 
  title, 
  category, 
  color, 
  bgColor, 
  imageUrl,
  onSeeOptions 
}) => {
  const [imageError, setImageError] = React.useState(false);

  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-gray-300 p-8 flex flex-col items-center text-center hover:shadow-2xl hover:border-[#7B5DE8] transition-all duration-300">
      <div className={`${bgColor} p-4 rounded-lg mb-6 w-24 h-24 flex items-center justify-center`}>
        {imageUrl && !imageError ? (
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-contain"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className={`${color} font-extrabold text-4xl`}>{name.charAt(0)}</span>
        )}
      </div>
      <h3 className={`${color} font-extrabold text-2xl mb-2`}>{title}</h3>
      <p className="text-gray-600 text-sm mb-6">{category}</p>
      <button 
        onClick={onSeeOptions}
        className="text-[#7B5DE8] text-sm font-semibold hover:underline"
      >
        See Options →
      </button>
    </div>
  );
};

const Software: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const [softwareProducts, setSoftwareProducts] = useState<SoftwareItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [cartMessage, setCartMessage] = useState<string>("");
  const navigate = useNavigate();

  const addToCart = async (product: Product, plan: Plan) => {
    const userToken = getAuthToken();

    // If user is logged in, call API
    if (userToken) {
      try {
        console.log("Adding to cart with token:", userToken.substring(0, 20) + "...");
        console.log("Plan ID:", plan.id);
        
        const response = await fetch(API_ENDPOINTS.CART, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            software_plan_id: plan.id,
            quantity: 1,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("API Error:", data);
          throw new Error(data?.message || "Failed to add to cart");
        }

        console.log("Successfully added to cart:", data);

        // Show success message
        setCartMessage(`${product.name} - ${plan.plan_name} added to cart!`);
        setTimeout(() => setCartMessage(""), 3000);

        // Update cart count in navbar
        window.dispatchEvent(new Event("cartUpdated"));
        
        return;
      } catch (error) {
        console.error("Error adding to cart:", error);
        
        // If it's an authentication error, suggest re-login
        if (error instanceof Error && error.message.includes("user_id")) {
          setCartMessage("Session expired. Please log in again.");
        } else {
          setCartMessage("Failed to add to cart. Please try again.");
        }
        setTimeout(() => setCartMessage(""), 3000);
        return;
      }
    }

    // If user is not logged in, use localStorage
    const existingCart = localStorage.getItem("cart");
    let cart: CartItem[] = existingCart ? JSON.parse(existingCart) : [];

    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(
      (item) => item.product.id === product.id && item.plan.id === plan.id
    );

    if (existingItemIndex > -1) {
      // Increment quantity if item exists
      cart[existingItemIndex].quantity += 1;
    } else {
      // Add new item to cart
      const newItem: CartItem = {
        product,
        plan,
        quantity: 1,
        addedAt: new Date().toISOString(),
      };
      cart.push(newItem);
    }

    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Update cart count in navbar (trigger re-render)
    window.dispatchEvent(new Event("cartUpdated"));

    // Show success message
    setCartMessage(`${product.name} - ${plan.plan_name} added to cart!`);
    setTimeout(() => setCartMessage(""), 3000);
  };

  const handleBuyNow = (product: Product, plan: Plan) => {
    // Navigate to checkout with product and plan data
    navigate("/checkout", {
      state: {
        product,
        plan,
      },
    });
    closeModal();
  };

  const fetchProducts = async (brandId: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.BRAND_PRODUCTS(brandId));
      const data: Product[] = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleSeeOptions = (brandId: string) => {
    setShowModal(true);
    setLoadingProducts(true);
    fetchProducts(brandId);
  };

  const closeModal = () => {
    setShowModal(false);
    setProducts([]);
    document.body.style.overflow = 'unset';
  };

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.SHOP_BRANDS);
        const brands: BrandFromAPI[] = await response.json();
        
        // Map API brands to software products
        const products: SoftwareItem[] = brands.map((brand) => {
          // Construct image URL if thumbnail_url exists
          const imageUrl = brand.thumbnail_url 
            ? API_ENDPOINTS.SOFTWARE_BRAND_IMAGE(brand.thumbnail_url)
            : undefined;

          return {
            id: brand.id,
            name: brand.name,
            title: brand.name,
            category: getCategoryForBrand(brand.name),
            color: getColorForBrand(brand.name),
            bgColor: getBgColorForBrand(brand.name),
            imageUrl: imageUrl,
          };
        });
        
        setSoftwareProducts(products);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching brands:", error);
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const getCategoryForBrand = (name: string): string => {
    const categoryMap: { [key: string]: string } = {
      "Windows": "Operating System",
      "Power BI": "Analytics",
      "VMware": "Virtualization",
      "Office 365": "Productivity",
    };
    return categoryMap[name] || "Software";
  };

  const getColorForBrand = (name: string): string => {
    const colorMap: { [key: string]: string } = {
      "Windows": "text-blue-600",
      "Power BI": "text-yellow-600",
      "VMware": "text-gray-700",
      "Office 365": "text-orange-500",
    };
    return colorMap[name] || "text-gray-800";
  };

  const getBgColorForBrand = (name: string): string => {
    const bgColorMap: { [key: string]: string } = {
      "Windows": "bg-blue-100",
      "Power BI": "bg-yellow-100",
      "VMware": "bg-gray-100",
      "Office 365": "bg-orange-100",
    };
    return bgColorMap[name] || "bg-gray-100";
  };

  const displayedProducts = showAll ? softwareProducts : softwareProducts.slice(0, 6);

  const steps: StepItem[] = [
    {
      number: 1,
      title: "Select Your Software",
      description: "Choose from our wide range of genuine software products and click 'Buy Now'",
      icon: "👆",
    },
    {
      number: 2,
      title: "Message Us on WhatsApp",
      description: "You'll be directed to WhatsApp where our team will assist you with your order",
      icon: "💬",
    },
    {
      number: 3,
      title: "Receive Your License",
      description: "Get your software license instantly after payment confirmation",
      icon: "🔑",
    },
  ];

  if (loading) {
    return (
      <section className="relative w-full bg-white flex flex-col items-center py-20 px-4">
        <Navbar />
        <div className="text-center pt-20">
          <p className="text-gray-600 text-xl">Loading products...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-[#482072] px-8 py-6 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-white">
                {products[0]?.brand_name || "Products"}
              </h2>
              <button
                onClick={closeModal}
                className="text-white hover:text-gray-200 text-4xl font-light leading-none"
              >
                ×
              </button>
            </div>

            {/* Cart Success Message */}
            {cartMessage && (
              <div className="mx-8 mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700 text-sm flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {cartMessage}
              </div>
            )}

            {/* Modal Content - Scrollable */}
            <div className="px-8 py-6 overflow-y-auto flex-1">
              {loadingProducts ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="border-2 border-gray-200 rounded-lg p-6 animate-pulse">
                      <div className="flex flex-col items-center mb-4">
                        <div className="w-20 h-20 bg-gray-200 rounded mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-full mb-3"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-gray-100 rounded p-4">
                          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                          <div className="h-2 bg-gray-200 rounded w-full mb-3"></div>
                          <div className="h-8 bg-gray-200 rounded w-full"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="border-2 border-gray-300 rounded-lg p-6 hover:border-[#7B5DE8] hover:shadow-xl transition-all flex flex-col"
                    >
                      {/* Product Header */}
                      <div className="flex flex-col items-center mb-4">
                        {product.brand_image_url && (
                          <div className="w-20 h-20 mb-3 flex items-center justify-center">
                            <img
                              src={product.brand_image_url}
                              alt={product.brand_name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                        <h3 className="text-lg font-bold text-[#482072] text-center mb-2">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 text-sm text-center mb-3">{product.description}</p>
                        <span className="inline-block bg-purple-100 text-[#7B5DE8] px-3 py-1 rounded text-xs font-semibold">
                          {product.category_name}
                        </span>
                      </div>

                      {/* Plans */}
                      <div className="space-y-3 mt-auto">
                        {product.plans.map((plan) => {
                          // Determine which price to display
                          const userIsDistributor = isDistributor();
                          const displayPrice = userIsDistributor && plan.special_price 
                            ? plan.special_price 
                            : plan.price;
                          const showOriginalPrice = userIsDistributor && plan.special_price;

                          return (
                            <div
                              key={plan.id}
                              className="bg-gray-50 border border-gray-200 rounded p-4"
                            >
                              <h4 className="font-bold text-[#482072] mb-1 text-sm">
                                {plan.plan_name}
                              </h4>
                              <p className="text-xs text-gray-600 mb-2">{plan.features}</p>
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-xs text-gray-500 capitalize bg-white px-2 py-1 rounded border border-gray-200">
                                  {plan.duration_type}
                                </span>
                                <div className="text-right">
                                  {showOriginalPrice && (
                                    <>
                                      <p className="text-xs text-gray-400 line-through">
                                        Rs. {plan.price}
                                      </p>
                                      <p className="text-xs text-green-600 font-semibold">
                                        Distributor Price
                                      </p>
                                    </>
                                  )}
                                  <p className="text-xl font-bold text-[#7B5DE8]">
                                    Rs. {displayPrice}
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <button 
                                  onClick={() => handleBuyNow(product, plan)}
                                  className="w-full bg-[#7B5DE8] text-white py-2 rounded font-semibold text-sm hover:bg-[#6A4BC4] transition-all"
                                >
                                  Buy Now
                                </button>
                                <button 
                                  onClick={() => addToCart(product, plan)}
                                  className="w-full bg-white border-2 border-[#7B5DE8] text-[#7B5DE8] py-2 rounded font-semibold text-sm hover:bg-[#7B5DE8] hover:text-white transition-all"
                                >
                                  Add to Cart
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Software Section */}
      <section id="products" className="relative w-full bg-white flex flex-col items-center py-5 px-4">
        {/* Navbar */}
        <Navbar />

        {/* Header */}
        <div className="text-center mb-16 px-6 pt-5">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our <span className="text-[#7B5DE8]">Software Products</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Browse our extensive collection of genuine software solutions at the best prices in Nepal.
          </p>
        </div>

        {/* Software Grid */}
        <div className="w-[70%] px-4 md:px-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-500">
            {displayedProducts.map((product, index) => (
              <div
                key={product.id}
                className={`transition-all duration-500 ${
                  showAll && index >= 6 ? "animate-fade-in-up" : ""
                }`}
              >
                <SoftwareCard {...product} onSeeOptions={() => handleSeeOptions(product.id)} />
              </div>
            ))}
          </div>
        </div>

        {/* Show All Button */}
        <button
          onClick={() => setShowAll(!showAll)}
          className="bg-[#7B5DE8] text-white px-12 py-3 rounded-full font-semibold hover:bg-[#6A4BC4] transition-all duration-300 transform hover:scale-105"
        >
          {showAll ? "Show Less" : "Show All"}
        </button>
      </section>

      {/* Steps Section */}
      <section
        id="how-it-works"
        className="relative w-full flex flex-col items-center py-20 px-4"
        style={{
          background: "linear-gradient(to bottom, #482072 0%, #482072 30%, #ffffff 100%)",
        }}
      >
        {/* Header */}
        <div className="text-center mb-16 px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Get Your Software in 3 Simple Steps
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            Browse our extensive collection of genuine software solutions at the best prices in Nepal.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="w-[70%] px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <StepCard key={step.number} {...step} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose OSP Section */}
      <WhyOSP />
    </>
  );
};

export default Software;
