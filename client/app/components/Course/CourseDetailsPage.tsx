import { useGetCourseDetailsQuery } from '@/redux/features/courses/coursesApi';
import React, { useEffect, useState } from 'react'
import Loader from '../Loader/Loader';
import Heading from '@/app/utils/Heading';
import Header from '../Header';
import Footer from '../Footer/Footer';
import CourseDetails from "./CourseDetails"
import { useCreatePaymentIntentMutation, useGetStripePublishableKeyQuery } from '@/redux/features/orders/ordersApi';
import { loadStripe } from "@stripe/stripe-js"
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import { Stripe } from "@stripe/stripe-js";

type Props = {
    id: string;
}
interface User {
    _id: string;
    name: string;
    email: string;
    avatar?: { url: string };
    courses?: { courseId: string }[];
}


const CourseDetailsPage = ({ id }: Props) => {
    const [route, setRoute] = useState("Login");
    const [open, setOpen] = useState(false);
    const { data, isLoading } = useGetCourseDetailsQuery(id);
    const [createPaymentIntent, { data: paymentIntentData }] = useCreatePaymentIntentMutation({});
    const { data: config } = useGetStripePublishableKeyQuery({});
    const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
    const [clientSecret, setClientSecret] = useState("");
    const { data: userData } = useLoadUserQuery(undefined, {});
    const [user, setUser] = useState<User | null>(null);


    useEffect(() => {
        setUser(userData?.user || null);
    }, [userData]);


    useEffect(() => {
        if (config) {
            const publishablekey = config?.publishableKey;
            setStripePromise(loadStripe(publishablekey));
        }
        if (data && user) {
            const amount = Math.round(data.course.price);
            createPaymentIntent(amount);
        }
    }, [config, data, user, createPaymentIntent]);

    useEffect(() => {
        if (paymentIntentData && user) {
            setClientSecret(paymentIntentData.clientSecret);
        }
    }, [paymentIntentData, user])

    return (
        <>
            {
                isLoading ? (<Loader />) :
                    (
                        <div>
                            <Heading
                                title={data.course.name + " - StudyBuddy"}
                                description='StudyBuddy is a programmming platform developed by Rahul Kuamr for help the programmers'
                                keywords={data?.course?.tags}
                            />
                            <Header
                                route={route}
                                setRoute={setRoute}
                                open={open}
                                setOpen={setOpen}
                                activeItem={1}
                            />
                            {stripePromise && (
                                <CourseDetails data={data.course} stripePromise={stripePromise} clientSecret={clientSecret} setRoute={setRoute} setOpen={setOpen} user={user} />
                            )}
                            <Footer />
                        </div>
                    )
            }
        </>
    )
}

export default CourseDetailsPage