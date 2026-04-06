'use client'

import Link from 'next/link'

export default function WhatsAppFloat() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP ?? '905418771635'

  return (
    <>
      <style>{`
        @keyframes wa-pulse {
          0% { transform: scale(1); opacity: 0.6; }
          70% { transform: scale(1.45); opacity: 0; }
          100% { transform: scale(1.45); opacity: 0; }
        }
        .wa-pulse-ring {
          animation: wa-pulse 2s ease-out infinite;
        }
      `}</style>
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {/* Pulse ring */}
          <div
            className="wa-pulse-ring absolute inset-0 rounded-full"
            style={{ backgroundColor: '#25D366' }}
          />
          <Link
            href={`https://wa.me/${phone}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp ile iletişime geç"
            className="relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg"
            style={{ backgroundColor: '#25D366' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="w-7 h-7"
            >
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm4.97 14.23c-.21.58-1.22 1.14-1.67 1.17-.44.03-.86.2-2.93-.61-2.49-.98-4.08-3.52-4.21-3.68-.13-.16-1.03-1.37-1.03-2.62 0-1.25.65-1.86.88-2.12.23-.26.5-.32.67-.32l.48.01c.15 0 .36-.06.56.43l.72 1.97c.06.17.1.38.01.59l-.27.49-.4.45c-.13.14-.28.3-.12.59.16.29.71 1.17 1.53 1.89.89.79 1.64 1.04 1.86 1.16.22.11.35.09.48-.05l.55-.65c.14-.17.27-.14.45-.08l1.42.67c.42.2.7.3.8.47.1.17.1.96-.11 1.54z"/>
            </svg>
          </Link>
        </div>
      </div>
    </>
  )
}
