"use client";
import { useState } from "react";
import Image from "next/image";
import { useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { bookingAbi, bookingAddress } from "@/constants";

interface AddRoomProps {
    showModal: boolean;
    onClose: () => void;
  }

export default function AddRoom({showModal, onClose}: AddRoomProps ){

    const handleClose = () => {
        setIsOpen(false)
        onClose();
    }
    const [isOpen, setIsOpen] = useState(showModal)
    const [formData, setFormData] = useState({
        category: 0, // 0: Standard, 1: Deluxe, 2: Suite
        pricePerNight: '',
        images: [] as string[]
      })
      const [currentImage, setCurrentImage] = useState('')
      const { writeContract, isPending } = useWriteContract();
      // 表单提交
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        try {
          await writeContract({
            address: bookingAddress,
            abi: bookingAbi,
            functionName: 'addRoom',
            args: [
              BigInt(formData.category),
              parseEther(formData.pricePerNight),
              formData.images
            ]
          })
          handleClose()
          // 重置表单
          setFormData({
            category: 0,
            pricePerNight: "",
            images: []
          })
          
        } catch (error) {
          console.error('添加房间失败:', error)
        }
      }
      //添加图片
      const addImage = () => {
        if (currentImage) {
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, currentImage]
          }))
          setCurrentImage('')
        }
      }


      return (
        <>    
          {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              {/* 背景遮罩 */}
              <div 
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={() => handleClose()}
              />
              
              {/* 模态框内容 */}
              <div className="relative bg-white rounded-lg w-full max-w-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">添加新房间</h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-800">房间类型</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        category: Number(e.target.value)
                      }))}
                      className="w-full p-2 border rounded text-gray-800"
                    >
                      <option value={0} className="text-gray-800">总统套房</option>
                      <option value={1} className="text-gray-800">豪华房</option>
                      <option value={2} className="text-gray-800">标准房</option>
                    </select>
                  </div>
    
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-800">每晚价格 (ETH)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.pricePerNight}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        pricePerNight: e.target.value
                      }))}
                      className="w-full p-2 border rounded text-gray-800"
                    />
                  </div>
    
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-800">房间图片</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={currentImage}
                        onChange={(e) => setCurrentImage(e.target.value)}
                        placeholder="输入图片URL"
                        className="flex-1 p-2 border rounded text-gray-800"
                      />
                      <button
                        type="button"
                        onClick={addImage}
                        className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-800"
                      >
                        添加
                      </button>
                    </div>
                    
                    <div className="mt-2 max-h-24 overflow-y-auto">
                      {formData.images.map((url, index) => (
                        <div key={index} className="flex items-center gap-2 mt-1">
                          <span className="text-sm truncate flex-1 text-gray-600">{url}</span>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index)
                            }))}
                            className="text-red-500 hover:text-red-700 text-red-800"
                          >
                            删除
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
    
                  <div className="flex justify-end gap-2 mt-6">
                    <button
                      type="button"
                      onClick={() => handleClose()}
                      className="px-4 py-2 border rounded hover:bg-gray-100 text-gray-800"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                    >
                      {isPending ? "处理中..." : "添加房间"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )
}