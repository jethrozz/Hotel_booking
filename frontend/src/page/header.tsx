"use client";
import { Button } from "@/components/ui/button";
import { useReadContract, useAccount, useBalance } from "wagmi";
import { useEffect, useState } from "react";
import { bookingAbi, bookingAddress, tokenAddress } from "@/constants";
import AddRoom from "@/components/AddRoom";

export default function Header() {

  const [rooms, setRooms]= useState<any>([]);

  const {address} = useAccount();
  const {data: balance} = useBalance({
    address: address, // 持有代币的钱包地址
    token: tokenAddress, // IERC20代币的合约地址
  });

  const {data: ownerData} = useReadContract({
    abi: bookingAbi,
    address: bookingAddress,
    functionName: "getOwner",
  })
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

  //点击add room 弹出add room组件
  const [showAddRoom, setShowAddRoom] = useState(false);

  return (
    <div className="container mx-auto px-12">
      <div className="flex justify-between items-center py-6 w-full">
        {/* 左侧 Owner Actions */}
        <div className="flex-none">

          {ownerData === address ? (
                    <div className="flex items-center">
                    <div className="text-lg font-bold " style={{marginRight: '1rem'}}>Owner actions</div>
                    <div className="flex gap-2">
                      <Button onClick={() => setShowAddRoom(true)}>Add room</Button>
                      <Button>Set availability</Button>
                      <div className="flex gap-2 font-bold">you have {balance ? Number(balance.value) / 10**18 : 0} HTK</div>
                    </div>
                  </div>
          ) : (
            <div className="flex items-center">
              <div className="text-lg font-bold " style={{marginRight: '1rem'}}>welcome {address}</div>
              <div className="flex gap-2 font-bold">you have {balance ? Number(balance.value) / 10**18 : 0} HTK</div>
            </div>
          )}
        </div>



        {/* 右侧钱包连接按钮 */}
        <div className="flex-none">
            <w3m-button />
        </div>
      </div>

      {showAddRoom && <AddRoom showModal={true} onClose={() => setShowAddRoom(false)} />}
    </div>
  );
}
