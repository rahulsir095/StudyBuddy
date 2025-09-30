import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { createOrder, getAllOrders, newPayment, sendStripePublishableKey } from "../controllers/order.controller";
import { refreshTokensMiddleware } from "../controllers/user.controller";

const orderRouter = express.Router();

orderRouter.post("/create-order",refreshTokensMiddleware, isAuthenticated, createOrder);
orderRouter.get("/get-orders",refreshTokensMiddleware, isAuthenticated,authorizeRoles("admin"), getAllOrders);
orderRouter.get("/payment/publishablekey",sendStripePublishableKey);
orderRouter.post("/payment",isAuthenticated,refreshTokensMiddleware,newPayment )

export default orderRouter;
