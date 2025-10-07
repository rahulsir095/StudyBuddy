"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search } from "lucide-react"
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi"
import Loader from "../Loader/Loader"
import { useRouter } from "next/navigation"

// Import static images
import HeroPlaceholder from "../../../public/assests/Hero.png"
import Client1 from "../../../public/assests/client-1.jpg"
import Client2 from "../../../public/assests/client-2.jpg"
import Client3 from "../../../public/assests/client-3.jpg"

export default function HeroSection() {
    const { data, isLoading } = useGetHeroDataQuery("Banner", {
        refetchOnMountOrArgChange: true,
    });
    const [search, setSearch] = useState("");
    const router = useRouter();

    const handleSearch = () => {
        if (!search) return;
        router.push(`/courses?title=${search}`);
    }

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="w-full min-h-screen bg-[#f5f7fa] dark:bg-[#0d0f1a] flex items-center justify-center px-4 md:px-8 lg:px-16 transition-colors duration-300">
                    <div className="max-w-[1400px] w-full flex flex-col lg:flex-row items-center gap-8 lg:gap-16 mt-[80px]">

                        {/* Left side with illustration */}
                        <div className="relative w-[380px] h-[380px] md:w-[620px] md:h-[620px] rounded-full bg-[#e0e7ff] dark:bg-[#2a2d7a] overflow-hidden hero_animation transition-colors duration-200 transform -translate-x-4 -translate-y-6">
                            <Image
                                src={data?.layout?.banner?.image?.url || HeroPlaceholder}
                                alt="Student learning online"
                                className="object-contain h-full w-full"
                                width={400}
                                height={400}
                                priority
                            />
                        </div>

                        {/* Right side with content */}
                        <div className="w-full lg:w-1/2 flex flex-col gap-6">
                            <div className="space-y-4">
                                <h1 className="font-family-poppins text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white leading-tight transition-colors duration-300">
                                    {data?.layout?.banner?.title}
                                </h1>
                                <p className="font-family-josefin text-gray-600 dark:text-gray-300 text-base md:text-lg transition-colors duration-300">
                                    {data?.layout?.banner?.subTitle}
                                </p>
                            </div>

                            {/* Search bar */}
                            <div className="flex w-full max-w-[600px] h-14 relative">
                                <input
                                    type="text"
                                    placeholder="Search Courses..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full h-full rounded-l-md bg-white dark:bg-[#2a2b36] text-gray-800 dark:text-white border border-gray-300 dark:border-transparent px-4 outline-none transition-colors duration-300"
                                />
                                <button
                                    className="h-full w-14 bg-[#4da6de] rounded-r-md flex items-center justify-center transition-colors duration-300 cursor-pointer"
                                    onClick={handleSearch}
                                >
                                    <Search className="w-6 h-6 text-white" />
                                </button>
                            </div>

                            {/* Trust indicators */}
                            <div className="flex items-center gap-2 mt-4">
                                <div className="flex -space-x-2">
                                    <Image src={Client1} alt="User" className="rounded-full border-2 border-white dark:border-[#0d0f1a] transition-colors duration-300" />
                                    <Image src={Client2} alt="User" className="rounded-full border-2 border-white dark:border-[#0d0f1a] transition-colors duration-300" />
                                    <Image src={Client3} alt="User" className="rounded-full border-2 border-white dark:border-[#0d0f1a] transition-colors duration-300" />
                                </div>
                                <p className="text-gray-800 dark:text-white text-sm md:text-base transition-colors duration-300">
                                    500K+ People already trusted us.{" "}
                                    <Link href="/courses" className="text-red-500 hover:underline dark:text-[#4ade80]">
                                        View Courses
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
