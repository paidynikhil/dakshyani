// Services/orderServices.js
import { Order } from "../Models/orderModel.js";
import { Lehenga } from "../Models/lehengaModel.js";
import { Saree } from "../Models/sareeModel.js";
// import { Dress } from "../Models/dressModel.js";

// Helper function to get model by name
const getModelByName = (modelName) => {
  const models = {
    Lehenga,
    Saree,
    // Dress,
  };
  return models[modelName];
};

// Validate and fetch product details
const validateAndFetchProduct = async (productId, productModel) => {
  const Model = getModelByName(productModel);
  if (!Model) {
    throw new Error(`Invalid product model: ${productModel}`);
  }

  const product = await Model.findById(productId);
  if (!product) {
    throw new Error(`Product not found in ${productModel}`);
  }

  if (!product.inStock) {
    throw new Error(`Product "${product.title}" is out of stock`);
  }

  return product;
};

// Calculate pricing
const calculatePricing = (items, shippingCost = 0, platformFee = 0) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0; // Set tax percentage as needed (e.g., 0.18 for 18%)
  const discount = 0; // Can be calculated based on coupons
  const total = subtotal + shippingCost + platformFee + tax - discount;

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    shippingCost: parseFloat(shippingCost.toFixed(2)),
    platformFee: parseFloat(platformFee.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    discount: parseFloat(discount.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
  };
};

// Place Order Service
export const placeOrderService = async (userId, orderData) => {
  const { items, shippingAddress, paymentMethod } = orderData;

  // Validation
  if (!items || items.length === 0) {
    throw new Error("Order must contain at least one item");
  }

  if (!shippingAddress) {
    throw new Error("Shipping address is required");
  }

  // Validate all products and prepare order items
  const orderItems = await Promise.all(
    items.map(async (item) => {
      const product = await validateAndFetchProduct(item.product, item.productModel);

      return {
        product: item.product,
        productModel: item.productModel,
        title: product.title,
        price: product.price,
        quantity: item.quantity || 1,
        size: item.size,
        color: item.color || product.color,
        image: product.image,
      };
    })
  );

  // Calculate pricing
  const pricing = calculatePricing(orderItems);

  // Create order
  const order = await Order.create({
    user: userId,
    items: orderItems,
    shippingAddress,
    pricing,
    paymentMethod: paymentMethod || "COD",
    paymentStatus: paymentMethod === "COD" ? "Pending" : "Pending",
    orderStatus: "Pending",
    statusHistory: [
      {
        status: "Pending",
        updatedBy: userId,
        comment: "Order placed successfully",
        timestamp: new Date(),
      },
    ],
  });

  // Populate order details
  await order.populate([
    {
      path: "items.product",
      select: "title price image brand category",
    },
    {
      path: "user",
      select: "name email phoneNumber",
    },
  ]);

  return order;
};

