"use client";
import Link from 'next/link';
import { BookOpen, Calendar, LogOut } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-indigo-600 text-white p-4 shadow-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <Link href="/" className="font-bold text-lg flex items-center gap-2">
          <BookOpen size={24} />
          <span>ระบบสั่งการบ้าน</span>
        </Link>
        <div className="flex gap-4">
          <Link href="/homework" className="flex items-center gap-1 hover:text-indigo-200">
            <Calendar size={20} />
            <span className="hidden sm:inline">การบ้านของฉัน</span>
          </Link>
          <button 
            onClick={() => {
              localStorage.removeItem('roomId');
              localStorage.removeItem('roomName');
              localStorage.removeItem('userRole');
              window.location.href = '/';
            }}
            className="flex items-center gap-1 hover:text-indigo-200"
          >
            <LogOut size={20} />
            <span className="hidden sm:inline">ออกห้อง</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

