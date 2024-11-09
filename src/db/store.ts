import eventEmitter from 'events'

export const allRequests = {}

export const createSearchEmitter = (requestId, query, history) => {
  const emitter = new eventEmitter()
  allRequests[requestId] = {
    emitter: emitter,
    status: 'pending',
    request: { query: query, history: history || [] },
    response: { message: '', sources: [] },
  }
  return emitter
}
