require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Movie = require('./models/Movie');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Create test user
  const email = 'testuser@example.com';
  const existing = await User.findOne({ email });
  if (!existing) {
    const passwordHash = await bcrypt.hash('Test@1234', 10);
    await User.create({ name: 'Test User', email, passwordHash });
    console.log('Test user created: testuser@example.com / Test@1234');
  } else {
    console.log('Test user already exists');
  }

  // Create 50 sample movies
  const baseTitles = [
    'The Great Adventure',
    'Skyline Chase',
    'Midnight Escape',
    'Ocean Whisper',
    'Neon Shadows',
    'Lost Horizon',
    'Crimson Tide',
    'Frozen Legacy',
    'Parallel Dreams',
    'Silent Echo',
    'Electric Heart',
    'The Forgotten City',
    'Dark Horizon',
    'The Final Orbit',
    'Cyber Dawn',
    'Emerald Flame',
    'Echoes of Tomorrow',
    'Lunar Descent',
    'Titan’s Edge',
    'Aurora Rising',
    'Ghost Protocol',
    'Infinite Loop',
    'The Timekeeper',
    'Shadowed Path',
    'Golden Mirage',
    'Blue Inferno',
    'Storm Chasers',
    'Eternal Code',
    'Valley of Mist',
    'Oblivion Run',
    'Quantum Rift',
    'Desert Mirage',
    'Phoenix Protocol',
    'Vortex Trail',
    'Zero Point',
    'Dark Signal',
    'Solar Drift',
    'Memory Leak',
    'Firestorm X',
    'Nightfall Protocol',
    'Echo Protocol',
    'Terminal Phase',
    'Omega Horizon',
    'Sapphire Veil',
    'Hypernova',
    'Neural Surge',
    'Broken Reality',
    'Artificial Pulse',
    'Infinity Line',
    'Crimson Algorithm',
  ];

  const genres = ['Action', 'Adventure', 'Drama', 'Sci-Fi', 'Thriller', 'Mystery', 'Comedy', 'Fantasy'];

  for (let i = 0; i < baseTitles.length; i++) {
    const title = baseTitles[i];
    const exists = await Movie.findOne({ title });
    if (!exists) {
      const movie = await Movie.create({
        title,
        description: `${title} — a thrilling cinematic experience.`,
        genre: genres[Math.floor(Math.random() * genres.length)],
        showtimes: [
          {
            time: new Date(Date.now() + (24 + i) * 60 * 60 * 1000), // vary time
            seats: [
              'A1', 'A2', 'A3', 'A4', 'A5', 'B1', 'B2', 'B3', 'B4', 'B5',
              'C1', 'C2', 'C3', 'C4', 'C5'
            ],
            bookedSeats: [],
          },
          {
            time: new Date(Date.now() + (26 + i) * 60 * 60 * 1000),
            seats: [
              'A1', 'A2', 'A3', 'A4', 'A5', 'B1', 'B2', 'B3', 'B4', 'B5',
              'C1', 'C2', 'C3', 'C4', 'C5'
            ],
            bookedSeats: [],
          },
        ],
      });
      console.log(`Created movie: ${movie.title}`);
    } else {
      console.log(`Movie already exists: ${title}`);
    }
  }

  console.log('All movies seeded successfully!');
  mongoose.disconnect();
};

run().catch((err) => {
  console.error('Error:', err);
  mongoose.disconnect();
});
