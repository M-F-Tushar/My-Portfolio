# Professional AI/ML Portfolio

A high-performance, dynamic portfolio website built for AI/ML Engineers. This project showcases a modern, responsive design with professional animations, a comprehensive admin dashboard, and a robust tech stack.

![Portfolio Hero Section](https://github.com/M-F-Tushar/My-Portfolio/raw/main/frontend/public/og-image.png)

## 🚀 Features

-   **Dynamic Content:** All data (Profile, Projects, Experience, Skills) is managed via a database.
-   **Admin Dashboard:** Secure admin panel to update portfolio content without code changes.
-   **Professional UI/UX:**
    -   Gradient shimmer effects & glassmorphism
    -   3D tilt interactions on project cards
    -   Smooth scroll & entrance animations
    -   Responsive design for all devices
-   **Tech Stack:**
    -   **Frontend:** Next.js (React), Tailwind CSS, Framer Motion (via CSS)
    -   **Backend:** FastAPI (Python)
    -   **Database:** SQLite (Dev) / PostgreSQL (Prod) with Prisma ORM
    -   **Authentication:** JWT-based auth for admin panel

## 🛠️ Installation & Setup

### Prerequisites
-   Node.js (v18+)
-   Python (v3.9+)

### 1. Clone the Repository
```bash
git clone https://github.com/M-F-Tushar/My-Portfolio.git
cd My-Portfolio
```

### 2. Frontend Setup
```bash
cd frontend
npm install
# Create .env file
cp .env.example .env
# Run development server
npm run dev
```

### 3. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
# Run FastAPI server
uvicorn main:app --reload
```

## 📂 Project Structure

```
My-Portfolio/
├── frontend/          # Next.js application
│   ├── pages/         # Routes & Views
│   ├── components/    # Reusable UI components
│   ├── styles/        # Global styles & Tailwind config
│   └── prisma/        # Database schema & migrations
└── backend/           # FastAPI application (optional/if used)
```

## 🎨 Customization

You can customize the look and feel by editing:
-   `frontend/styles/globals.css`: Global variables for colors and animations.
-   `frontend/tailwind.config.js`: Tailwind theme configuration.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔒 Security

For security concerns, please review our [Security Policy](SECURITY.md).
