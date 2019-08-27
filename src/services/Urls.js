/*
 * created by akul on 2019-06-08
*/

// local urls
export const LOCAL = {
    HOME: "/",
    LOGIN: "/login",
    MERCHANT: "/super",
    FORGOT: "/forgot-password",
    PURCHASE_ORDERS: "/vouchers/purchase-orders",
    CREATE_PURCHASE_ORDER: "/vouchers/purchase-orders/create-order",
    PURCHASE_ORDER_DETAIL: "/vouchers/purchase-orders/:orderId"
};

// remote urls
export const REMOTE = {
    ME: "/merchant/auth/me",
    MERCHANT_LOGIN: "/merchant/auth/login",
    MERCHANT_FORGOT: "/merchant/auth/forgot",
    MERCHANT_RESET: "/merchant/auth/reset",
    MERCHANT_LOGOUT: "/merchant/auth/logout",
    MERCHANT_PURCHASE_ORDER: "/merchant/vouchers/purchase-orders",
    MERCHANT_PURCHASE_ORDER_DETAIL: "/merchant/vouchers/purchase-orders/:id"
};
