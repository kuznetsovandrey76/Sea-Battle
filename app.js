const express = require('express');
const app = express();
const port = 8080;

app.use(express.static('public'));

// app.get('/', (req, res) => res.render('index'))

app.listen(process.env.PORT || port, () => console.log(`Express запущен на http://localhost:${port}\nнажмите CTRL+C для завершения`)); 

