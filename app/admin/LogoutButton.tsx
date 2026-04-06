'use client'

export default function LogoutButton() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
      e.preventDefault()
    }
  }

  return (
    <form method="POST" action="/api/admin/auth/logout" onSubmit={handleSubmit}>
      <button className="w-full px-4 py-2 rounded-lg transition-all text-sm font-bold text-white/70 hover:text-white hover:bg-red-500/80 border border-white/10 hover:border-red-400">
        🚪 Çıkış Yap
      </button>
    </form>
  )
}
