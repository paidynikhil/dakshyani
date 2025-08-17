import { SareeProduct, LehengaProduct, NewArrival, User, Review, Order } from '../types';

export const sareeProducts: SareeProduct[] = [
  {
    id: 1,
    image: "https://images.pexels.com/photos/14519361/pexels-photo-14519361.jpeg",
    title: "Premium Banarasi Silk Saree",
    description: "Elegant silk saree with intricate zari border and traditional motifs",
    price: 1299,
    originalPrice: 2499,
    discount: 48,
    type: "Silk",
    color: "Maroon",
    occasion: "Wedding",
    pattern: "Zari Work",
    fabric: "Pure Silk",
    rating: 4.8,
    reviews: 324,
    inStock: true,
    fastDelivery: true,
    brand: "Kanchipuram Silks",
    category:"Sarees"
  },
  {
    id: 2,
    image: "https://images.pexels.com/photos/9558618/pexels-photo-9558618.jpeg",
    title: "Designer Cotton Saree",
    description: "Beautiful cotton saree with block print design perfect for daily wear",
    price: 899,
    originalPrice: 1599,
    discount: 44,
    type: "Cotton",
    color: "Blue",
    occasion: "Casual",
    pattern: "Block Print",
    fabric: "Cotton",
    rating: 4.5,
    reviews: 189,
    inStock: true,
    fastDelivery: true,
    brand: "Rajasthani Crafts",
    category:"Sarees"
  }
];

export const lehengaProducts: LehengaProduct[] = [
  {
    id: 1,
    image: "https://images.pexels.com/photos/19411674/pexels-photo-19411674.jpeg",
    title: "Bridal Red Lehenga",
    description: "Heavy embroidered bridal lehenga with golden zari work",
    price: 8999,
    originalPrice: 15999,
    discount: 44,
    style: "A-line",
    occasion: "Wedding",
    workType: "Embroidery",
    color: "Red",
    rating: 4.8,
    reviews: 245,
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    isNew: false,
    isBestseller: true,
    brand: "Designer Lehengas",
    category: "Lehengas"
  },
  {
    id: 2,
    image: "https://images.pexels.com/photos/19411671/pexels-photo-19411671.jpeg",
    title: "Party Wear Pink Lehenga",
    description: "Stylish pink lehenga with mirror work perfect for parties",
    price: 5999,
    originalPrice: 9999,
    discount: 40,
    style: "Flared",
    occasion: "Party",
    workType: "Mirror Work",
    color: "Pink",
    rating: 4.6,
    reviews: 134,
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    isNew: true,
    isBestseller: false,
    brand: "Designer Lehengas",
    category: "Lehengas"
  }
];

export const newArrivals: NewArrival[] = [
  {
    id: 1,
    image: "https://images.pexels.com/photos/14519361/pexels-photo-14519361.jpeg",
    title: "Premium Silk Saree",
    description: "Luxurious silk saree with contemporary design",
    price: "₹2,299",
    originalPrice: "₹4,999",
    discount: "54% OFF",
    category: "Sarees",
    occasion: "Wedding",
    color: "Maroon",
    rating: 4.8,
    reviews: 156,
    dateAdded: "2024-01-15",
    daysAgo: 2,
    inStock: true,
    isTrending: true
  }
];

export const users: User[] = [
  {
    id: 1,
    name: "Priya Sharma",
    email: "priya.sharma@gmail.com",
    phone: "+91 9876543210",
    status: true,
    profilePicture: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    joinDate: "2023-08-15"
  },
  {
    id: 2,
    name: "Anita Gupta",
    email: "anita.gupta@gmail.com",
    phone: "+91 9876543211",
    status: true,
    profilePicture: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    joinDate: "2023-09-20"
  },
  {
    id: 3,
    name: "Meera Patel",
    email: "meera.patel@gmail.com",
    phone: "+91 9876543212",
    status: false,
    profilePicture: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg",
    joinDate: "2023-10-05"
  }
];

export const reviews: Review[] = [
  {
    id: 1,
    userName: "Priya Sharma",
    userImage: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    productName: "Premium Banarasi Silk Saree",
    reviewText: "Absolutely beautiful saree! The quality is amazing and the zari work is exquisite. Highly recommended!",
    rating: 5,
    date: "2024-01-10",
    adminResponse: "Thank you so much for your wonderful review! We're delighted that you loved the saree."
  },
  {
    id: 2,
    userName: "Anita Gupta",
    userImage: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    productName: "Bridal Red Lehenga",
    reviewText: "Perfect for my wedding! The embroidery work is stunning and the fit is perfect.",
    rating: 5,
    date: "2024-01-08"
  }
];

export const orders: Order[] = [
  {
    id: "ORD001",
    productName: "Premium Banarasi Silk Saree",
    productImage: "https://images.pexels.com/photos/14519361/pexels-photo-14519361.jpeg",
    userName: "Priya Sharma",
    userEmail: "priya.sharma@gmail.com",
    status: "Delivered",
    amount: 1299,
    orderDate: "2024-01-05"
  },
  {
    id: "ORD002",
    productName: "Bridal Red Lehenga",
    productImage: "https://images.pexels.com/photos/19411674/pexels-photo-19411674.jpeg",
    userName: "Anita Gupta",
    userEmail: "anita.gupta@gmail.com",
    status: "Shipped",
    amount: 8999,
    orderDate: "2024-01-10"
  },
  {
    id: "ORD003",
    productName: "Designer Cotton Saree",
    productImage: "https://images.pexels.com/photos/9558618/pexels-photo-9558618.jpeg",
    userName: "Meera Patel",
    userEmail: "meera.patel@gmail.com",
    status: "Pending",
    amount: 899,
    orderDate: "2024-01-12"
  }
];

export const dashboardStats = {
  totalProducts: 45,
  totalOrders: 128,
  activeUsers: 256,
  totalReviews: 89
};

export const salesData = [
  { month: 'Jan', sales: 4000 },
  { month: 'Feb', sales: 3000 },
  { month: 'Mar', sales: 5000 },
  { month: 'Apr', sales: 4500 },
  { month: 'May', sales: 6000 },
  { month: 'Jun', sales: 5500 }
];

export const userEngagementData = [
  { name: 'Active', value: 65 },
  { name: 'Inactive', value: 35 }
];

export const productPopularityData = [
  { category: 'Sarees', count: 25 },
  { category: 'Lehengas', count: 15 },
  { category: 'New Arrivals', count: 5 }
];