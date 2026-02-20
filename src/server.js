const app = require("./app");
const PORT = process.env.PORT || 3000;
(async () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})();
