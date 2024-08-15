const express = require('express');
const { connect, StringCodec } = require('nats');
const port = 5000;

const app = express();

// Create a NATS connection
const createNatsConnection = async () => {
  const nc = await connect({ servers: 'nats://localhost:4222' });
  const sc = StringCodec();

  const sub = nc.subscribe('calculateArea');
  for await (const m of sub) {
    console.log(`[${sub.getProcessed()}]: ${sc.decode(m.data)}`);
    const { radius, height } = JSON.parse(sc.decode(m.data));
    const area = Math.PI * radius * radius * height;
    m.respond(sc.encode(area.toString()))
  }
  console.log('Subscription closed');
};

// Start the NATS connection
createNatsConnection().catch((err) => {
  console.error('Error connecting to NATS:', err);
});

// Handle HTTP requests
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
