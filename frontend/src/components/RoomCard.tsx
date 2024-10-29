"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";


interface RoomProps {
    room: {
      id: string;
      images: string[];
      name?: string;
      description?: string;
      pricePerNight?: string;
      category?: string;
      isAvailable?: boolean;
    }
  }


export default function RoomCard({ room }: RoomProps) {
    return (
        <div className="rounded-lg border p-4">
      {room.images && room.images.length > 0 && (
        <div className="relative w-full h-48">
          <Image 
            src={room.images[0]} 
            alt={room.name || '房间图片'} 
            fill
            className="object-cover rounded-md"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
          
          <div className="mt-3">
            <h2 className="text-lg font-semibold">{room.name || '未命名房间'}</h2>
            <p className="text-gray-600">{room.description || '暂无描述'}</p>
          </div>
        </div>
      );
}
