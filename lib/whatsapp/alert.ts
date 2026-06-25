export async function sendWhatsAppAlert(message: string): Promise<void> {
  if (!process.env.WA_API_KEY || !process.env.ALERT_PHONE_NUMBER) return

  await fetch('https://waba.360dialog.io/v1/messages', {
    method: 'POST',
    headers: {
      'D360-API-KEY': process.env.WA_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: process.env.ALERT_PHONE_NUMBER,
      type: 'text',
      text: { body: message },
    }),
  })
}
