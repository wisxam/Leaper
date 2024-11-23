import ShinnyWrapperHeader from "@/components/shinyWrapperHeader";

const Home = () => {
  return (
    <>
      <ShinnyWrapperHeader className="mb-12 mt-28 flex h-auto flex-col items-center justify-center bg-slate-950 text-center sm:mt-40">
        <div className="z-10 mx-auto mb-10 flex max-w-fit space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50">
          <p className="text-sm font-semibold tracking-wider text-gray-700">
            Leaper is now public!
          </p>
        </div>
        <div className="flex border-spacing-7 flex-col items-center justify-center rounded-full p-14 md:w-[1270px]">
          <h1 className="max-w-4xl text-5xl font-bold tracking-wider text-navy-200 md:text-6xl lg:text-7xl">
            Chat with your{" "}
            <span className="hidden-text text-slate-950">documents</span> in
            seconds.
          </h1>
          <p className="z-10 mt-5 max-w-prose text-zinc-700 sm:text-lg">
            Leaper allows you to have conversations with any PDF document.
            Simply upload your file and start asking questions right away.
          </p>
        </div>
      </ShinnyWrapperHeader>
    </>
  );
};

export default Home;
