
# 🍫 Lals – E-Commerce Chocolate Website

[![Live Website](https://img.shields.io/badge/Live%20Demo-Click%20Here-brightgreen)](https://lals-m9p7.onrender.com)

Lals is a beautifully crafted e-commerce website for a chocolate brand. It allows customers to browse, order, and interact with a smart chatbot for assistance. Built using **Node.js** and **EJS**, Lals combines a dynamic front-end with robust backend features including a secure admin dashboard, image cloud storage, NLP chatbot, and more.

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Templating Engine:** EJS
- **Chatbot:** NLP.js
- **Database:** MongoDB (via Mongoose)
- **Image Storage:** Cloudinary
- **Deployment:** Render
- **Emailing:** Nodemailer

---

## 🌐 Live Demo

👉 **[Visit the Live Site](https://lals-m9p7.onrender.com)**

---

## 📦 Features

### 🧑‍💻 User Features

- 🏠 **Home Page:** Products dynamically fetched from the database.
- 📞 **Contact Page:** Submit problems or inquiries via a contact form.
- ℹ️ **About Us Page:** Learn about the Lals brand.
- 💬 **Live Chat:** Talk to our intelligent chatbot built with NLP.js.
- 🛒 **Cart & Checkout:** Add chocolates to your cart and place orders.
- 📧 **Order Confirmation Email:** Confirmation sent automatically upon checkout.

---

### 🔐 Admin Panel (Protected by Authentication)

- 📊 **Dashboard:** Overview of all orders and total revenue.
- 🍬 **Products:** Add, update, or delete products (visible on the home page).
- 📦 **Orders:** View all customer orders and mark them as completed.
- ❓ **Problems:** View and respond to customer-submitted contact form issues. Replies are emailed directly to the customer.

---

## 🧪 Setup Instructions

```bash
# Clone the repository
git clone https://github.com/sufyan2618/Lals.git

# Install dependencies
cd Lals
npm install

# Create .env file and add:
MONGODB_URI=your_mongo_uri
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password

# Run the app
npm start
```

---

## 📬 Contact

For any queries or feedback, feel free to contact us via sufyanliaquat58@gmail.com

---

## 📄 License

This project is licensed under the MIT License.
