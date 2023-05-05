import '../public/font/Roboto-Regular.ttf';
import './styles/global.css';

import "./config.js"
import Graph from "./graph.js"
import { setup_cytoscape } from "./setup-graph.js"

document.addEventListener('DOMContentLoaded', function () {
  GraphObj = new Graph().generateRandomGraph();
  graph = GraphObj.adj_matrix;
  setup_cytoscape(graph);
});
