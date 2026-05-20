import React from 'react'
import { Card } from './helpers/Card'
import { Magazines as Mag } from '../lib/staticResources'

const Magazine = () => {
  return (
    <div className=" max-w-500 mx-auto  min-h-[50dvh] bg-surface overflow-hidden flex items-center justify-center border-t border-border">
      <div className="h-full mx-auto w-full flex justify-center items-center ">
        <Card
          title="Magazines"
          iterable={Mag}
          viewMoreLink="/magazines"
          sliceValue={3}
        />
      </div>
    </div>
  )
}

export default Magazine
