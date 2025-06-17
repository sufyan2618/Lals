const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const expressLayouts = require("express-ejs-layouts");
const expressWs = require("express-ws");
const connectDb = require("./lib/connectDb");
const app = express();
expressWs(app);

// Middleware
app.use(cookieParser());
app.use(session({ secret: "My session secret", resave: false, saveUninitialized: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(express.static("uploads"));
app.set("view engine", "ejs");
app.use(expressLayouts);


// Session-based locals
app.use((req, res, next) => {
  res.locals.customerId = req.session.customerId;
  res.locals.customerName = req.session.customerName;
  next();
});

// Routes
const { router: authRouter, isAuthenticated } = require("./routes/auth.router");

app.use("/admin", isAuthenticated);
app.use(require("./routes/admin/products.router"));
app.use(require("./routes/admin/dashboard.router"));
app.use(require("./routes/admin/category.router"));
app.use(require("./routes/admin/orders.router"));
app.use(require("./routes/checkout.router"));
app.use(require("./routes/problem.router"));
app.use(require("./routes/customer.router"));
app.use(authRouter);

// WebSocket Chatbot
const chatbot = require("./models/chatbot/chatbot");
app.ws("/chatbot", async (ws, req) => {
  ws.on("message", async (msg) => {
    try {
      const response = await chatbot.processMessage(msg);
      ws.send(JSON.stringify({ message: response }));
    } catch {
      ws.send(JSON.stringify({ error: "Something went wrong" }));
    }
  });
});

// Models
const ProductModel = require("./models/product.model");
const Problem = require("./models/problem.model");

// Routes
app.get("/", async (req, res) => {
  const products = await ProductModel.find();
  res.render("home", { products });
});

app.get("/about-us", (req, res) => {
  res.render("about-us");
});

app.get("/contact-us", (req, res) => {
  res.render("contact-us");
});

app.post("/contact-us", async (req, res) => {
  const { name, email, message } = req.body;
  await new Problem({ name, email, message }).save();
  res.redirect("/contact-us");
});

app.get("/chat", (req, res) => {
  res.render("chat", { layout: "layout" });
});

app.get("/search", async (req, res) => {
  try {
    const searchQuery = req.query.q;
    if (!searchQuery) return res.redirect("/");
    const searchPattern = new RegExp(searchQuery, "i");
    const products = await ProductModel.find({
      $or: [{ title: searchPattern }, { description: searchPattern }]
    });
    res.render("search-results", { products, searchQuery, layout: "layout" });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).send("Error performing search");
  }
});

// Cart logic
app.get("/add-to-cart/:id", (req, res) => {
  let cart = req.cookies.cart || [];
  const productId = req.params.id;
  const productInCart = cart.find(item => item.id === productId);

  if (productInCart) {
    productInCart.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  res.cookie("cart", cart);
  res.redirect("/");
});

app.post("/update-cart/:id", (req, res) => {
  try {
    let cart = req.cookies.cart || [];
    const productId = req.params.id;
    const quantity = parseInt(req.body.quantity);

    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ success: false, message: "Invalid quantity provided" });
    }

    const productInCart = cart.find(item => item.id === productId);
    if (productInCart) {
      productInCart.quantity = quantity;
    } else {
      cart.push({ id: productId, quantity });
    }

    res.cookie("cart", cart);
    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ success: false, message: "Error updating cart" });
  }
});

app.get("/cart", async (req, res) => {
  try {
    let cart = req.cookies.cart || [];
    let productIds = cart.map(item => item.id);
    let products = await ProductModel.find({ _id: { $in: productIds } });

    let totalPrice = 0;
    let cartItems = products.map(product => {
      const cartItem = cart.find(item => item.id === product._id.toString());
      if (cartItem) {
        const itemTotal = product.price * cartItem.quantity;
        totalPrice += itemTotal;
        return {
          product,
          quantity: cartItem.quantity,
          totalPrice: itemTotal.toFixed(2)
        };
      }
    }).filter(Boolean);

    res.render("cart", { cartItems, totalPrice, cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/remove-from-cart/:id", (req, res) => {
  try {
    const productId = req.params.id;
    let cart = req.cookies.cart || [];
    cart = cart.filter(item => item.id !== productId);
    res.cookie("cart", cart);
    res.json({ success: true, message: "Item removed from cart", cart });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ success: false, message: "Failed to remove item from cart" });
  }
});

// Server start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDb();
});
