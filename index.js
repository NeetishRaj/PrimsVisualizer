



document.addEventListener('DOMContentLoaded', function () {
  GraphObj = new Graph().generateRandomGraph();
  graph = GraphObj.adj_matrix;
  setup_cytoscape(graph);
});
