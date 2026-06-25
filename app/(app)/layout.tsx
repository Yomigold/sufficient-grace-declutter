import BottomNav from '../../components/ui/BottomNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-mobile mx-auto min-h-screen relative">
      <main className="pb-20">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
