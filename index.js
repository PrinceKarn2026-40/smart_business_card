require('dotenv').config();
const app = require('./server/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} [${process.env.NODE_ENV}]`);
});
