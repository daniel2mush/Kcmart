'use client'
import Image from "next/image";

const Hero = () => {
  return (
    <div className=" container  relative w-full h-125  overflow-hidden mx-auto ">

      <div className="absolute w-full opacity-10 inset-0 z-0">
        <Image
          src="/Hero.webp"
          alt="Hero background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* 3. Optional: Dark overlay so your text is readable over the image */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      <div className="relative text-secondary z-20 container mx-auto flex flex-col justify-center items-center h-full text-center px-6 md:px-16">
        <div className="space-y-5 max-w-4xl">
          <h1 className="hero-title  font-black leading-tight text-3xl md:text-6xl lg:text-7xl">
            E-commerce power house
            <br />
            Made for designers and developers
          </h1>
          <p className="hero-copy text-sm md:text-2xl  mx-auto">
            Getting your mockups and your elements to make your designs amazing
          </p>
        </div>
      </div>
    </div>
  )
}

export default Hero