class Steps {
  constructor() {
    this.steps = [];
  }

  add(message) {
    this.steps.push(message);
    console.log(`${this.steps.length}. ${message}`);
  }

  print() {
    console.log();
  }
}

function prim(adjMatrix) {
  const n = adjMatrix.length; // number of vertices
  const visited = new Array(n).fill(false); // keep track of visited vertices
  const distances = new Array(n).fill(Infinity); // keep track of minimum distance to each vertex
  const parent = new Array(n).fill(null); // keep track of parent of each vertex in the MST

  const steps = new Steps();

  // start with vertex 0
  distances[0] = 0;
  steps.add(`Added vertex 0 as starting point`);


  for (let i = 0; i < n - 1; i++) {
    // console.log(`ROUND: ${i}   ###############`);

    // find the vertex with the minimum distance among the unvisited vertices
    let minDist = Infinity;
    let u;
    for (let j = 0; j < n; j++) {
      steps.add(`Is vertex '${j}' visited ? ${visited[j]}, ${visited[j] ? 'then skip': 'then continue'}`)
      if(!visited[j])
        steps.add(`Vertex ${j} distance (${distances[j]}) < vertex ${u} distance (${minDist}) ? ${distances[j] < minDist}, ${distances[j] < minDist ? 'then continue': 'then skip'}`);
 
      if (!visited[j] && distances[j] < minDist) {
        minDist = distances[j];
        u = j;
      }
    }
    
    // mark the vertex as visited
    visited[u] = true;
    
    // update the distances to the neighbors of the vertex
    for (let v = 0; v < n; v++) {
      if (adjMatrix[u][v] && !visited[v] && adjMatrix[u][v] < distances[v]) {
        distances[v] = adjMatrix[u][v];
        parent[v] = u;
        // console.log(`updated neighbor: u: ${u}, v: ${v}`);
      }
    }

    const neighbors = distances.reduce((a, x, index) => x && x !== Infinity ? `${a},  (${index}, ${x})` : a , '')
    steps.add(`\n*****>vertex ${u} is now visited with min distance : ${minDist}, among neighbors: ${neighbors}\n`)

    console.log(`Visisted: ${visited}`)
    // console.log(`Distance: ${distances}`)
    console.log(`Parent: ${parent}\n`)
  }

  // build the MST using the parent array
  const mst = [];
  for (let i = 1; i < n; i++) {
    mst.push([parent[i], i, adjMatrix[parent[i]][i]]);
  }

  return mst;
}
// const adjMatrix = [  
//   [0, 2, 0, 6, 0],
//   [2, 0, 3, 8, 5],
//   [0, 3, 0, 0, 7],
//   [6, 8, 0, 0, 9],
//   [0, 5, 7, 9, 0],
// ];

const adjMatrix = [  
  [0, 0, 13, 2],
  [0, 0, 8, 6],
  [13, 8, 0, 1],
  [2, 6, 1, 0],
];

const mst = prim(adjMatrix);
console.log(mst); // Output: [ [ 0, 1, 2 ], [ 1, 2, 3 ], [ 0, 3, 6 ], [ 1, 4, 5 ] ]
