"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useReadContract, useAccount, useBalance } from "wagmi";
import { useEffect, useState } from "react";
import { bookingAbi, bookingAddress, tokenAddress, tokenAbi } from "@/constants";
import { useWriteContract } from 'wagmi'
import Datepicker from "react-tailwindcss-datepicker";


//定义room的类型
interface RoomProps {
    room: {
      id: string;
      images: string[];
      description?: string;
      pricePerNight: number;
      category: number;
      isAvailable?: boolean;
    }
  }


export default function RoomCard({ room }: RoomProps) {

  const { writeContract } = useWriteContract();

  //根据category的值，返回对应的房间类型  
  function getRoomName(category:number,id:string){
    if(category<0||category>2){
      return "未知房间";
    }
    if(category==0){
      return "总统套房#"+id;
    }
    if(category==1){
      return "豪华套房#"+id;
    }
    return "标准房#"+id;
  }
  //日期选择器
  const [dateValue, setDateValue] = useState<any>({
    startDate: null,
    endDate: null
  });
  //预订房间
  function handleBookRoom(roomId:string){
    console.log("预定房间号："+roomId);
    //计算入住天数
    var days = (dateValue.endDate - dateValue.startDate) / (1000 * 60 * 60 * 24);
    console.log("入住天数："+days);
    // 先将 pricePerNight 转换为 BigInt，然后进行计算
    const priceInWei = BigInt(room.pricePerNight);
    const daysInBigInt = BigInt(Math.floor(days));
    const totalPrice = priceInWei * daysInBigInt;
    //授权代币总额给预定合约
    writeContract({
      abi: tokenAbi,
      address: tokenAddress,
      functionName: 'approve',
      args: [
        bookingAddress,
        totalPrice,
      ],
    });
  }

  const roomName = getRoomName(room.category,room.id);
    return (
        <div className="rounded-lg flex-none w-1/4 mr-2.5 p-2 shadow-lg shadow-gray-700/25">
        {room.images && room.images.length > 0 && (
          console.log(room),
          <div className="relative h-72">
            <Image 
              src={room.images[0]} 
              alt={roomName || '房间图片'} 
              fill
              className="object-cover rounded-md"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
          <div className="mt-3 flex justify-between">
            <div>
              <h2 className="text-lg font-semibold">{roomName}</h2>
              <p className="text-gray-600">
                {(Number(room.pricePerNight) / 1e18).toFixed(4)} HTK/晚
              </p>
            </div>
            <div>
              <Button size="lg" onClick={() => handleBookRoom(room.id)}>预订</Button>
              <Datepicker value={dateValue} onChange={newValue => setDateValue(newValue)} />
            </div>
          </div>
        </div>
      );
}
