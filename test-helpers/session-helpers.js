import { load } from 'cheerio'

/**
 * Simulates one browser session against the server: keeps cookies between
 * requests and adds the CSRF crumb to form posts, like a real form would.
 * @param {import('@hapi/hapi').Server} server
 */
export function createSession(server) {
  const cookieJar = new Map()

  const cookieHeader = () =>
    [...cookieJar].map(([name, value]) => `${name}=${value}`).join('; ')

  const storeCookies = (response) => {
    ;[response.headers['set-cookie']]
      .flat()
      .filter(Boolean)
      .forEach((cookie) => {
        const [pair] = cookie.split(';')
        const separator = pair.indexOf('=')
        cookieJar.set(pair.slice(0, separator), pair.slice(separator + 1))
      })
  }

  const get = async (url) => {
    const response = await server.inject({
      method: 'GET',
      url,
      headers: { cookie: cookieHeader() }
    })
    storeCookies(response)

    return response
  }

  const post = async (url, payload = {}, formUrl = url) => {
    const formPage = await get(formUrl)
    const crumb = load(formPage.payload)('input[name="crumb"]').val()
    const response = await server.inject({
      method: 'POST',
      url,
      headers: { cookie: cookieHeader() },
      payload: { ...payload, crumb }
    })
    storeCookies(response)

    return response
  }

  return { get, post }
}
