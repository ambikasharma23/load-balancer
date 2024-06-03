const express = require('express');
const axios = require('axios');
const morgan = require('morgan');
const QueueManager = require('./queuemanager');

const app = express();
const port = 3000;

app.use(express.json());
app.use(morgan('combined'));

const endpoints = [
  { url: 'http://localhost:4000/api/rest', type: 'REST' },
  { url: 'http://localhost:4000/api/graphql', type: 'GraphQL' },
  { url: 'http://localhost:4000/api/grpc', type: 'gRPC' }// grpc api 
];

const queueManager = new QueueManager();
const metrics = [];

function getRandomEndpoint() {
  return endpoints[Math.floor(Math.random() * endpoints.length)];
}

function getEndpointByType(type) {
  return endpoints.find(endpoint => endpoint.type === type);
}

app.post('/enqueue', (req, res) => {
  const { type, queueType, priority } = req.body;
  const request = { ...req.body, priority };

  queueManager.addRequest(request, queueType);
  res.status(200).send('Request enqueued');
});

app.get('/process', async (req, res) => {
  const { queueType } = req.query;
  if (!queueManager.hasRequests(queueType)) {
    return res.status(404).send('No requests in queue');
  }

  const request = queueManager.getNextRequest(queueType);
  const startTime = Date.now();

  const selectedEndpoint = getEndpointByType(request.type) || getRandomEndpoint();
  
  try {
    const response = await axios({
      method: request.method,
      url: selectedEndpoint.url,
      data: request.data
    });

    const endTime = Date.now();
    metrics.push({
      requestTime: startTime,
      responseTime: endTime,
      duration: endTime - startTime,
      endpoint: selectedEndpoint.url,
      status: response.status
    });

    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

app.get('/metrics', (req, res) => {
  res.send(metrics);
});

app.listen(port, () => {
  console.log(`Load balancer with queue management running on port ${port}`);
});
