const MAIN_BTN_BG = '#1127ED';
const BTN_CLR = '#EFBB4D';

const NODE_INITIAL = '#1127ED';
const NODE_VISITED = 'black';
const NODE_FINAL = '';

const EDGE_INITIAL = '#3a7ecf';
const EDGE_VISITED = 'green';
const EDGE_FINAL = '';

const INFINITY = '∞';
let GraphObj, graph, currentEdgeObj, last_position;


let currentStage = 0, interval, isRunning = false;