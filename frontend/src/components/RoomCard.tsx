"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";



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
                {(Number(room.pricePerNight) / 1e18).toFixed(4)} ETH/晚
              </p>
            </div>
            <div>
              <Button size="lg">预订</Button>
            </div>
          </div>
        </div>
      );
}
