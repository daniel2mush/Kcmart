
import { Card } from './helpers/Card'
import {Templates} from "@/lib/staticResources";

const Template = () => {
  return (
    <div className=" max-w-500 mx-auto  min-h-[50dvh] bg-surface overflow-hidden flex items-center justify-center">
      <div className="h-full mx-auto w-full flex justify-center items-center ">
        <Card
          title="Templates"
          iterable={Templates}
          viewMoreLink="/templates"
          sliceValue={3}
        />
      </div>
    </div>
  )
}

export default Template
