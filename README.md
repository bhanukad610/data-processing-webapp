# Data Viewer Application

A web application that allows users to upload CSV or Excel files, processes and infers data types for each column, and displays the processed data. The frontend provides options to search, filter, and view large datasets interactively.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Notes and Comments](#notes-and-comments)


## Features

- **Data Type Inference**: Automatically infers data types for each column of an uploaded dataset.
- **Search and Filter**: Allows users to search within the data.


## Technologies Used

- **Backend**: Python, Django, Pandas
- **Frontend**: React, JavaScript, HTML, CSS
- **Database**: SQLite (Django built-in)
- **Testing**: Pytest (Backend), React Testing Library and Jest (Frontend)


## Prerequisites

1. **Python 3.11.10** (or higher) - Install using [pyenv](https://github.com/pyenv/pyenv).
2. **Node.js and npm** - For the frontend development environment.


## Installation and Setup

### Backend

1. **Clone the repository**:
   ```bash
   git clone https://github.com/bhanukad610/data-processing-webapp.git
   cd data-processing-webapp/api

2. **Set up the virtual environment**:
   ```bash
   python -m venv env
   source env/bin/activate

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt

4. **Run migrations**:
   ```bash
   python manage.py runserver

### Frontend

1. **Navigate to the frontend directory**:
    Open a new terminal
   ```bash
   cd data-processing-webapp/web

2. **Install dependencies**:
   ```bash
   npm install

3. **Start the frontend server**:
   ```bash
   npm start

## Running the Application
Ensure both backend and frontend servers are running:

Backend: http://localhost:8000
Frontend: http://localhost:3000

Access the application at http://localhost:3000.

### Testing
**Run backend tests using Pytest**
```bash
cd data-processing-webapp/api
source env/bin/activate
pytest