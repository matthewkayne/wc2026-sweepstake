export default function Footer() {
  return (
    <div className="mt-12 pb-8 flex justify-center">
      <a
        href="https://aldrix.ai"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 opacity-40 hover:opacity-70 transition-opacity"
      >
        <span className="text-xs text-slate-500">powered by</span>
        <span className="text-sm font-light tracking-tight text-slate-800">
          aldrix<span className="font-medium" style={{ color: '#6366F1' }}>·ai</span>
        </span>
      </a>
    </div>
  )
}
