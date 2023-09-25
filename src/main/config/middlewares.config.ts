import cors from "cors";
import express from "express";

const middlewares = [
  express.json(), 
  express.urlencoded({ extended: true }), 
  cors(),
];

export { middlewares };

