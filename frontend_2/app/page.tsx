import Image from "next/image";
import Hero from "@/components/Hero";
import Latest from "@/components/Latest";
import Promo2 from "@/components/Promo2";
import Template from "@/components/Template";
import Magazine from "@/components/Magazine";
import NewsLetter from "@/components/NewsLetter";
import Graphics from "@/components/Graphics";


export default function Home() {
   return (
    <div className="relative">
      <Hero />
      <Latest />
      <Promo2 />
      <Template />
      <Graphics />
      <Magazine />
      <NewsLetter />
    </div>
  )
}
