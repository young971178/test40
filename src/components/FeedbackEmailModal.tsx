import React from 'react';
import { X } from 'lucide-react';

export function FeedbackEmailModal({ isOpen, onClose, candidate }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-slate-900 text-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-700 p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-indigo-300">피드백 발송</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="mb-4 text-sm text-slate-300">
          <p>수신자: {candidate?.candidateName}</p>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-slate-800 rounded-xl text-xs">닫기</button>
          <button onClick={onClose} className="px-4 py-2 bg-indigo-600 rounded-xl text-xs font-bold">발송 완료</button>
        </div>
      </div>
    </div>
  );
}