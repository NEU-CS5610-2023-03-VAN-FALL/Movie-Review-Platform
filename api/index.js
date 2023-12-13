const dotenv = require('dotenv');
dotenv.config();

const express = require("express");
const { PrismaClient } = require("@prisma/client");
const morgan = require("morgan");
const cors = require("cors");
const { auth } = require('express-oauth2-jwt-bearer');

// this is a middleware that will validate the access token sent by the client
const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: 'RS256'
});

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));


const prisma = new PrismaClient();

// this is a public endpoint because it doesn't have the requireAuth middleware
app.get("/ping", (req, res) => {
  res.send("pong");
});

app.get("/reviews", async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        movie: true,
      },
    });

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/reviews", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  const { content, movieTitle } = req.body;

  // Data validation
  if (!content || typeof content !== 'string' || !movieTitle || typeof movieTitle !== 'string') {
    return res.status(400).json({ error: "Invalid content or movieTitle format" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        auth0Id,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let movie = await prisma.movie.findUnique({
      where: {
        title: movieTitle,
      },
    });

    if (!movie) {
      movie = await prisma.movie.create({
        data: {
          title: movieTitle,
        },
      });
    }

    const newReview = await prisma.review.create({
      data: {
        content,
        user: { connect: { id: user.id } },
        movie: { connect: { id: movie.id } },
      },
    });

    return res.status(201).json(newReview);
  } catch (error) {
    console.error("Error creating review:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});



app.get('/user-reviews',requireAuth,  async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  try {
    const userReviews = await prisma.review.findMany({
      where: {
        user: {
          auth0Id: auth0Id,
        },
      },
      include: {
        user: true,
        movie: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
    });

    res.json(userReviews);
  } catch (error) {
    console.error("Error fetching user's reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/review/:id", requireAuth, async (req, res) => {
  const id = req.params.id;
  const review = await prisma.review.findUnique({
    where: {
      id: parseInt(id)
    },
  });
  res.json(review);
});


app.put("/review/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  const { content } = req.body;

  // Data validation
  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: "Invalid content format" });
  }

  try {
    const existingReview = await prisma.review.findUnique({
      where: {
        id,
      },
    });

    if (!existingReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Ensure that only the 'content' field is updated
    const updatedItem = await prisma.review.update({
      where: {
        id,
      },
      data: {
        content,
      },
    });

    res.json(updatedItem);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// deletes a todo item by id
app.delete("/review/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  const deletedItem = await prisma.review.delete({
    where: {
      id,
    },
  });
  res.json(deletedItem);
});


// Fetch movies and reviews for the authenticated user
app.get("/my-movies", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  try {
    const user = await prisma.user.findUnique({
      where: {
        auth0Id,
      },
    });

    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    const userMoviesWithReviews = await prisma.movie.findMany({
      where: {
        reviews: {
          some: {
            userId: user.id,
          },
        },
      },
      include: {
        reviews: {
          where: {
            userId: user.id,
          },
        },
      },
    });

    res.json(userMoviesWithReviews);
  } catch (error) {
    console.error("Error fetching user's movies:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.post("/verify-user", requireAuth, async (req, res) => {
  console.log("req.auth.payload",req.auth.payload);
  const auth0Id = req.auth.payload.sub;
  const email = req.auth.payload['https://api.todos/email'];
  const username = req.auth.payload['https://api.todos/name'];

  if (typeof username !== 'string') {
    return res.status(400).json({ error: 'Invalid username format' });
  }
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  if (user) {
    res.json(user);
  } else {
    const newUser = await prisma.user.create({
      data: {
        email,
        auth0Id,
        username,
      },
    });

    res.json(newUser);
  }
});

// Fetch movies unauthenticated user
app.get('/movies', async (req, res) => {
  try {
    const movies = await prisma.movie.findMany();
    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/movie-reviews/:movieId', async (req, res) => {
  const { movieId } = req.params;

  try {
    const movieWithReviews = await prisma.movie.findUnique({
      where: { id: parseInt(movieId) }, 
      include: { reviews: true }, 
    });

    res.json(movieWithReviews);
  } catch (error) {
    console.error(`Error fetching reviews for movie ${movieId}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
 console.log(`Server running on http://localhost:${PORT} 🎉 🚀`);
})
