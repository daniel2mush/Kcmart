import React from 'react'
import HeaderHelper from "@/components/helpers/HeaderHelper";
import {Card} from "@/components/helpers/Card";
import {Graphics as Grap} from "@/lib/staticResources";

const Graphics = () => {
   return (
       <div>
      <HeaderHelper />
      <div className={' max-w-[125rem] mx-auto'}>
        <Card iterable={Grap} />
      </div>
    </div>
    )
}
export default Graphics
