export default defineEventHandler(async () => {
  try {
    const res = await fetch('https://registry.npmjs.org/nacr-design/latest')
    const data = await res.json()
    return { version: data.version || '0.1.0' }
  }
  catch {
    return { version: '0.1.0' }
  }
})
