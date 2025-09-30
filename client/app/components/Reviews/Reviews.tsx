import { styles } from '@/app/styles/style';
import Image from 'next/image';
import React from 'react';
import ReviewCard from '../Review/ReviewCard';

//  Static import for Next.js Image
import HeroImage from '../../../public/assests/Hero.png';

type Props = {};

export const reviews = [
    {
        name: "Amit Sharma",
        rating: 4,
        avatar: "https://randomuser.me/api/portraits/men/12.jpg",
        profession: "Software Engineer",
        comment:
            "The platform is intuitive and very easy to use. I was able to start learning without any confusion. The projects at the end really helped me put my skills to the test."
    },
    {
        name: "Priya Nair",
        rating: 4,
        avatar: "https://randomuser.me/api/portraits/women/25.jpg",
        profession: "UI/UX Designer",
        comment:
            "I really appreciate how well-structured the lessons are. Even complex design principles were explained in a way that felt natural. It boosted my confidence as a designer."
    },

    {
        name: "Karan Patel",
        rating: 4,
        avatar: "https://randomuser.me/api/portraits/men/71.jpg",
        profession: "Backend Developer",
        comment:
            "I struggled with backend concepts before, but this course simplified everything. The structured approach made it easy to follow and practice along."
    },
    {
        name: "Anjali Gupta",
        rating: 4.5,
        avatar: "https://randomuser.me/api/portraits/women/83.jpg",
        profession: "Product Manager",
        comment:
            "The lessons gave me a fresh perspective on managing tech teams. I now understand both the technical and business aspects much better."
    },
    {
        name: "Vikram Singh",
        rating: 4,
        avatar: "https://randomuser.me/api/portraits/men/90.jpg",
        profession: "Cybersecurity Specialist",
        comment:
            "I loved the practical labs on security. It’s rare to find courses that let you practice real-world scenarios. This definitely sharpened my skills."
    },
    {
        name: "Neha Reddy",
        rating: 4,
        avatar: "https://randomuser.me/api/portraits/women/95.jpg",
        profession: "Frontend Developer",
        comment:
            "The projects were my favorite part! They pushed me to think critically and apply everything I had learned. Now I feel much more confident as a developer."
    }
];

const Reviews = (props: Props) => {
    return (
        
        <div className="w-[90%] 800px:w-[85%] m-auto ">
            <div className="w-full 800px:flex items-center">
                <div className="w-full 800px:w-[50%]">
                    <Image src={HeroImage} height={700} width={700} alt="Business" />
                </div>
                <div className="w-full 800px:w-[50%]">
                    <h3 className={`${styles.title} 800px:!text-[40px]`}>
                        Our Students Are{" "}
                        <span className="font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
                            Our Strength
                        </span>{" "}
                        <br /> See What They Say About Us
                    </h3>
                    <br />
                    <p className={`${styles.label}`}>
                        Hear from our learners who have transformed their careers with us.
                        Their success stories are a testament to the quality and dedication
                        we put into every course.
                    </p>
                </div>
                <br />
                <br />
            </div>

            {/*  Review Grid */}
            <div className="grid grid-cols-1 gap-[25px] md:grid-cols-2 xl:grid-cols-2 mb-12 border-0">
                {reviews.map((i) => (
                    <ReviewCard item={i} key={i.name} />
                ))}
            </div>

        </div>
    );
};

export default Reviews;
