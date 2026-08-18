import React from 'react'
import HeaderHelper from "@/components/helpers/HeaderHelper";
import {Templates as Temp} from '@/lib/staticResources'
import {Card} from "@/components/helpers/Card";

const Templates = () => {
    return (
       <div>
      <HeaderHelper />
      <div className={' max-w-[125rem] mx-auto'}>
        <Card iterable={Temp} />
      </div>
    </div>
    )
}
export default Templates
