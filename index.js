require("dotenv").config()

const app = require("./app")

const {PORT} = process.env
// process.env.PORT

app.listen(PORT, () => {
    console.log(`Sever is running at https://localhost:${PORT}`);
})