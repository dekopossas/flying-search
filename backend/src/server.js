const App = require("./app");
require("dotenv").config();

const PORT = process.env.PORT || 3001;

App.listen(PORT, () => console.log(`running at ${PORT}`));
