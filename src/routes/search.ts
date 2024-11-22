import express from 'express'
import logger from '../utils/logger'
import { allRequests, createSearchEmitter } from '../db/store'
import { v4 as uuidv4 } from 'uuid'

const router = express.Router()

interface ChatRequestBody {
  query: string;
  history: Array<[string, string]>;
}

router.post('/', async(req, res) => {
  try {
    const body: ChatRequestBody = req.body
    if (!body.query) {
      return res.status(400).json({ message: 'Missing focus mode or query' })
    }

    const requestId = uuidv4()
    const emitter = createSearchEmitter(requestId, body.query, body.history, '', '', '', '')

    emitter.on('end', (data) => {
      const parsedData = JSON.parse(data)
      res.status(200).json({
        message: parsedData.message,
        sources: parsedData.sources
      })
      delete allRequests[requestId]
    })

    emitter.on('error', () => {
      res.status(500).json({ message: 'An error has occurred.' })
    })
  } catch (err: any) {
    logger.error(`Error in getting search results: ${err.message}`)
    res.status(500).json({ message: 'An error has occurred.' })
  }
})

router.get('/poll', (req, res) => {
  const pendingRequest = Object.entries(allRequests)
    // @ts-ignore
    .find(([_, requestData]) => requestData.type === 'llm' && requestData.status === 'pending')

  if (!pendingRequest) {
    return res.status(404).json({ message: 'No pending requests available' })
  }

  const [requestId, requestData] = pendingRequest
  // @ts-ignore
  requestData.status = 'processing'

  // @ts-ignore
  res.status(200).json({ requestId, query: requestData.request.query, history: requestData.request.history,
    // @ts-ignore
    categories: requestData.request.categories, space: requestData.request.space, filename: requestData.request.filename
  })
})

router.get('/poll-vlm', (req, res) => {
  const pendingRequest = Object.entries(allRequests)
    // @ts-ignore
    .find(([_, requestData]) => requestData.type === 'vlm' && requestData.status === 'pending')

  if (!pendingRequest) {
    return res.status(404).json({ message: 'No pending requests available' })
  }

  const [requestId, requestData] = pendingRequest
  // @ts-ignore
  requestData.status = 'processing'

  // @ts-ignore
  res.status(200).json({ requestId, query: requestData.request.query, history: requestData.request.history,
    // @ts-ignore
    categories: requestData.request.categories, space: requestData.request.space, filename: requestData.request.filename
  })
})

router.post('/complete', async(req, res) => {
  const { requestId, message, sources, suggestions } = req.body

  const requestData = allRequests[requestId]

  if (!requestData) {
    return res.status(404).json({ message: 'Request not found' })
  }

  try {
    requestData.status = 'completed'

    requestData.emitter.emit(
      'end',
      JSON.stringify({ type: 'all', message, sources, suggestions }),
    );

    res.status(200).json({ message: 'Request processed successfully' })
  } catch (error) {
    requestData.emitter.emit('error')
    logger.error(`Error while processing request ${requestId}: ${error.message}`)
    res.status(500).json({ message: 'An error has occurred while processing the request.' })
  }
})

export default router
