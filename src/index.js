import "../public/font/Roboto-Regular.ttf";
import "./styles/global.css";

import "./config.js";
import Graph from "./graph.js";
import { setup_cytoscape } from "./setup-graph.js";

document.addEventListener("DOMContentLoaded", function () {
  GraphObj = new Graph().generateRandomGraph();
  // GraphObj = new Graph().set_custom_graph([
  //   [Infinity, 1,        0,         5],
  //   [1,        Infinity, Infinity,  8],
  //   [0,        Infinity, Infinity,  -7],
  //   [5,        8,        -7,         Infinity],
  // ]);

  graph = GraphObj.adj_matrix;
  setup_cytoscape(graph);
});
