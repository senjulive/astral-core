
Getting started
To create data, you use a `mutation` operation.

The easiest way to get started is to use the GraphQL tab in your Firebase console.

The Data Connect schema, which you can find in schema.gql, contains the following fields for creating data:

* movie_insert: Create a new movie.
* movie_upsert: Create a new movie. If a movie with the same primary key exists, it updates the existing movie.

## Create a movie based on user input
This mutation creates a movie with the specified title, release year, genre, and rating.

## Create a movie with default values
This mutation creates a movie with default values for the title, release year, genre, and rating.

## Movie upsert using a combination of variables and literals
This mutation creates a new movie with the specified title and default values for the release year, genre, and rating. If a movie with the same title already exists, it updates the existing movie with the new values.
