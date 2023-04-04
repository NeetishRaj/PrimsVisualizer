var cy_config;
function setup_cy() {

  cy_config = {
    container: document.getElementById('cy'),
  
    layout: {
      name: 'avsdf',
      nodeSeparation: 120,
    },
  
    style: [
      {
        selector: 'node',
        style: {
          label: 'data(id)',
          'text-valign': 'center',
          color: BTN_CLR,
          'background-color': MAIN_BTN_BG,
        },
      },
  
      {
        selector: 'edge',
        style: {
          width: 2,
          'line-color': '#3a7ecf',
          color: '#000',
          opacity: 0.8,
          label: 'data(label)',
        },
      },
    ],
  
    elements: {
      nodes: generate_nodes(graph),
      //   [
      //     { data: { id: 'v1', weight: 1 } },
      //     { data: { id: 'v2', weight: 2 } },
      //     { data: { id: 'v3', weight: 3 } },
      //     { data: { id: 'v4', weight: 4 } },
      //     { data: { id: 'v5', weight: 5 } },
      //     { data: { id: 'v6', weight: 6 } },
      //     { data: { id: 'v7', weight: 7 } },
      //   ],
      edges: generate_edges(graph),
      //   [
      //     {
      //       data: { source: 'v1', target: 'v2', directed: 'false', label: '4' },
      //       classes: 'autorotate',
      //     },
      //     { data: { source: 'v1', target: 'v4', directed: 'false' } },
      //     { data: { source: 'v1', target: 'v5', directed: 'false' } },
      //     { data: { source: 'v2', target: 'v4', directed: 'false' } },
      //     { data: { source: 'v2', target: 'v6', directed: 'false' } },
      //     { data: { source: 'v3', target: 'v4', directed: 'false' } },
      //     { data: { source: 'v3', target: 'v7', directed: 'false' } },
      //     { data: { source: 'v4', target: 'v5', directed: 'false' } },
      //     { data: { source: 'v4', target: 'v7', directed: 'false' } },
      //     { data: { source: 'v5', target: 'v6', directed: 'false' } },
      //     { data: { source: 'v6', target: 'v7', directed: 'false' } },
      //     { data: { source: 'v6', target: 'v3', directed: 'false' } },
      //   ],
    },
  };
}

function setup_cytoscape(graph) {
  setup_cy();
  setup_adj_matrix(graph);

  cy = window.cy = cytoscape(cy_config);

  cy.on('click', 'node', function (evt) {
    // console.log(evt);
    console.log('clicked ' + this.id());
    // remove_vertex(graph, this.id());
  });

  cy.on('rightclick', 'node', function (evt) {
    console.log('right clicked ' + this.id());
    
    remove_vertex(graph, this.id());
  });

  // Double click setup
  var tappedBefore;
  var tappedTimeout;
  cy.on('tap', function (event) {
    var tappedNow = event.target;
    if (tappedTimeout && tappedBefore) {
      clearTimeout(tappedTimeout);
    }
    if (tappedBefore === tappedNow) {
      tappedNow.trigger('doubleTap');
      tappedBefore = null;
    } else {
      tappedTimeout = setTimeout(function () {
        tappedBefore = null;
      }, 300);
      tappedBefore = tappedNow;
    }
  });

  cy.on('click', 'edge', function (evt) {
    console.log('clicked ' + this.id());
    update_edge_inputs(this.data());
    currentEdgeObj = this;
  });

  cy.on('doubleTap', 'edge', function (event) {
    console.log(`DOUBLE CLICK on EDGE: ${this.id()}`);
    delete_edge(this);
  });


  cy.on('doubleTap', 'node', function (event) {
    console.log(`DOUBLE CLICK on ${this.id()}`);
    this.remove();
    remove_vertex(this.id());
  });
}

function generate_edges(graph) {
  let result = [];

  for (let i = 0; i < graph.length; i++) {
    for (let j = i + 1; j < graph[i].length; j++) {
      if (graph[i][j] === INFINITY) continue;

      if (graph[i][j] !== 0) {
        result.push({
          data: {
            source: `${i + 1}`,
            target: `${j + 1}`,
            directed: 'false',
            label: graph[i][j],
          },
          classes: 'autorotate',
        });
      }
    }
  }

  return result;
}

function generate_nodes(graph) {
  return graph
    .filter((item) => item[0] !== INFINITY)
    .map((item, index) => ({
      data: { id: `${index + 1}`, weight: index + 1 },
    }));
}

function redraw_graph() {
  // cy.elements().remove();
  // cy.add(cy_config.elements);
  // cy.json({elements: cy_config.elements});
  // cy.run();

  setup_adj_matrix(graph);
}

function remove_vertex(vertex_no) {
  console.log(`Removing vertex ${vertex_no}`);
  GraphObj.remove_vertex(vertex_no);

  redraw_graph();
}

function update_edge_inputs(edge_data) {
  const inputSrc = document.querySelector('#edgeSource');
  const inputTarget = document.querySelector('#edgeTarget');
  const inputWeight = document.querySelector('#edgeWeight');

  inputSrc.value = edge_data.source;
  inputTarget.value = edge_data.target;
  inputWeight.value = edge_data.label;
}

function updateEdgeFromInput() {
  const inputSrc = document.querySelector('#edgeSource').value;
  const inputTarget = document.querySelector('#edgeTarget').value;
  const inputWeight = document.querySelector('#edgeWeight').value;
  
  
  if(GraphObj.is_edge_there(inputSrc, inputTarget)) {
    console.log(`updating edge`);
    GraphObj.update_edge(inputSrc, inputTarget, inputWeight);
    currentEdgeObj.data({
      label: inputWeight
    })
  } else {
    console.log("Edge not available! Adding it!");
    GraphObj.add_edge(inputSrc, inputTarget, inputWeight);
    cy.add([
      { group: 'edges', data: { 
        // id: 'e0', 
        source: inputSrc, 
        target: inputTarget,
        label: inputWeight,
        directed: false 
      } }
    ]);
  }
  
  redraw_graph();
}


function delete_edge(edge_obj) {
  console.log(`Deleting edge`);
  const edge_data = edge_obj.data();

  GraphObj.delete_edge(edge_data.source, edge_data.target);

  edge_obj.remove();

  redraw_graph();
}