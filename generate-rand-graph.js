const LOWER_VERTEX_COUNT = 3;
const UPPER_VERTEX_COUNT = 8;
const UPPER_EDGE_WEIGHT = 15;

function generateRandomGraph() {
  let vertexCount =
    LOWER_VERTEX_COUNT +
    Math.floor(Math.random() * (UPPER_VERTEX_COUNT - LOWER_VERTEX_COUNT));

  //re-initialize
  let graph = [];
  for (let i = 0; i < vertexCount; i++) {
    graph[i] = [];
  }

  for (let i = 0; i < vertexCount; i++) {
    // graph[i].fill(0,0,vertexCount);
    for (let j = 0; j < vertexCount; j++) {
      graph[i][j] = -1;
    }
  }

  for (let i = 0; i < vertexCount; i++) {
    for (let j = 0; j < Math.ceil(vertexCount / 3); j++) {
      const rand_weight = Math.ceil(Math.random() * UPPER_EDGE_WEIGHT);
      const rand_pos = Math.floor(Math.random() * vertexCount);
      
      if(i === rand_pos) continue;

      graph[i][rand_pos] = rand_weight;
      graph[rand_pos][i] = rand_weight;
    }
  }

  console.log(graph);
  return graph;
}
