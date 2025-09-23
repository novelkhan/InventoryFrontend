# E-Commerce Inventory Management Frontend

![E-Commerce Inventory Banner](https://static.vecteezy.com/system/resources/thumbnails/012/494/550/small_2x/inventory-control-system-concept-professional-manager-and-worker-are-checking-goods-and-stock-supply-inventory-management-with-goods-demand-vector.jpg)

[![GitHub Repo stars](https://img.shields.io/github/stars/novelkhan/InventoryFrontend?style=social)](https://github.com/novelkhan/InventoryFrontend)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/novelkhan/InventoryFrontend/actions)
[![Deployed on Netlify](https://img.shields.io/badge/deployed_on-Netlify-00C7B7)](https://inventory3.netlify.app)

A modern, responsive, and feature-rich frontend for the **E-Commerce Inventory Management System**, built with **Angular 16**. This frontend provides a seamless user experience for managing products and categories, with secure authentication, dynamic filtering, and a clean, mobile-friendly interface.

## Quick Links

| 🔗 **Information**           | 📍 **Details**                                                         |
|------------------------------|-------------------------------------------------------------------------|
| 🌐 **Live Demo**             | [View Live Application](https://inventory3.netlify.app)                 |
| 📂 **Frontend Repository**   | [GitHub Repo](https://github.com/novelkhan/InventoryFrontend.git)       |
| 📚 **Backend Repository**    | [GitHub Repo](https://github.com/novelkhan/InventoryWebAPI.git)         |
| 🛠️ **Issues & Contributions** | [Report Issues](https://github.com/novelkhan/InventoryFrontend/issues)  |

> **Note**: This frontend connects to a .NET Core Web API backend, with Swagger documentation available in the development environment (`http://localhost:7011/swagger/index.html`). Swagger is disabled in production for security reasons.

## Project Overview

The **E-Commerce Inventory Management Frontend** is a full-featured Angular 16 application designed to manage e-commerce inventory with a focus on usability, performance, and maintainability. It leverages Angular's modern features like standalone components, reactive forms, and lazy loading to deliver a responsive and scalable UI. The frontend integrates seamlessly with a .NET Core Web API backend, providing secure authentication, product management, and category management functionalities.

### Key Highlights
- **Responsive Design**: Built with SCSS and Bootstrap 5, ensuring compatibility across mobile and desktop devices.
- **Secure Authentication**: Uses JWT-based authentication with an HTTP interceptor to manage tokens and handle session expiration.
- **Inventory Management**: Supports CRUD operations for products and categories, with features like filtering, pagination, and search by name/description.
- **Modern Angular Features**: Utilizes standalone components, reactive forms, RxJS for state management, and lazy loading for optimized performance.
- **Image Handling**: Supports product image uploads displayed as Base64-encoded images.
- **Code Quality**: Follows Angular best practices, modular architecture, and clean code principles.
- **Deployment**: Automated CI/CD pipeline using GitHub Actions for deployment to Netlify.

The application is deployed on **Netlify** for live access, with a focus on delivering a smooth and intuitive user experience.

## Screenshots

| **Login Page** | **Product List** | **Category Management** |
|----------------|------------------|------------------------|
| ![Login](https://via.placeholder.com/300x200?text=Login+Page) | ![Product List](https://via.placeholder.com/300x200?text=Product+List) | ![Category](https://via.placeholder.com/300x200?text=Category+Management) |

> **Note**: Replace the placeholder images above with actual screenshots of your application for a more professional look.

## Features

### User Authentication
- **Register**: Create a new user account (`/auth/register`).
- **Login**: Authenticate users and store JWT tokens in local storage (`/auth/login`).
- **Session Management**: Automatically logs out users after 10 seconds of inactivity with a countdown modal.
- **HTTP Interceptor**: Attaches JWT tokens to all API requests and handles unauthorized responses (e.g., 403).

### Product Management
- **Create Product**: Add new products with name, description, price, stock, category, and optional image.
- **List Products**: Display a paginated list with filters for category, price range, and search by name/description.
- **View Product**: Show detailed product information, including category and image.
- **Update Product**: Edit existing product details.
- **Delete Product**: Remove products with confirmation.
- **Search Products**: Real-time search by name or description with pagination support.

### Category Management
- **Create Category**: Add new categories with name and description.
- **List Categories**: Display all categories with product counts.
- **View Category**: Show category details.
- **Update Category**: Edit category information.
- **Delete Category**: Remove categories (blocked if linked products exist).

### Additional Features
- **Responsive UI**: Mobile-first design with SCSS and Bootstrap 5.
- **Dynamic Filtering**: Filter products by category, min/max price, and search query.
- **Notifications**: Custom notification component for success/error messages.
- **Lazy Loading**: Optimizes performance by loading modules only when needed.
- **Route Guards**: Protects routes (e.g., `/inventory/*`) for authenticated users only.

## Testing Credentials

To quickly test the application, use the following credentials:

| Field       | Value                     |
|-------------|---------------------------|
| **Email**   | `novel4004@gmail.com`     |
| **Password**| `123456`                  |

> **Warning**: These credentials are provided solely for testing in the live demo environment. Do not use them in a production environment, and avoid sharing sensitive credentials in a real-world application.

## Tech Stack

- **Framework**: Angular 16 (standalone components, reactive forms, modern Angular features)
- **Styling**: SCSS with Bootstrap 5 for responsive design
- **State Management**: RxJS for asynchronous operations and observables
- **Routing**: Lazy loading with route guards for secure navigation
- **HTTP Interceptor**: Manages JWT tokens and API error handling
- **Modals & Notifications**: Custom Angular components for user feedback
- **Build Tools**: Angular CLI (v16+)
- **Version Control**: Git with GitHub
- **Deployment**: Automated CI/CD pipeline with GitHub Actions to Netlify

### Backend Integration
- Connects to a .NET Core Web API backend.
- **Database**:
  - **Development**: Local MSSQL
  - **Production**: PostgreSQL (hosted on Render's free tier)
- Uses HTTP requests to interact with backend endpoints for CRUD operations and authentication.

## Project Structure

```plaintext
src/
├── app/
│   ├── modules/
│   │   ├── auth/              # Authentication module (login, register)
│   │   ├── inventory/         # Inventory module (products, categories)
│   │   └── shared/            # Shared components, services, models
│   ├── core/
│   │   ├── guards/            # Route guards for authentication
│   │   ├── interceptors/      # HTTP interceptor for JWT
│   │   └── services/         # Core services (e.g., auth, shared)
│   ├── environments/          # Environment configs (dev, prod)
│   └── assets/                # Static assets (images, styles)
├── styles.scss                # Global SCSS styles
└── main.ts                    # Application bootstrap
