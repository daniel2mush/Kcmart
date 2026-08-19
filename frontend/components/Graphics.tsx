
import React from 'react'
import { Card } from './helpers/Card'
import { Graphics as Graph } from '@/lib/staticResources'

const Graphics = () => {
  return (
    <div className=" max-w-500 mx-auto  min-h-[50dvh] bg-surface overflow-hidden flex items-center justify-center  border-t border-border">
      <div className="h-full mx-auto w-full flex justify-center items-center ">
        <Card
          title="Graphics"
          iterable={Graph}
          viewMoreLink="/graphics"
          sliceValue={3}
        />
      </div>
    </div>
  )
}

export default Graphics
