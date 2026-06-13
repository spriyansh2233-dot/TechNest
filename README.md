# TechHub — Premium Tech Marketplace

TechHub is a premium, light-themed, state-of-the-art e-commerce storefront designed for modern tech enthusiasts. Inspired by high-end design systems (like Apple Store, Nothing, and Samsung), TechHub features curated light gradients, sleek glassmorphism, stationary ambient background glows, compact navigation, and a secure shopping experience powered by a Spring Boot backend and a React/Vite frontend.

---

## 🌟 Key Features

### 1. Premium Light-Theme Styling
- **Curated Palette**: Utilizes clean `#F8F9FC` page backdrops, `#FFFFFF` cards, soft lavender/blue accents, and modern border systems.
- **Fixed Ambient Glows**: Stationary fixed radial backdrop glows in `body` for stationary glowing spots as the page scrolls.
- **Alternating Sections**: Beautiful transitions with alternating white, soft lavender, and soft blue-gray section backgrounds.

### 2. Upgraded Product & Category Cards
- **Product Spotlights**: Elegant radial purple spotlights (`rgba(109, 93, 252, 0.03)`) directly behind product images to draw focus.
- **Shadows & Elevation**: Custom `.premium-product-card` and `.premium-category-card` styles featuring soft borders and premium diffuse shadows.
- **Hover Physics**: Micro-interactions with smooth translation and scale springs on card hover.

### 3. Smart Compact Navigation
- **Translucent Header**: High-end glassmorphic sticky navbar with 25% more compact spacing.
- **Scroll Direction Tracker**: Automatically hides/reveals itself based on page scrolling direction to maximize active screen real estate.
- **Text-Based Logo**: Clean text and symbol representation utilizing the `deployed_code` Material Icon for consistency.

### 4. Full-Featured Shopping Experience
- **Authentication**: Fully functional secure SignUp, Login, and Session Recovery (auto-redirect to login when JWT token expires).
- **Cart & Wishlist**: Real-time state management with cart item quantity adjustments, out-of-stock validation, local guest persistence (using `localStorage`), and backend synchronization on login.
- **Smart Category Filtering**: Intuitive filtering pills mapped correctly to database categories (Audio Gear, Smart Wearables, Gaming, Smart Devices, Accessories).
- **Orders Dashboard**: Interactive order history tracking, order cancellations, and simulated secure checkouts.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Vanilla CSS, Tailwind CSS, Framer Motion, Lucide Icons, Axios
- **Backend**: Spring Boot, Java, JPA/Hibernate, Spring Security, JWT (JSON Web Tokens), MySQL
- **Environment**: Fully containerizable and configured with environment variable overrides.

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v18+)
- Java JDK 17+
- Maven 3+
- MySQL Server (v8.0+)

### Database Setup
1. Create a MySQL database named `technest`:
   ```sql
   CREATE DATABASE technest;
   ```
2. By default, the backend connects using `root` username and `priyansh9977` password. To override these parameters, configure the following environment variables:
   - `DB_HOST`: Host (default: `localhost`)
   - `DB_PORT`: Port (default: `3306`)
   - `DB_USERNAME`: Username (default: `root`)
   - `DB_PASSWORD`: Password (default: `priyansh9977`)

---

### Running the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Compile and run the Spring Boot server using Maven:
   ```bash
   mvn spring-boot:run
   ```
   *The backend will automatically start on port `8081` and seed the database with all premium products.*

---

### Running the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on the local development port (typically `http://localhost:5180`).*

### Building for Production
1. To compile the production bundle:
   ```bash
   npm run build
   ```
   *Vite will compile and output static files into the `dist/` directory.*

---

## 📂 Project Structure

```
e commerce/
│
├── backend/              # Spring Boot Java application
│   ├── src/              # Source code & assets
│   └── pom.xml           # Maven dependencies
│
├── frontend/             # React Vite client
│   ├── dist/             # Production build files
│   ├── public/           # Static assets & product images
│   ├── src/              # React components & pages
│   └── package.json      # Node packages
│
├── .gitignore            # Excludes node_modules, target, logs, dist
└── README.md             # Project documentation
```

---
*Created with 💜 for the ultimate premium e-commerce showcase.*
