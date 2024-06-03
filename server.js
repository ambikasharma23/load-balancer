const express = require('express');
const app = express();
const port = 4000;

app.use(express.json());

app.post('/api/rest', (req, res) => {
  setTimeout(() => res.send('REST response'), 500); // FOR  slow response
});

app.post('/api/graphql', (req, res) => {
  res.send('GraphQL response'); // FOR fast response
});

app.post('/api/grpc', (req, res) => {
  setTimeout(() => res.send('gRPC response'), 1000); // FOR very slow response
});

app.listen(port, () => {
  console.log(`Mock server running on port ${port}`);
});
