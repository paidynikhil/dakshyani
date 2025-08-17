export interface User {
  _id: string;
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  status: boolean;
  profilePicture: string;
  joinDate: string;
  createdAt: string;
}

export interface SareeProduct {
  _id: string;
  id: number;
  image: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  type: string;
  color: string;
  occasion: string;
  pattern: string;
  fabric: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  fastDelivery: boolean;
  brand: string;
  category: string;
}

export interface LehengaProduct {
  id: number;
  image: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  style: string;
  occasion: string;
  workType: string;
  color: string;
  rating: number;
  reviews: number;
  sizes: string[];
  inStock: boolean;
  isNew: boolean;
  isBestseller: boolean;
  brand: string;
  category: string;
}

export interface NewArrival {
  id: number;
  image: string;
  title: string;
  description: string;
  price: string;
  originalPrice: string;
  discount: string;
  category: string;
  occasion: string;
  color: string;
  rating: number;
  reviews: number;
  dateAdded: string;
  daysAgo: number;
  inStock: boolean;
  isTrending: boolean;
}

export interface Review {
  id: number;
  userName: string;
  userImage: string;
  productName: string;
  reviewText: string;
  rating: number;
  date: string;
  adminResponse?: string;
}

export interface Order {
  id: string;
  productName: string;
  productImage: string;
  userName: string;
  userEmail: string;
  status: 'Pending' | 'Shipped' | 'Delivered';
  amount: number;
  orderDate: string;
}