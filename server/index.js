const path = require('path');
const morgan = require('morgan');
const express = require('express');
const app = express();

// Static middleware so your browser can request things like your 'bundle.js'
app.use(express.static(path.join(__dirname, '..', 'public')))

// Loggin middleware
app.use(morgan('dev'));

// Body parsing middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// api router for all backend routes
app.use('/api', require('./api'))

// For all GET requests that aren't to an API route, we will send the index.html!
app.get('*', function (req, res, next) {
  res.sendFile(path.join(__dirname, '..', 'public/index.html'));
})

// Handle 404s
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// Error handling endware
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send(err.message || 'Internal server error')
})

// Port and Database
const port = process.env.PORT || 3000;
const {db} = require('./db/index')

const init = async () => {
  await db.sync()
  console.log('Database is synced!!!')
  app.listen(port, () => console.log(`

  Listening on port ${port}
  http://localhost:3000/

`))
}

init()
