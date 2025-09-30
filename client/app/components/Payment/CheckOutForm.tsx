"use client";
import React, { useState } from "react";
import {
    useStripe,
    useElements,
    PaymentElement,
    LinkAuthenticationElement,
} from "@stripe/react-stripe-js";
import { useCreateOrderMutation } from "@/redux/features/orders/ordersApi";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { styles } from "@/app/styles/style";
import toast from "react-hot-toast";
import { socket } from "../../utils/socket";
import { redirect } from "next/navigation";

type Props = {
    setOpen: (open: boolean) => void;
    data: any;
    user: any;
};

const CheckOutForm = ({ setOpen, data, user }: Props) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // order creation
    const [createOrder] = useCreateOrderMutation();

    // refresh user after payment
    const [loadUser, setLoadUser] = useState(false);
    const { } = useLoadUserQuery(undefined, { skip: loadUser ? false : true });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsLoading(true);
        setMessage(null);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: "if_required",
        });

        if (error) {
            setMessage(error.message || "Something went wrong.");
            setIsLoading(false);
            return;
        }

        if (paymentIntent?.status === "succeeded") {
            try {
                await createOrder({
                    courseId: data._id,
                    payment_info: paymentIntent,
                }).unwrap();

                setLoadUser(true);
                socket.emit("notification", {
                    title: "New Order",
                    message: `You have a new rder from ${data?.name}`,
                    userId: user._id,
                })
                toast.success("Payment Successful!");
                setTimeout(() => setOpen(false), 2000);
                redirect(`/course-access/${data._id}`);
            } catch (err) {
                toast.error("Payment Failed");
            }
        }

        setIsLoading(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-2">
            {/* Stripe Authentication + Payment Inputs */}
            <LinkAuthenticationElement id="link-authentication-element" />
            <PaymentElement id="payment-element" />

            <button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className={`${styles.button} mt-2 h-[35px]`}
            >
                <span id="button-text">
                    {isLoading ? "Paying..." : `Pay ₹${data?.price}`}
                </span>
            </button>

            {/* Error / Success Message */}
            {message && (
                <div
                    id="payment-message"
                    className="text-red-600 dark:text-red-400 font-Poppins pt-2"
                >
                    {message}
                </div>
            )}
        </form>
    );
};

export default CheckOutForm;
