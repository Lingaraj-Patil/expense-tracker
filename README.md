# Expense Tracker

The Expense Tracker is a web application designed to help users manage their expenses efficiently. The idea for this project was inspired by a suggestion from ChatGPT when I requested project ideas based on Express.js and MongoDB.

## Description

This application allows users to track their expenses by recording them in a database based on the date and category of each expense. Users can easily add new expenses and retrieve summaries of their spending over a specified date range. 

### Key Features

- **User Authentication**: Secure sign-up and login functionality.
- **Expense Recording**: Users can add expenses, specifying the amount, category, date, and description.
- **Expense Summary**: A feature to retrieve total expenses from a specified start date to an end date, enabling users to analyze their spending patterns.


The application leverages **Express.js** for building the server and **MongoDB** for storing expense records, ensuring a smooth and efficient user experience.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Lingaraj-Patil/expense-tracker.git

2. Navigate to the project directory:
    ```bash
    cd expense-tracker

3. Install the dependencies:
    ```bash
    npm install

4. Start the server:
    ```bash
    npm start