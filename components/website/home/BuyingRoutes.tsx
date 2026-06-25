const ROUTES = [
  {
    title: 'Point & Kill',
    badge: 'Most Popular',
    badgeColor: '#C9924A' as const,
    badgeTextColor: '#0C0C0C' as const,
    description:
      'Pay SGD. We go to the seller, inspect the item, verify condition, and deliver to you. You never have to leave your house.',
    bestFor: 'Buyers who want zero risk and full service',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: 'Self Inspection',
    badge: 'Budget-Conscious',
    badgeColor: '#252525' as const,
    badgeTextColor: '#888888' as const,
    description:
      'Pay SGD. We send you the seller\'s details. You arrange your own visit and pickup. SGD margin still applies.',
    bestFor: 'Buyers who prefer to inspect themselves',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
]

export default function BuyingRoutes() {
  return (
    <section
      className="bg-surface py-20"
      style={{ borderTop: '1.5px solid #C9924A' }}
    >
      <div className="max-w-site mx-auto px-6">
        <div className="text-center mb-14">
          <p className="font-ui text-xs tracking-[0.3em] uppercase text-gold mb-3">Choose Your Path</p>
          <h2 className="font-display text-4xl md:text-5xl text-warm font-semibold">
            Two Ways to Buy
          </h2>
          <div className="w-9 h-0.5 bg-gold mx-auto mt-4" />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {ROUTES.map((route) => (
            <div
              key={route.title}
              className="p-8"
              style={{
                background: '#1A1A1A',
                border: '1px solid rgba(201,146,74,0.2)',
                borderRadius: '4px',
              }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="text-gold">{route.icon}</div>
                <span
                  className="font-ui text-[10px] font-semibold tracking-[0.1em] uppercase px-3 py-1.5"
                  style={{
                    background: route.badgeColor,
                    color: route.badgeTextColor,
                    borderRadius: '2px',
                  }}
                >
                  {route.badge}
                </span>
              </div>

              <h3 className="font-display text-2xl text-warm font-semibold mb-4">
                {route.title}
              </h3>
              <p className="font-ui text-sm text-body leading-relaxed mb-6">
                {route.description}
              </p>

              <div
                className="pt-5"
                style={{ borderTop: '1px solid rgba(201,146,74,0.15)' }}
              >
                <p className="font-ui text-xs tracking-[0.1em] uppercase text-muted mb-1">Best for</p>
                <p className="font-ui text-sm text-body">{route.bestFor}</p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="text-center px-6 py-5"
          style={{
            background: 'rgba(201,146,74,0.05)',
            border: '1px solid rgba(201,146,74,0.3)',
            borderRadius: '4px',
          }}
        >
          <p className="font-ui text-sm text-gold font-semibold">
            In both cases — payment to SGD comes FIRST. Always.
          </p>
        </div>
      </div>
    </section>
  )
}
