const LOWER_VERTEX_COUNT = 3;
const UPPER_VERTEX_COUNT = 8;
const UPPER_EDGE_WEIGHT = 15;

class Graph {
  constructor() {
    this.nodes_count = 0;
    this.node_labels = [];
    this.edges = [];
    this.adj_matrix = [];
    this.startVertex = 0;
  }

  generateRandomGraph() {
    let vertexCount =
      LOWER_VERTEX_COUNT +
      Math.floor(Math.random() * (UPPER_VERTEX_COUNT - LOWER_VERTEX_COUNT));
    this.nodes_count = vertexCount;

    //re-initialize
    this.adj_matrix = [];
    for (let i = 0; i < vertexCount; i++) {
      this.adj_matrix[i] = [];
    }
  
    for (let i = 0; i < vertexCount; i++) {
      for (let j = 0; j < vertexCount; j++) {
        this.adj_matrix[i][j] = 0;
      }
    }
  
    for (let i = 0; i < vertexCount; i++) {
      for (let j = 0; j < Math.ceil(vertexCount / 3); j++) {
        const rand_weight = Math.ceil(Math.random() * UPPER_EDGE_WEIGHT);
        const rand_pos = Math.floor(Math.random() * vertexCount);
        
        if(i === rand_pos) continue;
  
        this.adj_matrix[i][rand_pos] = rand_weight;
        this.adj_matrix[rand_pos][i] = rand_weight;
      }
    }

    for (let i = 1; i <= this.nodes_count; i++) {
      this.node_labels.push(i);      
    }
  
    console.log(this.adj_matrix);
    return this;
  }

  get_top_label() {
    if(this.nodes_count > 0)
      return this.node_labels[this.nodes_count - 1];
    else 
      return 1;
  }

  add_vertex() {
    if(this.node_labels.length > 0) {
      const last_label = this.node_labels[this.node_labels.length - 1];
      this.node_labels.push(last_label + 1);
    } else {
      this.node_labels.push(1);
    }

    for (let i = 0; i < this.nodes_count; i++) {
      this.adj_matrix[i].push(0);
    }
    this.adj_matrix.push(new Array(this.nodes_count + 1).fill(0));
    console.log(this);
    this.update_graph();
    return this;
  }
  
  remove_vertex(vertex_label) {
    let vertex = this.node_labels.indexOf(parseInt(vertex_label));

    if(vertex < 0 || vertex >= this.nodes_count) {
      console.log(`Cannot remove vertex ${vertex_label}`);
      return this;
    }

    // remove the column
    for (let i = 0; i < this.nodes_count; i++) {
      this.adj_matrix[i].splice(vertex, 1);
    }

    // remove the row
    this.adj_matrix.splice(vertex, 1);

    // remove the node label
    this.node_labels.splice(vertex, 1);

    this.update_graph();

    console.log(this);
  }

  is_edge_there(source, dest) {
    const src_index = this.node_labels.indexOf(parseInt(source));
    const dest_index = this.node_labels.indexOf(parseInt(dest));
    
    if(this.adj_matrix[src_index][dest_index] && this.adj_matrix[dest_index][src_index]){
      return true;
    }

    return false;
  }

  add_edge(source, dest, new_weight) {
    const src_index = this.node_labels.indexOf(parseInt(source));
    const dest_index = this.node_labels.indexOf(parseInt(dest));
    new_weight = parseInt(new_weight);

    console.log(`Adding edge src: ${src_index}, dest: ${dest_index}, new_weight: ${new_weight}`);
    this.adj_matrix[src_index][dest_index] = new_weight;
    this.adj_matrix[dest_index][src_index] = new_weight;

    this.update_graph();

    return this;
  }

  update_edge(source, dest, new_weight) {
    const src_index = this.node_labels.indexOf(parseInt(source));
    const dest_index = this.node_labels.indexOf(parseInt(dest));
    new_weight = parseInt(new_weight);

    console.log(`src: ${src_index}, dest: ${dest_index}, new_weight: ${new_weight}`);
    this.adj_matrix[src_index][dest_index] = new_weight;
    this.adj_matrix[dest_index][src_index] = new_weight;

    this.update_graph();

    return this;
  }

  delete_edge(source, dest) {
    const src_index = this.node_labels.indexOf(parseInt(source));
    const dest_index = this.node_labels.indexOf(parseInt(dest));

    console.log(`Deleting edge: src: ${src_index}, dest: ${dest_index}`);
    
    this.adj_matrix[src_index][dest_index] = 0;
    this.adj_matrix[dest_index][src_index] = 0;

    this.update_graph();

    return this;
  }

  update_graph() {
    this.nodes_count = this.adj_matrix.length;
  }

  get_labeled_graph() {
    let top_row = ['', ...this.node_labels];
    let result = [top_row];
  
    // let result = [headers];
    this.node_labels.forEach((item, index) => {
      result.push([item, ...this.adj_matrix[index]]);
    });
  
    return result;
  }

  solve_prim(adjMatrix) {
    const n = adjMatrix.length; // number of vertices
    const visited = new Array(n).fill(false); // keep track of visited vertices
    const distances = new Array(n).fill(Infinity); // keep track of minimum distance to each vertex
    const parent = new Array(n).fill(null); // keep track of parent of each vertex in the MST
  
    // start with vertex 0
    distances[0] = 0;
    
    for (let i = 0; i < n - 1; i++) {
      console.log(`ROUND: ${i}   ###############`);
  
      // find the vertex with the minimum distance among the unvisited vertices
      let minDist = Infinity;
      let u;
      for (let j = 0; j < n; j++) {
        if (!visited[j] && distances[j] < minDist) {
          minDist = distances[j];
          u = j;
          console.log(`min-distance: ${minDist}`);
        }
      }
  
      // mark the vertex as visited
      visited[u] = true;
  
      // update the distances to the neighbors of the vertex
      for (let v = 0; v < n; v++) {
        if (adjMatrix[u][v] && !visited[v] && adjMatrix[u][v] < distances[v]) {
          distances[v] = adjMatrix[u][v];
          parent[v] = u;
          console.log(`updated neighbor: u: ${u}, v: ${v}`);
        }
      }
  
      console.log(`Visisted: ${visited}`)
      console.log(`Distance: ${distances}`)
      console.log(`Parent: ${parent}\n`)
    }
  
    // build the MST using the parent array
    const mst = [];
    for (let i = 1; i < n; i++) {
      mst.push([parent[i], i, adjMatrix[parent[i]][i]]);
    }
  
    return mst;
  }

}


// const g = new Graph();
// g.generateRandomGraph().remove_vertex(2);
