"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Users, Lock, LogIn, Plus } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Login State
  const [selectedRoom, setSelectedRoom] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Create Room State
  const [isCreating, setIsCreating] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomPassword, setNewRoomPassword] = useState('');
  const [newRoomAdminPin, setNewRoomAdminPin] = useState('');

  useEffect(() => {
    const savedRoomId = localStorage.getItem('roomId');
    if (savedRoomId) {
      router.push('/homework');
    } else {
      fetchRooms();
    }
  }, [router]);

  const fetchRooms = async () => {
    try {
      const res = await fetch('/api/rooms');
      const data = await res.json();
      if (data.success) {
        setRooms(data.rooms || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return alert("กรุณาเลือกห้องเรียน");
    if (!password) return alert("กรุณากรอกรหัสผ่าน");

    const room = rooms.find(r => r.roomId === selectedRoom);
    if (!room) return alert("ไม่พบห้องเรียน");

    // Check if logging in as Admin or Member
    if (password === String(room.adminPin)) {
      localStorage.setItem('roomId', room.roomId);
      localStorage.setItem('roomName', room.roomName);
      localStorage.setItem('userRole', 'admin');
      router.push('/homework');
    } else if (password === String(room.joinPassword)) {
      localStorage.setItem('roomId', room.roomId);
      localStorage.setItem('roomName', room.roomName);
      localStorage.setItem('userRole', 'member');
      router.push('/homework');
    } else {
      alert("รหัสผ่านไม่ถูกต้อง");
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName || !newRoomPassword || !newRoomAdminPin) {
      return alert("กรุณากรอกข้อมูลให้ครบ");
    }
    setIsLoginLoading(true);
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomName: newRoomName,
          joinPassword: newRoomPassword,
          adminPin: newRoomAdminPin
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("สร้างห้องสำเร็จ!");
        setIsCreating(false);
        fetchRooms();
      } else {
        alert("ผิดพลาด: " + data.error);
      }
    } catch (e) {
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setIsLoginLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">กำลังโหลด...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-100 p-4 rounded-full text-indigo-600">
            <BookOpen size={48} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">ระบบแจ้งเตือนการบ้าน</h1>
        <p className="text-gray-500 text-center mb-8">เข้าสู่ห้องเรียนเพื่อดูการบ้านของคุณ</p>

        {!isCreating ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">เลือกห้องเรียน</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                  required
                >
                  <option value="">-- เลือกห้องเรียน --</option>
                  {rooms.map(r => (
                    <option key={r.roomId} value={r.roomId}>{r.roomName}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่านเข้าห้อง</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="รหัสผ่านนักเรียน หรือ รหัสแอดมิน"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl flex justify-center items-center gap-2 hover:bg-indigo-700 transition-colors"
            >
              <LogIn size={20} />
              เข้าสู่ห้องเรียน
            </button>
            
            <div className="pt-4 text-center border-t">
              <button 
                type="button" 
                onClick={() => setIsCreating(true)}
                className="text-indigo-600 text-sm font-medium hover:underline"
              >
                + สร้างห้องเรียนใหม่
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCreateRoom} className="space-y-4">
            <h2 className="font-bold text-gray-800 text-center mb-4">สร้างห้องเรียนใหม่</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อห้องเรียน (เช่น ม.4/1)</label>
              <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่านสำหรับนักเรียน (Join Password)</label>
              <input
                type="text"
                value={newRoomPassword}
                onChange={(e) => setNewRoomPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="เช่น 1234"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่านแอดมิน (Admin PIN)</label>
              <input
                type="text"
                value={newRoomAdminPin}
                onChange={(e) => setNewRoomAdminPin(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="สำหรับแอดมินห้อง (เพิ่มการบ้าน)"
                required
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="flex-1 bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={isLoginLoading}
                className="flex-1 bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
              >
                {isLoginLoading ? "กำลังสร้าง..." : "ยืนยันสร้างห้อง"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
