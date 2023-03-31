let table;

// function add_row_col_headers(adj_matrix) {
//   const headers = [''];
//   adj_matrix.forEach((item, index) => {
//     headers.push(index + 1);
//   });

//   let result = [headers];
//   adj_matrix.forEach((item, index) => {
//     result.push([index + 1, ...item]);
//   });

//   return result;
// }

function setup_adj_matrix(adj_matrix) {
  const labeled_adj_graph = GraphObj.get_labeled_graph();

  var table = document.createElement('table');
  table.setAttribute('class', 'table table-striped');

  var tableBody = document.createElement('tbody');

  labeled_adj_graph.forEach(function (rowData) {
    if(rowData[1] !== INFINITY) {
      var row = document.createElement('tr');
      row.setAttribute('style', 'height: 30px;');
  
      rowData.forEach(function (cellData) {
        var cell = document.createElement('td');
        cell.setAttribute('style', 'width: 30px;');

        cell.appendChild(document.createTextNode(cellData));
        row.appendChild(cell);
      });
  
      tableBody.appendChild(row);
    }
  });

  table.appendChild(tableBody);

  const table_container = document.getElementById('adjMatrix');
  table_container.innerHTML = '';
  table_container.appendChild(table);
}
