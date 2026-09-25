class AdjacencyEngine {

  constructor() {

    this.adjacencyMap = {

      1: [2, 3],

      2: [1, 4],

      3: [1, 4, 5],

      4: [2, 3, 5, 6],

      5: [3, 4],

      6: [4]

    };
  }

  getNeighbors(zoneId) {

    return (
      this.adjacencyMap[zoneId] || []
    );
  }
}

module.exports =
  new AdjacencyEngine();