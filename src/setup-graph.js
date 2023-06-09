import setup_adj_matrix from  "./setup-adj-matrix.js"

import cytoscape from 'cytoscape';
import avsdf from 'cytoscape-avsdf';


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
      {
        selector: 'node.initial',
        style: {
            'text-valign': 'center',
            'color': "white",
            // 'text-outline-color': '#3a7ecf',
            // 'text-outline-width': 2,
            'background-color': NODE_INITIAL
        }
      },
      {
        selector: 'node.visited',
        style: {
            'text-valign': 'center',
            'color': "white",
            // 'text-outline-color': 'white',
            // 'text-outline-width': 2,
            'background-color': NODE_VISITED
        }
      },
      {
        selector: 'node.active',
        style: {
            'text-valign': 'center',
            'color': "white",
            'background-color': NODE_ACTIVE
        }
      },
      {
        selector: 'edge.initial',
        style: {
          width: 2,
          'line-color': EDGE_INITIAL,
          color: '#000',
          opacity: 0.8,
          label: 'data(label)',
        }
      },
      {
        selector: 'edge.visited',
        style: {
          width: 2,
          'line-color': EDGE_VISITED,
          color: 'black',
          opacity: 0.8,
          label: 'data(label)',
        }
      }
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

export function setup_cytoscape(graph) {
  setup_cy();
  setup_adj_matrix(graph);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      goto_previous_step();
    }
    if (event.key === 'ArrowUp') {
      goto_last_step();
    }
    if (event.key === 'ArrowRight') {
      goto_next_step();
    }
    if (event.key === 'ArrowDown') {
      goto_first_step();
    }
  });
  cytoscape.use( avsdf );
  cy = window.cy = cytoscape(cy_config);

  cy.on('click', 'node', function (evt) {
    // console.log(evt);
    console.log('clicked ' + this.id());
    // remove_vertex(graph, this.id());
  });

  cy.on('cxttap', 'node', function (evt) {
    console.log('right clicked ' + this.id());
    GraphObj.setup_start_vertex(this.id());
    draw_start_vertex();
  });

  // Double click setup
  var tappedBefore;
  var tappedTimeout;
  cy.on('tap', function (event) {
    var tappedNow = event.target;
    if (event.target === cy) {
      last_position = event.position;
    }

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

  cy.on('tap', 'node', function (evt) {
    console.log('changing color');
    // this.flashClass('active-node', 1000);
    const ele = evt.target;
    ele.flashClass('highlight', 1000);
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

  cy.on('doubleTap', function (event) {
    var evtTarget = event.target;

    if (evtTarget === cy) {
      console.log('double tap on background');
      add_vertex();
    }
  });

  // document.querySelector('#edgeWeight').addEventListener('input', (e) => {
  //   const val = parseInt(e.target.value);
  //   if(val < 0) e.target.value = 0;
  // })
}

function put_message(msg) {
  document.getElementById('messageBox').textContent = msg;
}

function generate_edges(graph) {
  let result = [];

  for (let i = 0; i < graph.length; i++) {
    for (let j = i + 1; j < graph[i].length; j++) {
      if (graph[i][j] === BIG_NUMBER) continue;

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
  setup_adj_matrix(graph);
}

function add_vertex() {
  GraphObj.add_vertex();
  cy.add([
    {
      group: 'nodes',
      data: {
        id: GraphObj.get_top_label(),
        weight: GraphObj.get_top_label(),
      },
      position: last_position,
    },
  ]);

  redraw_graph();
}

function remove_vertex(vertex_no) {
  console.log(`Removing vertex ${vertex_no}`);
  GraphObj.remove_vertex(vertex_no);

  redraw_graph();
}

function find_and_update_labels_in_graph(inputSrc, inputTarget, inputWeight) {
  let edges = cy.edges(`[source = "${inputSrc}"][target = "${inputTarget}"]`);
  
  if(edges.length > 0) {
    edges.data({label: inputWeight});
  } else {
    edges = cy.edges(`[source = "${inputTarget}"][target = "${inputSrc}"]`);
    edges.data({label: inputWeight});
  }
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

  if(inputSrc === inputTarget) {
    console.log("Invalid Edges");
    return null;
  }

  if(Number.isNaN(parseInt(inputWeight))){
    console.log("Invalid edge weight");
    return null;
  }

  if (GraphObj.is_edge_there(inputSrc, inputTarget)) {
    console.log(`updating edge`);
    //console.log(`src: ${inputSrc}, target: ${inputTarget}`);

    GraphObj.update_edge(inputSrc, inputTarget, inputWeight);
    find_and_update_labels_in_graph(inputSrc, inputTarget, inputWeight)

  } else {
    console.log('Edge not available! Adding it!');
    GraphObj.add_edge(inputSrc, inputTarget, inputWeight);
    cy.add([
      {
        group: 'edges',
        data: {
          // id: 'e0',
          source: inputSrc,
          target: inputTarget,
          label: inputWeight,
          directed: false,
        },
      },
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

function draw_start_vertex() {
  cy.nodes().removeClass('active');
  const start_label = GraphObj.node_labels[GraphObj.startVertex];
  cy.nodes(`#${start_label}`).addClass('active');
  put_message(`Selected '${start_label}' as start vertex`);
}

function draw_nodes() {
 interval = setInterval(interval_loop, 1000);
}

function interval_loop(go_forward = true) {
  let c_stage = GraphObj.stages[currentStage];
  if(!c_stage) {
    console.log(`Invalid stage at stage no ${currentStage} where total is ${GraphObj.stages.length}`);
    if(currentStage < GraphObj.stages.length / 2) {
      currentStage = 0;
    } else {
      currentStage = GraphObj.stages.length - 1;
    }
    return null;
  }

  cy.nodes().removeClass('visited');
  cy.nodes().filter(function( ele ){
    const index = GraphObj.get_index_from_label(ele.id());
    // console.log(c_stage.visited[index]);
    return c_stage.visited[index];
  }).addClass('visited');


  cy.edges().removeClass('visited');
  cy.edges().filter(function(edge){
    let edge_data = edge.data();
    const src_index = GraphObj.get_index_from_label(edge_data.source);
    const target_index = GraphObj.get_index_from_label(edge_data.target);
    // console.log(`src_index: ${src_index}, ttarget_index${target_index}`);
    if(c_stage.parent[src_index] === target_index 
      || c_stage.parent[target_index] === src_index){
      return true
    } else {
      return false;
    }
  }).addClass('visited');
  
  if(go_forward) {
    currentStage++;
  } else {
    if(currentStage <  0) currentStage = 0;
  }

  // console.log(`${currentStage}. ${c_stage.parent}`);
  if(currentStage >= GraphObj.stages.length) {
    // currentStage = 0;
    clearInterval(interval);
    isRunning = false;
    document.querySelector('#startStopButton').textContent = "Start";
  }
}

function stop() {
  isRunning = false;
  clearInterval(interval);
  document.querySelector('#startStopButton').textContent = "Start";
}

function start() {
  isRunning = true;
  currentStage = 0;
  GraphObj.solve_prim();
  // console.log(mst);
  draw_start_vertex();
  draw_nodes();
  document.querySelector('#startStopButton').textContent = "Stop";
}

function start_prims() {
  if(isRunning) {
    stop();
  } else {
    start();
  }
}


function goto_first_step() {
  console.log("Goto First step");

  if(GraphObj.stages.length > 0) {
    currentStage = 0;
    interval_loop();
  } else {
    GraphObj.solve_prim();
    currentStage = 0;
    interval_loop();
  }
}

function goto_last_step() {
  console.log("Goto Last step");

  if(GraphObj.stages.length > 0) {
    currentStage = GraphObj.stages.length - 1;
    interval_loop();
  } else {
    GraphObj.solve_prim();
    currentStage = GraphObj.stages.length - 1;
    interval_loop();
  }
}

function goto_next_step() {
  console.log("Goto next step");

  if(GraphObj.stages.length > 0) {
    interval_loop(true);
  } else {
    GraphObj.solve_prim();
    currentStage = 0;
    interval_loop(true);
  }
}

function goto_previous_step() {
  console.log(`Goto Previous step from ${currentStage}`);


  if(GraphObj.stages.length > 0) {
    currentStage--;
    interval_loop(false);
  } else {
    GraphObj.solve_prim();
    currentStage = 1;
    interval_loop(false);
  }
}

window.start_prims = start_prims;
window.goto_first_step = goto_first_step;
window.goto_last_step = goto_last_step;
window.goto_next_step = goto_next_step;
window.goto_previous_step = goto_previous_step;
window.updateEdgeFromInput = updateEdgeFromInput;