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
        this.adj_matrix[i][j] = -1;
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

}


// const g = new Graph();
// g.generateRandomGraph().remove_vertex(2);
