const LowHealthOverlay = () => (
  <div
    className="pointer-events-none fixed inset-0 animate-[low-health-opacity_0.5s_ease-in-out_infinite_alternate]"
    style={{ boxShadow: 'inset 0 0 160px 40px red' }}
  />
)

const LowHealthPage = () => <LowHealthOverlay />

LowHealthPage.title = 'Low Health'
LowHealthPage.description = 'A full-screen overlay with a pulsing red CSS inner box shadow to indicate low health.'

export default LowHealthPage
