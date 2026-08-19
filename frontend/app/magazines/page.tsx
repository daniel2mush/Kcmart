import React from 'react'
import HeaderHelper from "@/components/helpers/HeaderHelper";
import {Card} from "@/components/helpers/Card";
import {Magazines as Mag} from "@/lib/staticResources";

const Magazines = () => {
    return (
       <div>
      <HeaderHelper />
      <div className={' max-w-[125rem] mx-auto'}>
        <Card iterable={Mag} />
      </div>
    </div>
    )
}
export default Magazines
