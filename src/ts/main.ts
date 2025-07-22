// main.ts
import Game from "./Game";
import MovieList from "./MovieList";
import { Movie } from "./interface";
import movieDataJSON from "./movieData.json";
import Tasks from "./TOPTasks";

const movieData: Array<Movie> = movieDataJSON;

declare global {
  interface Window {
    game: Game;
    movieList: MovieList;
  }
}

const game = new Game(4);
game.start();
window.game = game;

const movieList = new MovieList(movieData);
movieList.renderTable();
window.movieList = movieList;

// TOP Tasks* (задача со звёздочкой)

const tasks = new Tasks();
tasks.render();
