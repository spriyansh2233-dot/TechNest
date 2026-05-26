# TechNest — Premium Futuristic E-Commerce Platform

TechNest is a state-of-the-art e-commerce storefront designed for modern tech enthusiasts. It features a cinematic dark mode, neon accents, interactive sliding headers, dynamic technical spec layouts, and a secure shopping experience powered by a Spring Boot backend and React/Vite frontend.

---

## 🌟 Key Features

### 1. Futuristic Dark Aesthetic
- Custom animated background mesh gradient transitioning through deep violet, indigo, and dark cyber tones.
- GPU-accelerated slow-moving ambient light orbs and low-opacity cyber grid texture overlays.
- Dynamic glowing borders and glassmorphism elements with spring animations.

### 2. Smart Navigation & Scrolling
- Shrinking sticky header that moves slightly upwards (`-translate-y-3`) on scroll-down to save screen space, and immediately reveals itself on scroll-up.
- Smooth ease-in-out scroll to top transitions when navigating the store catalog.

### 3. Curated Premium Product Catalog
- **11 Newly Integrated Products** with high-quality PNG renders, detailed technical specifications, dynamic grounding shadow animations, and custom ratings/reviews based on stable IDs.
- Staggered card entry animations (50ms offset) for a premium, non-distracting loading experience.

### 4. Full-Featured Shopping Experience
- **Authentication**: Fully functional secure SignUp, Login, and Session Recovery (auto-redirect to login when JWT token expires).
- **Cart & Wishlist**: Real-time state management with cart item quantity adjustments, out-of-stock validation, local guest persistence (using `localStorage`), and backend synchronization on login.
- **Smart Category Filtering**: Intuitive filtering pills mapped correctly to database categories (Audio Gear, Smart Wearables, Gaming, Smart Devices, Accessories).
- **Orders Dashboard**: Interactive order history tracking, order cancellations, and simulated secure checkouts.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Lucide Icons, Axios
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
   *The backend will automatically start on port `8081` and seed the database with all 11 premium products.*

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
   *The frontend will run on the local development port (typically `http://localhost:5173` or `5176`).*

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
*Created with 💜 for the ultimate futuristic e-commerce showcase.*
