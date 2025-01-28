import Image from "next/image";

const Loading = () => {
  return (
    <>
      <div className="w-full h-full">
        <div className="min-w-screen min-h-screen flex justify-center items-center">
          <Image src="/loading-spin.svg" alt="Loading" width={250} height={250} priority={true}/>
        </div>
      </div>
    </>
  );
};

export default Loading;
