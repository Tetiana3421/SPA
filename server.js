// server.js
const path = require('path');
const jsonServer = require('json-server');
const auth = require('json-server-auth');
const cors = require('cors');

const app = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();


const ORIGIN = process.env.ORIGIN || 'http://localhost:4200';
const corsOptions = {
  origin: ORIGIN,
  credentials: false,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
};
app.use(cors(corsOptions));

app.options('*', cors(corsOptions));


app.use(middlewares);
app.use(jsonServer.bodyParser);


app.get('/users-count', (req, res) => {
  try {
    const count = router.db.get('users').size().value();
    res.json({ count });
  } catch (e) {
    res.status(500).json({ error: 'DB error' });
  }
});

app.get('/dog/random-image', async (req, res) => {
  try {
    const breed = String(req.query.breed || '').trim().toLowerCase();
    if (!breed) return res.status(400).json({ error: 'Missing breed' });

    
    const apiUrl = `https://dog.ceo/api/breed/${breed}/images/random`;

    
    const resp = await fetch(apiUrl);
    if (!resp.ok) return res.status(502).json({ error: 'Dog API error' });
    const data = await resp.json();

    return res.json({ imageUrl: data?.message });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Proxy failed' });
  }
});


app.db = router.db;
app.use(auth);


app.get('/admin/users', (req, res) => {
  
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  res.json(app.db.get('users').value());
});


app.use(router);


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`JSON Server + Auth -> http://localhost:${port} (CORS: ${ORIGIN})`);
});
