"use client";
import { useReadContract, useAccount, useBalance } from "wagmi";
import { useEffect, useState } from "react";
import { bookingAbi, bookingAddress, tokenAddress, tokenAbi } from "@/constants";
import RoomCard from "@/components/RoomCard";
import Header from "@/page/header";

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

  return (
    <div className="container mx-auto w-full">
      {/* 头部 */}
      <Header />

      {/* 房间列表  每行3个房间*/}

      <div className="flex flex-wrap">
        {rooms.length > 0 ? (
          rooms?.map((room: any) => (
            <RoomCard key={room.id} room={room} />
          ))
        ) : (
          <div className="flex justify-center items-center h-full mt-2">
            <h1 className="text-2xl font-semibold">No rooms available</h1>
          </div>
        )}
      </div>
    </div>
  );
}
