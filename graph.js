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

    this.stages = [];
    this.visited = [];
    this.distances = [];
    this.parent = [];
  }

  setup_start_vertex(vertex_label) {
    const vertex_index = this.get_index_from_label(parseInt(vertex_label));
    if(vertex_index >= 0){
      this.startVertex = vertex_index;
    } else {
      console.log('Invalid start Vertex');
      this.startVertex = 0;
    }
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
  
    // console.log(this.adj_matrix);
    return this;
  }
  get_index_from_label(label) {
    return this.node_labels.indexOf(parseInt(label));
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

    for (let i = 0; i < result.length; i++) {
      for (let j = 0; j < result[i].length; j++) {
        if(result[i][j] === 0){
          result[i][j] = INFINITY;
        }
      }
    }
  
    return result;
  }

  solve_prim() {
    this.stages = [];
    // console.log(this.adj_matrix);

    const n = this.adj_matrix.length; // number of vertices
    this.visited = new Array(n).fill(false); // keep track of visited vertices
    this.distances = new Array(n).fill(Infinity); // keep track of minimum distance to each vertex
    this.parent = new Array(n).fill(null); // keep track of parent of each vertex in the MST
  
    // start with some vertex
    this.distances[this.startVertex] = 0;
    let tmp = [...this.visited];
    tmp[this.startVertex] = true;
    this.stages.push({
      visited: tmp,
      distances: [...this.distances],
      parent: [...this.parent]
    })

    for (let i = 0; i < n - 1; i++) {
      // console.log(`ROUND: ${i}   ###############`);
  
      // find the vertex with the minimum distance among the unvisited vertices
      let minDist = Infinity;
      let u;
      for (let j = 0; j < n; j++) {
        if (!this.visited[j] && this.distances[j] < minDist) {
          minDist = this.distances[j];
          u = j;
          // console.log(`min-distance: ${minDist}`);
        }
      }
  
      // mark the vertex as this.visited
      this.visited[u] = true;
  
      // update the this.distances to the neighbors of the vertex
      for (let v = 0; v < n; v++) {
        // console.log(`u: ${u}, v: ${v}`);
        if(typeof this.adj_matrix[u] === 'undefined') continue;

        if (this.adj_matrix[u][v] && !this.visited[v] && this.adj_matrix[u][v] < this.distances[v]) {
          this.distances[v] = this.adj_matrix[u][v];
          this.parent[v] = u;

          this.stages.push({
            visited: [...this.visited],
            distances: [...this.distances],
            parent: [...this.parent]
          })
        }
      }
    }
  
    // build the MST using the parent array
    const mst = [];
    for (let i = 1; i < n; i++) {
      if(this.parent[i] !== 0 && !this.parent[i]) continue;
      mst.push([this.parent[i], i, this.adj_matrix[this.parent[i]][i]]);
    }

    // Push the missing nodes in visisted array
    mst.forEach((edge) => {
      this.visited[edge[0]] = true;
      this.visited[edge[1]] = true;
    })
    this.stages.push({
      visited: [...this.visited],
      distances: [...this.distances],
      parent: [...this.parent]
    })

    // console.log(this.stages);
    return mst;
  }

}


// const g = new Graph();
// g.generateRandomGraph().remove_vertex(2);
