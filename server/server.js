const express = require('express');
const cors = require('cors');
const jsonGraphqlServer = require('json-graphql-server');
const data = require('./db');

// Verify data structure
if (!data || typeof data !== 'object') {
  throw new Error('Invalid data structure in db.js');
}

const app = express();

// Enable CORS
app.use(cors());

// Debug data load
console.log('Loading GraphQL data:', Object.keys(data));

// Setup GraphQL endpoint
app.use('/graphql', jsonGraphqlServer.default(data));

const PORT = 4001;
app.listen(PORT, () => {
  console.log(`🚀 GraphQL Server running at http://localhost:${PORT}/graphql`);
});