/**
 * App module
 */
const app = require("./app/index");

/**
 * Ports set up
 * @const
 */
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});
