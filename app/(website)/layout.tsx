import type { Metadata } from 'next'
import Navbar from '@/components/website/Navbar'
import Footer from '@/components/website/Footer'
import WhatsAppFloat from '@/components/website/WhatsAppFloat'

export const metadata: Metadata = {
  title: {
    default: 'Sufficient Grace Declutter — Verified Secondhand Lagos',
    template: '%s | Sufficient Grace Declutter',
  },
  description:
    'Buy and sell verified secondhand furniture, appliances & electronics in Lagos. 42,000+ buyers served. Structured. Trusted. Delivered.',
  keywords: [
    'secondhand Lagos',
    'used furniture Lagos',
    'buy appliances Lagos',
    'SGD',
    'Sufficient Grace Declutter',
    'verified secondhand Nigeria',
  ],
  openGraph: {
    type: 'website',
    siteName: 'Sufficient Grace Declutter',
    locale: 'en_NG',
  },
}

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
