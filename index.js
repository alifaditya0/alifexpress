const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Import routers
const detail_kkRouter = require('./routes/detail_KK');
app.use('/routes/detail_kk',detail_kkRouter);
const ktpRouter = require('./routes/ktp');
app.use(ktpRouter);
const mhsRouter = require('./routes/mahasiswa');
app.use(mhsRouter);

// Use routers for specific paths




app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
