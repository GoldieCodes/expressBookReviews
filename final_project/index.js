const express = require("express")
const jwt = require("jsonwebtoken")
const session = require("express-session")
const customer_routes = require("./router/auth_users.js").authenticated
const gen_routes = require("./router/general.js").general

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
  if (req.session.authorization) {
    let token = req.session.authorization["accessToken"]
    if (token) {
      jwt.verify(token, "fingerprint_customer", (err, user) => {
        if (!err) {
          req.user = user
          next()
        } else {
          return res.status(403).json({ message: "User not authorized" })
        }
      })
    }
  } else return res.send(`You need to login first`)
})

const PORT = 5000

app.use("/customer", customer_routes)
app.use("/", gen_routes)

app.listen(PORT, () => console.log("Server is running"))
