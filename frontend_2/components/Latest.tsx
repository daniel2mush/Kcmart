'use client'
import { Card } from './helpers/Card'
import {latestDrops} from "@/lib/staticResources";

const Latest = () => {
  return (
    <div className=" max-w-500 mx-auto  min-h-[60dvh] bg-surface overflow-hidden flex items-center justify-center">
      <div className="h-full mx-auto w-full flex justify-center items-center ">
        <Card title="Latest Drops" iterable={latestDrops} />
      </div>
    </div>
  )
}

export default Latest
