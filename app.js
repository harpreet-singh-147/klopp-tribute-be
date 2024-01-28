const express = require('express');
const app = express();

const PORT = process.env.port || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello');
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
