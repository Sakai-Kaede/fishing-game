const express = require('express');
const app = express();
const PORT = 5000;
const auth = require('@/src/presentation/User/AuthController');

app.use(express.json());
app.use('/auth', auth);

app.listen(PORT, () => {
  console.log('サーバー起動中🚀');
});