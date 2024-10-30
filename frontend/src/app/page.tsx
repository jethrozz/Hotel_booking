import Image from "next/image";
import ManageRoom from "../page/manageRoom";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col justify-between p-8 bg-[#070E1B] text-gray-200">
      <ManageRoom />
    </main>
  );
}
