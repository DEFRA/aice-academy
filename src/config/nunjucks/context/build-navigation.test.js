import { buildNavigation } from './build-navigation.js'

function mockRequest(options) {
  return { ...options }
}

const currentItems = (navigation) =>
  navigation.filter((item) => item.current).map((item) => item.text)

describe('#buildNavigation', () => {
  test('Should provide expected navigation details', () => {
    expect(
      buildNavigation(mockRequest({ path: '/non-existent-path' }))
    ).toEqual([
      { current: false, text: 'Home', href: '/' },
      { current: false, text: 'Missions', href: '/missions' },
      { current: false, text: 'How it works', href: '/how-it-works' },
      { current: false, text: 'Glossary', href: '/glossary' }
    ])
  })

  test('Should provide expected highlighted navigation details', () => {
    expect(currentItems(buildNavigation(mockRequest({ path: '/' })))).toEqual([
      'Home'
    ])
  })

  test('Should highlight Missions on a mission page', () => {
    expect(
      currentItems(buildNavigation(mockRequest({ path: '/missions/gear-up' })))
    ).toEqual(['Missions'])
  })

  test('Should not highlight anything without a request', () => {
    expect(currentItems(buildNavigation())).toEqual([])
  })
})
