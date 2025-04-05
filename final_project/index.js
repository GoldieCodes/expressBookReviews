const express = require("express")
const jwt = require("jsonwebtoken")
const session = require("express-session")
const customer_routes = require("./router/auth_users.js").authenticated
const gen_routes = require("./router/general.js").general
const jwt_secret = require("./router/auth_users.js").jwtSecret

const app = express()

app.use(express.json())

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
)

app.use("/customer/auth/*", function auth(req, res, next) {
  //Check if the user is authorized and has a valid session
  const authHeader = req.headers.authorization

  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1] // Bearer <token>
    jwt.verify(token, jwt_secret, (err, user) => {
      if (!err) {
        req.user = user
        next()
      } else {
        return res.status(403).json({ message: "Invalid token" })
      }
    })
  } else return res.send("Invalid authorization format")
})

const PORT = 5000

app.use("/customer", customer_routes)
app.use("/", gen_routes)

app.listen(PORT, () => console.log("Server is running"))
