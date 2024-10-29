"use client";
import { Button } from "@/components/ui/button";
import { useReadContract} from "wagmi";
import { useEffect, useState } from "react";
import { bookingAbi, bookingAddress } from "@/constants";
import RoomCard from "@/components/RoomCard";

export default function ManageRoom() {

  const [rooms, setRooms]= useState<any>([]);

  const {data: roomData} = useReadContract({
    abi: bookingAbi,
    address: bookingAddress,
    functionName: "getAllRooms",
  })

  useEffect(() => {
    if (roomData) {
      setRooms(roomData);
    }
  }, [roomData]);


  return (<div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left gap-4">
    <section className="py-12 flex  items-center justify-between ">
  <h1 className="text-lg font-bold">Owner actions</h1>
  <div className="flex items-center gap-2">
   <Button>Add room</Button>

    <Button>Set availability</Button>
  </div>
  <div>
  {rooms.length > 0 ? (
    rooms?.map((room: any) => (
      <>
        {console.log(room)}
        <RoomCard key={room.id} room={room} />
      </>
    ))
  ) : (
    <div>
      <h1 className="text-2xl font-semibold">No rooms available</h1>
      <RoomCard key={1} room={{
        id: "1",
        images: ["https://image.daojiale.com:17000/cqimg/house_sk/202406/04/bba84c6f-fd33-4b50-b4b9-a7d2cfc02c7d.png"],
        name: "test",
        description: "test",
        pricePerNight: "100",
        category: "test",
        isAvailable: true,
      }} />
    </div>
  )}
</div>
</section>
</div>);
}
