// interface.ts

export interface Movie {
  id: number;
  title: string;
  imdb: number;
  year: number;
}

export interface ITask {
  id: number;
  title: string;
  pinned: boolean;
}
