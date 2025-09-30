import React from "react";
import Link from "next/link";

export const navItemsData = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Courses",
    url: "/courses",
  },
  {
    name: "About",
    url: "/about",
  },
  {
    name: "Policy",
    url: "/policy",
  },
  {
    name: "FAQ",
    url: "/faq",
  },
];

type Props = {
  activeItem: number;
  isMobile: boolean;
};

const NavItems: React.FC<Props> = ({ activeItem, isMobile }) => {
  return (
    <>
      {/* Desktop View */}
      <div className="hidden 800px:flex">
        {navItemsData.map((item, index) => (
          <Link href={item.url} key={index} passHref>
            <span
              className={`text-[18px] px-6 font-poppins font-normal ${activeItem === index
                  ? "dark:text-[#37a39a] text-[crimson]"
                  : "dark:text-white text-black"
                }`}
            >
              {item.name}
            </span>
          </Link>
        ))}
      </div>

      {/* Mobile View */}
      {isMobile && (
        <div className="mt-5 800px:hidden">
          
          {navItemsData.map((item, index) => (
            <Link href={item.url} key={index} passHref>
              <span
                className={`block py-5 text-[18px] px-6 font-poppins font-normal ${activeItem === index
                    ? "dark:text-[#37a39a] text-[crimson]"
                    : "dark:text-white text-black"
                  }`}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default NavItems;