CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) UNIQUE,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE     
        CHECK (position('@' IN email) > 1),
    is_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE exercises (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    target TEXT NOT NULL,
    secondary TEXT[],
    gif TEXT,
    instructions TEXT[]
);

CREATE TABLE user_favorites (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    exercise_id INT REFERENCES exercises(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, exercise_id)
);
