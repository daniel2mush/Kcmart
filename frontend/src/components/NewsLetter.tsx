import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from './ui/input-group'

const NewsLetter = () => {
  return (
    <div className=" relative  w-full  min-h-[clamp(20dvh,30dvw,40dvh)] overflow-hidden p-10  flex justify-center items-center  ">
      <div className=" absolute opacity-5  top-0 left-0 w-full ">
        <img src="/Hero.webp" alt="Background" className=" object-cover" />
      </div>

      <div className=" flex justify-center items-center w-full h-full flex-col max-w-sm md:max-w-lg mx-auto">
        <h1 className=" text-[clamp(1.5rem,4vw,4.5rem)] font-bold text-secondary">
          Join the newsletter
        </h1>
        <p className=" text-muted  text-[clamp(0.9rem,2vw,1.25rem)]mt-2 text-lg text-center">
          Get new products, articles and updates right into your inbox.
        </p>

        <InputGroup className=" w-full h-15  border-border border-2 active:border-border focus:border-border ring-0  rounded-2xl mt-6 bg-app">
          <InputGroupInput
            placeholder="Your Email"
            className="border-0! outline-none ring-0"
          />
          <InputGroupAddon align={'inline-end'} />
          <InputGroupButton
            variant={'ghost'}
            className=" bg-surface  px-8 py-6 rounded-2xl cursor-pointer hover:bg-surface/80 "
          >
            Subscribe
          </InputGroupButton>
        </InputGroup>
      </div>
    </div>
  )
}

export default NewsLetter
