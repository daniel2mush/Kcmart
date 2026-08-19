import React from 'react'
import HeaderHelper from "@/components/helpers/HeaderHelper";
import {Card} from "@/components/helpers/Card";
import {Mockups as Mock} from "@/lib/staticResources";

const Mockups = () => {
     return (
       <div>
      <HeaderHelper />
      <div className={' max-w-500 mx-auto'}>
        <Card iterable={Mock} />
      </div>
    </div>
    )
}
export default Mockups
