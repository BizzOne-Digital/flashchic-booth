import Link from 'next/link'

export default function BookingSuccess() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center luxury-card p-12">
        <div className="w-20 h-20 border border-green-400/50 flex items-center justify-center mx-auto mb-8">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5"/>
          </svg>
        </div>
        <h1 className="font-display text-3xl text-white mb-4">Payment <span className="gold-text font-semibold">Confirmed!</span></h1>
        <p className="text-white/60 text-sm leading-relaxed mb-8">
          Your deposit has been received. We'll send a confirmation email and contact you within 24 hours to finalize all details.
        </p>
        <p className="text-white/40 text-sm mb-6">Questions? <a href="tel:5148318409" className="text-[#d4af37]">(514) 831-8409</a></p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/" className="btn-gold flex-1 py-3 text-xs tracking-widest font-semibold text-center">Back to Home</Link>
          <a href="https://instagram.com/flashchicphotobooth" target="_blank" rel="noopener noreferrer" className="flex-1 border border-[#d4af37]/40 text-[#d4af37] py-3 text-xs tracking-widest text-center hover:bg-[#d4af37]/10 transition-all">Follow Us</a>
        </div>
      </div>
    </div>
  )
}
