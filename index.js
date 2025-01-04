const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index', { output: '' });
});

app.post('/decode', (req, res) => {
  const inputString = req.body.inputString;
  const decodedString = Buffer.from(inputString).toString('base64');
  res.render('index', { output: decodedString });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

