const dotenv = require("dotenv");
const path = require("path");
const app = require("./app");
const connectDatabase = require("./Config/dataBase");

dotenv.config({ path: path.join(__dirname, "Config", "config.env") });
connectDatabase();

let PORT = process.env.PORT;
let NODE_ENV = process.env.NODE_ENV;

//LISTENING PORT
const server = app.listen(PORT, () =>
  console.log(
    `App listening on port ${PORT} and this is ${NODE_ENV} environment`
  )
);

//Error Handle
process.on("unhandledRejection", (err) => {
  console.log(`error: ${err.message}`);
  console.log("Shutting down the server due to Unhandled Rejection");
  server.close(() => {
    process.exit(1);
  });
});
process.on("uncaughtException", (err) => {
  console.log(`error: ${err.message}`);
  console.log("Shutting down the server due to Uncaught exception");
  server.close(() => {
    process.exit(1);
  });
});
