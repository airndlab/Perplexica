import eventEmitter from 'events'

export const allRequests = {}

export const createSearchEmitter = (requestId, query, history, category, space, filename, pipelineType) => {
  const emitter = new eventEmitter()
  allRequests[requestId] = {
    emitter: emitter,
    status: 'pending',
    request: {
      query: query,
      history: history || [],
      categories: [category || ''],
      space: space || '',
      filename: filename || '',
      pipelineType: pipelineType || '',
    }
  }
  return emitter
}
