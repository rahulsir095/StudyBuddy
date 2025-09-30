'use client'
import React, { useState } from 'react'
import Heading from '../utils/Heading'
import Header from '../components/Header'
import Policy from "./Policy"
import Footer from '../components/Footer/Footer'

type Props = {}

const page = (props: Props) => {
      const [open, setOpen] = useState(false);
      const [activeItem, setActiveItem] = useState(3);
      const [route, setRoute] = useState("Login");
  return (
    <div>
        <Heading
          title="Policy - StudyBuddy"
          description="ELearning is a platform for students to learn and get help from teachers"
          keywords="Programming,MERN,Redux,Machine Learning"
        />
        <Header
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          setRoute={setRoute}
          route={route}
        />
        <Policy/>
        <Footer/>
    </div>
  )
}

export default page
