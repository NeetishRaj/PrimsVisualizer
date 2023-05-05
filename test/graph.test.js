import Graph from "../src/graph";

describe("Graph class", () => {

  describe("generates random graph", () => {
    const graphObj = new Graph();
    graphObj.generateRandomGraph();

    test("between 3 to 8 vertices", () => {
      expect(graphObj.nodes_count).toBeGreaterThanOrEqual(3);
      expect(graphObj.nodes_count).toBeLessThanOrEqual(8);
    });

    test("with edges of max weight 15", () => {
      for (let i = 0; i < graphObj.adj_matrix.length; i++) {
        for (let j = 0; j < graphObj.adj_matrix[i].length; j++) {
          expect(graphObj.adj_matrix[i][j]).toBeLessThanOrEqual(15);
        }
      }
    });

    test("without self-edges", () => {
      for (let i = 0; i < graphObj.adj_matrix.length; i++) {
        expect(graphObj.adj_matrix[i][i]).toBe(0);
      }
    });

    test("and solves Prim's algorithm", () => {
      expect(graphObj.visited.length).toBe(0);
      
      graphObj.solve_prim();

      expect(graphObj.visited.length).toBe(graphObj.nodes_count);
    });
  });
});
