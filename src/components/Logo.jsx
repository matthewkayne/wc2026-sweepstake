export default function Logo({ size = 'md' }) {
  const sizes = { sm: 'text-lg', md: 'text-2xl', lg: 'text-4xl' }
  return (
    <div className={`font-black tracking-tight ${sizes[size]}`}>
      <span className="text-blue-700">WC</span>
      <span className="text-yellow-400">2026</span>
    </div>
  )
}
