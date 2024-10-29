import Image from "next/image";
import ManageRoom from "../page/manageRoom";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-[#070E1B] text-gray-200">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-700 bg-gradient-to-b from-[#0F1A2D] to-[#070E1B] pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-800 lg:p-4">
          Morph Holesky Starter Kit
        </p>
      </div>

      <div className="relative flex place-items-center">
        <h1 className="text-4xl font-bold text-gray-100">
          Welcome to Morph Holesky starter kit
        </h1>
      </div>
      <ManageRoom />
    </main>
  );
}
