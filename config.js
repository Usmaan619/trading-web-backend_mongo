 const common = {
  SECRET: "e1569743aa91c36993cd6a679115e601b3e7423515c29bee6eec33ad5aa0138d5",
};

const dev = {
  // MONGODB_URI: "mongodb://localhost:27017/vit",
  MONGODB_URI:
    "mongodb+srv://bhaiUser:vObA0ycDzlgBDfkl@bhaifinance.nys6gmc.mongodb.net/bhaipay?retryWrites=true&w=majority",
};
const prod = {
  MONGODB_URI:
    "mongodb+srv://bhaiUser:vObA0ycDzlgBDfkl@bhaifinance.nys6gmc.mongodb.net/bhaipay?retryWrites=true&w=majority",
};

const config = {
  ...common,
  ...(process.env.NODE_ENV === "prod" ? prod : dev),
};
console.log("NODE_ENV: ", process.env.NODE_ENV);

// console.log("config: ", config);

export default config;
