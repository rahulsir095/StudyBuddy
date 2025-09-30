"use client";
import React, { useState } from "react";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import FAQ from "../components/FAQ/FAQ";
import Footer from "../components/Footer/Footer";

type Props = {};

const FAQPage = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(4);
  const [route, setRoute] = useState("Login");

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* SEO Heading */}
      <Heading
        title="FAQ - StudyBuddy"
        description="StudyBuddy is an E-Learning platform for students to learn, collaborate, and get help from teachers."
        keywords="FAQ, StudyBuddy, Programming, MERN, Redux, Machine Learning, E-Learning"
      />

      {/* Header */}
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />

      {/* FAQ Section */}
      <main className="flex-grow">
        <section className="max-w-5xl mx-auto px-6 py-12">
          <FAQ />
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default FAQPage;
