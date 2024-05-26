Понял, давайте обновим инструкцию `README.md`, чтобы отразить правильную структуру и пути.

### Обновленный README.md

**README.md**

```markdown
# Secure Admin Guard (SAG)

Secure Admin Guard (SAG) is a project focused on secure user and admin management with email verification. This guide will help you set up the project and its dependencies.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.x or higher)
- npm (v6.x or higher)
- MongoDB (v4.x or higher)
- Git

## Installation

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/yourusername/secure-admin-guard.git
cd secure-admin-guard
```

### 2. Install Node.js and npm

If you haven't installed Node.js and npm, you can download and install them from the official [Node.js website](https://nodejs.org/).

### 3. Install MongoDB

Install MongoDB globally on your system. Follow the instructions for your operating system:

#### On macOS

Using Homebrew:

```bash
brew tap mongodb/brew
brew install mongodb-community@6.0
brew services start mongodb/brew/mongodb-community
```

#### On Ubuntu

```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 4. Install Project Dependencies

Navigate to the project directory and install the required npm packages:

```bash
npm install
```

### 5. Set Up Environment Variables

Create a `.env` file in the root directory of the project and add the following environment variables:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/yourdatabase
SECRET_KEY=your_secret_key
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

Replace `yourdatabase`, `your_secret_key`, `your_email@example.com`, and `your_email_password` with your actual MongoDB database name, secret key for JWT, and email credentials.

### 6. Create the Super Admin

Run the script to create a super admin user:

```bash
node createSuperAdmin.js
```

### 7. Run the Project

Start the project using npm:

```bash
npm run dev
```

This will start the server using `nodemon` for automatic restarts on code changes.

### Project Structure

The project structure is as follows:

```
secure-admin-guard/
│
├── contents/
│   ├── css/
│   ├── js/
│   │   ├── password-toggle.js
│   ├── images/
│
├── views/
│   ├── sag-register.ejs
│   ├── sag-login.ejs
│   ├── register.ejs
│   ├── login.ejs
│   ├── index.ejs
│
├── controllers/
│   ├── authController.js
│
├── middlewares/
│   ├── authMiddleware.js
│
├── routes/
│   ├── pageRoutes.js
│   ├── apiRoutes.js
│
├── models/
│   ├── userModel.js
│
├── config/
│   ├── logger.js
│   ├── config.js
│   ├── email.js
│
├── createSuperAdmin.js
├── app.js
├── package.json
├── nodemon.json
├── .gitignore
└── package-lock.json (if present)
```

### Usage

- Access the admin registration page at `http://localhost:3000/sag/register`
- Access the admin login page at `http://localhost:3000/sag/login`
- Access the user registration page at `http://localhost:3000/register`
- Access the user login page at `http://localhost:3000/login`

### Contributing

To contribute, please fork the repository and create a pull request. For major changes, please open an issue first to discuss what you would like to change.

### License

This project is licensed under the MIT License.

### Contact

If you have any questions or need further assistance, please contact [acvid3@gmail.com].
```

