'use client'

import { useStore } from '@/store/useStore'
import { useEffect, useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'

export function ToastProvider() {
  const { toast } = useStore()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (toast) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  }, [toast])

  if (!toast) return null

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 shadow-xl transition-all duration-300"
      style={{
        backgroundColor: '#141414',
        border: `1px solid ${toast.type === 'success' ? '#FFD700' : '#ef4444'}`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        minWidth: '280px',
        maxWidth: '400px',
      }}
    >
      {toast.type === 'success' ? (
        <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#FFD700' }} />
      ) : (
        <XCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#ef4444' }} />
      )}
      <p className="text-sm" style={{ color: '#F5F5F5' }}>{toast.message}</p>
    </div>
  )
}
