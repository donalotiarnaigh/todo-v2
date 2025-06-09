# To-Do List

A simple Node.js application that manages tasks using Express, EJS templates and MongoDB via Mongoose. Each custom route represents its own list so you can organise tasks into separate categories. Items can be created and removed from any list.

## Features

- Create tasks and mark them as complete by deleting
- Dynamic routes for custom to-do lists
- EJS powered views with Tailwind styling

## Getting Started

1. Install Node.js and npm
2. Install dependencies

```bash
npm install
```

3. Configure the MongoDB connection by editing the connection string in `app.js` inside `mongoose.connect()` so it points at your MongoDB instance.
4. Start the server

```bash
node app.js
```

Your to-do list will be available on [http://localhost:3000](http://localhost:3000).

## Testing

This project contains no automated tests. Running `npm test` will print an error until tests are added.
