export async function hashPassphrase(passphrase) {
  const encoder = new TextEncoder()
  const data = encoder.encode(passphrase.toLowerCase().trim())
  const buffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}
