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
import { useRouter } from "next/navigation"; 

interface UserCourse {
  courseId: string;
}
interface Data {
    _id:string;
    price:number;
    name:string;
}
interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: {
    url: string;
  };
  courses?: UserCourse[];
}
type Props = {
    setOpen: (open: boolean) => void;
    data: Data;
    user?: User;
};

const CheckOutForm = ({ setOpen, data, user }: Props) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { refetch: refetchUser } = useLoadUserQuery(undefined,{});

    const [createOrder] = useCreateOrderMutation();
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

                await refetchUser();
                socket.emit("notification", {
                    title: "New Order",
                    message: `You have a new order from ${data?.name}`,
                    userId: user?._id,
                });

                toast.success("Payment Successful!");

                setTimeout(() => {
                    setOpen(false);
                    router.push(`/course-access/${data._id}`);
                }, 2000);
            } catch (err) {
                console.log(err);
                toast.error("Payment Failed");
            }
        }

        setIsLoading(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-2">
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
