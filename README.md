# Movie Review Platform

## Overview
This project is a movie review platform which allows users to browse, review, and rate movies while providing personalized recommendations. The platform features dynamic feeds of the latest and trending films, real-time movie data, and secure user management.

## Features

- **Frontend**: Built using **React**, providing a dynamic and responsive user interface.
- **Backend**: Developed using **Node.js** with **Prisma ORM** for database management and efficient data handling.
- **Authentication**: Integrated **Auth0** for secure user authentication and role-based access control.
  - Users can register, log in, and manage their profiles securely.
  - Specific actions (e.g., posting reviews, liking, following) are restricted to authenticated users.
- **Movie Data Integration**: Integrated **OMDb API** to provide real-time data on movies, including the latest and trending films.
- **RESTful API**: Implemented with **Node.js** for efficient **CRUD operations**, allowing interaction between the frontend and backend.
- **Database**: Managed using **Prisma** with at least three tables:
  - Users
  - Reviews
  - Movies
- **Search Functionality**: Users can search for movies, view detailed pages with additional information, and write reviews.

## API Endpoints

- **/ping**: A basic endpoint to check if the service is up.
- **/movies**: Fetches a list of trending movies from the OMDb API.
- **/profile**: Requires an Auth0 token in the Authorization header and provides user profile details.

## Responsive Design

- The platform supports **desktop, tablet, and mobile views**, ensuring a seamless experience across different devices.
- All pages are fully responsive with no unintentional overlaps or scrollbars.

## External API Integration

- **OMDb API**: Used to fetch real-time movie data, including descriptions, ratings, and reviews.

## Accessibility

- Conducted **Lighthouse Accessibility Reports** to ensure the platform meets high accessibility standards.
  
## Database

- Database management is done using **Prisma ORM**, ensuring efficient and seamless interaction with the backend.

## Testing

- At least three unit tests have been implemented to verify core functionalities of the application.

## Technology Stack

- **Frontend**: React, HTML, CSS, JavaScript
- **Backend**: Node.js, Prisma ORM
- **Authentication**: Auth0
- **API**: OMDb API
- **Database**: PostgreSQL (or another database using Prisma)

## Future Improvements

- Add more social features, such as following friends and movie recommendations based on user behavior.
- Implement movie rating prediction using machine learning.
