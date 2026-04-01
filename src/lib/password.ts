export function getPasswordStrength(password: string): {
  score: number
  label: string
  color: string
} {
  if (!password) return { score: 0, label: '', color: '' }
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  if (score <= 1) return { score, label: 'Lemah', color: 'bg-red-400' }
  if (score === 2) return { score, label: 'Cukup', color: 'bg-yellow-400' }
  if (score === 3) return { score, label: 'Kuat', color: 'bg-blue-400' }
  return { score, label: 'Sangat kuat', color: 'bg-green-500' }
}
