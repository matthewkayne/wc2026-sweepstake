export default function Logo({ size = 'md' }) {
  const sizes = { sm: 'text-lg', md: 'text-2xl', lg: 'text-4xl' }
  return (
    <div className={`font-black tracking-tight ${sizes[size]}`}>
      <span style={{ color: '#042A4E' }}>WC</span>
      <span style={{ color: '#F99B1C' }}>2026</span>
    </div>
  )
}
