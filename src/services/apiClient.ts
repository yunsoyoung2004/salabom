type ApiRequestOptions = { signal?: AbortSignal; timeoutMs?: number }

export class PublicDataError extends Error {
  state: 'error' | 'blocked_endpoint' | 'api_response_mismatch'
  constructor(message: string, state: 'error' | 'blocked_endpoint' | 'api_response_mismatch' = 'error') { super(message); this.state = state }
}

function xmlElementToObject(element: Element): unknown {
  const children = [...element.children]
  if (!children.length) return element.textContent?.trim() ?? ''
  return children.reduce<Record<string, unknown>>((result, child) => {
    const key = child.localName
    const value = xmlElementToObject(child)
    const existing = result[key]
    result[key] = existing === undefined ? value : Array.isArray(existing) ? [...existing, value] : [existing, value]
    return result
  }, {})
}

function parseApiPayload<T>(text: string, contentType: string): T {
  if (contentType.includes('json') || text.trimStart().startsWith('{')) return JSON.parse(text) as T
  const document = new DOMParser().parseFromString(text, 'application/xml')
  if (document.querySelector('parsererror')) throw new PublicDataError('Malformed XML response')
  return { [document.documentElement.localName]: xmlElementToObject(document.documentElement) } as T
}

export async function requestPublicJson<T>(path: string, params: Record<string, string | number | undefined>, options: ApiRequestOptions = {}): Promise<T> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), options.timeoutMs ?? 20_000)
  const onAbort = () => controller.abort()
  options.signal?.addEventListener('abort', onAbort, { once: true })
  const query = new URLSearchParams(Object.entries(params).filter((entry): entry is [string, string] => entry[1] !== undefined).map(([key, value]) => [key, String(value)]))
  try {
    const response = await fetch(`${path}?${query}`, { signal: controller.signal })
    if (!response.ok) throw new PublicDataError(`HTTP ${response.status}`, [401, 403, 404, 410].includes(response.status) ? 'blocked_endpoint' : 'error')
    const payload: unknown = parseApiPayload<T>(await response.text(), response.headers.get('content-type') ?? '')
    if (!payload || typeof payload !== 'object') throw new PublicDataError('Malformed JSON response')
    return payload as T
  } catch (error) {
    if (error instanceof PublicDataError) throw error
    throw new PublicDataError(error instanceof Error && error.name === 'AbortError' ? 'Request timed out or was cancelled' : 'Network request failed')
  } finally {
    window.clearTimeout(timeout)
    options.signal?.removeEventListener('abort', onAbort)
  }
}
