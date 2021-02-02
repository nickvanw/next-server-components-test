import { createFromFetch } from 'react-server-dom-webpack'

const endpoint = process.env.NEXT_PUBLIC_ENDPOINT
const env = process.env
const cache = new Map()

export function useRefresh() {
  return function refresh(key, seededResponse) {
    cache.clear()
    cache.set(key, seededResponse)
  }
}

export function useServerResponse(location) {
  const key = JSON.stringify(location)
  let response = cache.get(key)
  if (response) {
    return response
  }
  console.log(env)
  response = createFromFetch(
    fetch(endpoint + '/api?location=' + encodeURIComponent(key))
  )
  cache.set(key, response)
  return response
}
