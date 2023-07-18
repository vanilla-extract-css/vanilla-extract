import express from 'express';
import { createServer as createViteServer } from 'vite';

import { compile } from '.';

async function createServer() {
  const app = express();

  app.use(express.json());

  app.post('/ve', async (req, res) => {
    try {
      const result = await compile(req.body);

      res.send(result);
    } catch (e) {
      console.error(e);
      res.send({});
    }
  });

  const vite = await createViteServer({
    server: { middlewareMode: true },
  });
  app.use(vite.middlewares);

  app.listen(5173, () => {
    console.log('Listening on http://localhost:5173');
  });
}

createServer();