// Get User Orders Service
export const getUserOrdersService = async (userId, page = 1, limit = 10, status) => {
  const skip = (page - 1) * limit;
  
  const filter = { user: userId };
  if (status) {
    filter.orderStatus = status;
  }

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate({
        path: "items.product",
        select: "title price image brand category",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments(filter),
  ]);

  return {
    orders,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get Order By ID Service
export const getOrderByIdService = async (orderId, userId = null, isAdmin = false) => {
  const query = { _id: orderId };
  
  // If not admin, ensure user can only see their own orders
  if (!isAdmin && userId) {
    query.user = userId;
  }

  const order = await Order.findOne(query)
    .populate({
      path: "items.product",
      select: "title price image brand category",
    })
    .populate({
      path: "user",
      select: "name email phoneNumber",
    })
    .populate({
      path: "statusHistory.updatedBy",
      select: "name role",
    })
    .lean();

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};

// Cancel Order Service (User)
export const cancelOrderService = async (orderId, userId, reason) => {
  const order = await Order.findOne({ _id: orderId, user: userId });

  if (!order) {
    throw new Error("Order not found");
  }

  // Check if order can be cancelled
  const nonCancellableStatuses = ["Shipped", "OutForDelivery", "Delivered", "Cancelled", "Returned"];
  if (nonCancellableStatuses.includes(order.orderStatus)) {
    throw new Error(`Cannot cancel order with status: ${order.orderStatus}`);
  }

  order.orderStatus = "Cancelled";
  order.cancellationReason = reason || "Cancelled by user";
  order.cancelledAt = new Date();
  order.statusHistory.push({
    status: "Cancelled",
    updatedBy: userId,
    comment: reason || "Cancelled by user",
    timestamp: new Date(),
  });

  await order.save();

  await order.populate([
    {
      path: "items.product",
      select: "title price image brand category",
    },
    {
      path: "user",
      select: "name email phoneNumber",
    },
  ]);

  return order;
};

// Get All Orders Service (Admin)
export const getAllOrdersService = async (page = 1, limit = 10, filters = {}) => {
  const skip = (page - 1) * limit;
  
  const query = {};
  
  if (filters.status) {
    query.orderStatus = filters.status;
  }
  
  if (filters.paymentStatus) {
    query.paymentStatus = filters.paymentStatus;
  }
  
  if (filters.paymentMethod) {
    query.paymentMethod = filters.paymentMethod;
  }

  if (filters.search) {
    query.$or = [
      { orderNumber: { $regex: filters.search, $options: "i" } },
      { "shippingAddress.fullName": { $regex: filters.search, $options: "i" } },
      { "shippingAddress.phoneNumber": { $regex: filters.search, $options: "i" } },
    ];
  }

  const [orders, total, stats] = await Promise.all([
    Order.find(query)
      .populate({
        path: "user",
        select: "name email phoneNumber",
      })
      .populate({
        path: "items.product",
        select: "title price image brand category",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments(query),
    Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  const statusStats = stats.reduce((acc, stat) => {
    acc[stat._id] = stat.count;
    return acc;
  }, {});

  return {
    orders,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    stats: statusStats,
  };
};

// Update Order Status Service (Admin)
export const updateOrderStatusService = async (orderId, adminId, statusData) => {
  const { status, comment, trackingNumber } = statusData;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  // Validate status transition
  const validStatuses = [
    "Pending",
    "Confirmed",
    "Processing",
    "Shipped",
    "OutForDelivery",
    "Delivered",
    "Cancelled",
    "Returned",
  ];

  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status: ${status}`);
  }

  order.orderStatus = status;

  if (trackingNumber) {
    order.trackingNumber = trackingNumber;
  }

  if (status === "Delivered") {
    order.deliveredAt = new Date();
    order.paymentStatus = "Paid";
  }

  if (status === "Cancelled" && order.orderStatus !== "Cancelled") {
    order.cancelledAt = new Date();
  }

  order.statusHistory.push({
    status,
    updatedBy: adminId,
    comment: comment || `Status updated to ${status}`,
    timestamp: new Date(),
  });

  await order.save();

  await order.populate([
    {
      path: "user",
      select: "name email phoneNumber",
    },
    {
      path: "items.product",
      select: "title price image brand category",
    },
    {
      path: "statusHistory.updatedBy",
      select: "name role",
    },
  ]);

  return order;
};

// Get Order Statistics (Admin)
export const getOrderStatisticsService = async () => {
  const [
    totalOrders,
    totalRevenue,
    statusBreakdown,
    recentOrders,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.aggregate([
      { $match: { orderStatus: { $ne: "Cancelled" } } },
      { $group: { _id: null, total: { $sum: "$pricing.total" } } },
    ]),
    Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
          revenue: { $sum: "$pricing.total" },
        },
      },
    ]),
    Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
  ]);

  return {
    totalOrders,
    totalRevenue: totalRevenue[0]?.total || 0,
    statusBreakdown,
    recentOrders,
  };
};