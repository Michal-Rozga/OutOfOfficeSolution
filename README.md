# Out Of Office Solution

## Description

OutOfOfficesolution is a project that manages out-of-office requests and approvals.

## Technologies Used

- **Frontend**: React, TypeScript, Axios, SCSS Modules
- **Backend**: Node.js, Express.js, SQLite (with Sequelize ORM)
- **Database**: SQLite

## Installation

Ensure you have the following installed:

- **Node.js**: [Download](https://nodejs.org/)
- **SQLite**: [Download](https://www.sqlite.org/download.html)

### Backend

1. Navigate to the backend folder.
2. Install the necessary dependencies:

```bash
cd backend
npm install
```

### Frontend

1. Navigate to the frontend folder.
2. Install the necessary dependencies:

```bash
cd frontend
npm install
```

## Usage

### Backend

To run the backend server: 

```bash
cd backend
npm start
```

### Frontend

To start the frontend application:

```bash
cd out-of-office
npm start
```

### Database

To use queries on the database:

```bash
cd backend
sqlite3 database.sqlite
```
This will open the connection to the database, and you can perform queries on it.

#### To show tables:
```bash
.tables
```

#### To show the metadata about columns of specified table, use the following:
```bash
PRAGMA table_info(table_name);
```

 
### Notes
#### Users
There are default users defined. Each of the users has a different role: 
johndoe - Employee
janesmith - HR Managger
emilyjohnson - Project Manager
michaelbrown - Administrator

You can use password: password123
for testing purposes.



