# Full-Stack E-Commerce Application

This is a full-stack e-commerce web application built using React on the client side and Node.js on the server side. The project simulates a real-world online store with user purchases, admin management, and automated order handling.

## Features

- Browse products and place orders through a complete shopping flow
- Secure checkout using Stripe payments
- Admin dashboard for managing products and users (create, update, delete)
- Automatic order status updates (processing, shipped, delivered) using scheduled cron jobs
- RESTful APIs for products, users, carts, and orders

## Tech Stack

**Frontend**
- React

**Backend**
- Node.js
- Express

**Other Tools**
- Stripe (payments)
- Node Cron (background jobs)

## Deployment

The application is deployed on Vercel:

https://my-ecommerce-project-psi.vercel.app
> Note: The server may take a minute to respond on first load due to cold start behavior.

## Project Purpose

This project was built to practice full-stack development concepts, including API design, payment integration, admin workflows, and background job processing.

## Notes

Order status updates are automated to reflect how real e-commerce platforms handle shipping and delivery updates without manual intervention.
