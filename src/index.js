import "../public/font/Roboto-Regular.ttf";
import "./styles/global.css";

import "./config.js";
import Graph from "./graph.js";
import { setup_cytoscape } from "./setup-graph.js";

document.addEventListener("DOMContentLoaded", function () {
  GraphObj = new Graph().generateRandomGraph();
  // GraphObj = new Graph().set_custom_graph([
  //   [BIG_NUMBER, 1,        0,         5],
  //   [1,        BIG_NUMBER, BIG_NUMBER,  8],
  //   [0,        BIG_NUMBER, BIG_NUMBER,  -7],
  //   [5,        8,        -7,         BIG_NUMBER],
  // ]);

  // console.log(GraphObj.adj_matrix);
  graph = GraphObj.adj_matrix;
  setup_cytoscape(graph);
});
