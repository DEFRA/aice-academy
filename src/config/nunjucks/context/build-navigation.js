export function buildNavigation(request) {
  const path = request?.path ?? ''

  return [
    {
      text: 'Home',
      href: '/',
      current: path === '/'
    },
    {
      text: 'Missions',
      href: '/missions',
      current: path === '/missions' || path.startsWith('/missions/')
    },
    {
      text: 'How it works',
      href: '/how-it-works',
      current: path === '/how-it-works'
    },
    {
      text: 'Glossary',
      href: '/glossary',
      current: path === '/glossary'
    }
  ]
}
