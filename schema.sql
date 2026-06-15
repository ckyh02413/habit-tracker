  CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    name          TEXT NOT NULL,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE habits (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    target_per_week INTEGER NOT NULL CHECK (target_per_week BETWEEN 1 AND 7),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    UNIQUE(user_id, name)
  );

  CREATE INDEX habits_user_id_idx ON habits(user_id);

  CREATE TABLE checkins (
    id         SERIAL PRIMARY KEY,
    habit_id   INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
    date       DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (habit_id, date)
  );

  CREATE INDEX checkins_habit_id_date_idx ON checkins(habit_id, date DESC);
