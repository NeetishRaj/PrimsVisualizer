import Graph from "../src/graph";

describe("Graph class", () => {
  describe("generates random graph", () => {
    const graphObj = new Graph();
    graphObj.generateRandomGraph();

    test("between 3 to 8 vertices", () => {
      expect(graphObj.nodes_count).toBeGreaterThanOrEqual(3);
      expect(graphObj.nodes_count).toBeLessThanOrEqual(8);
    });

    test("with edges of max connecting weight 15", () => {
      for (let i = 0; i < graphObj.adj_matrix.length; i++) {
        for (let j = 0; j < graphObj.adj_matrix[i].length; j++) {
          if (graphObj.adj_matrix[i][j] === Number.POSITIVE_INFINITY) continue;

          expect(graphObj.adj_matrix[i][j]).toBeLessThanOrEqual(15);
        }
      }
    });

    test("without self-edges", () => {
      for (let i = 0; i < graphObj.adj_matrix.length; i++) {
        expect(graphObj.adj_matrix[i][i]).toBe(Number.POSITIVE_INFINITY);
      }
    });

    test("and solves Prim's algorithm", () => {
      expect(graphObj.visited.length).toBe(0);

      graphObj.solve_prim();

      expect(graphObj.visited.length).toBe(graphObj.nodes_count);
    });
  });

  describe("supports negative and zero edge weights", () => {
    const graphObj = new Graph();
    const test_graph = [
      [Number.POSITIVE_INFINITY, 1, 0, 7],
      [1, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, 8],
      [0, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, -5],
      [7, 8, -5, Number.POSITIVE_INFINITY],
    ];

    graphObj.set_custom_graph(test_graph);

    test("self-edges and no-edges are set as Positive infinity", () => {
      for (let i = 0; i < graphObj.adj_matrix.length; i++) {
        expect(graphObj.adj_matrix[i][i]).toBe(Number.POSITIVE_INFINITY);
      }
    });

    test("has valid distances MST", () => {
      graphObj.solve_prim();
      expect(graphObj.distances.join(",")).toBe("0,1,0,-5");
    });

    test("has valid parent MST", () => {
      graphObj.solve_prim();
      expect(graphObj.parent.join(",")).toBe(",0,0,2");
    });
  });

  describe("supports custom graph", () => {
    const graphObj = new Graph();
    graphObj.set_custom_graph([
      [Number.POSITIVE_INFINITY, 3, 1],
      [3, Number.POSITIVE_INFINITY, 2],
      [1, 2, Number.POSITIVE_INFINITY],
    ]);

    test("graph has 3 vertices", () => {
      expect(graphObj.nodes_count).toBe(3);
    });

    test("without self-edges", () => {
      for (let i = 0; i < graphObj.adj_matrix.length; i++) {
        expect(graphObj.adj_matrix[i][i]).toBe(Number.POSITIVE_INFINITY);
      }
    });

    test("and solves Prim's algorithm", () => {
      expect(graphObj.visited.length).toBe(0);

      graphObj.solve_prim();

      expect(graphObj.visited.length).toBe(graphObj.nodes_count);
    });
  });
});
