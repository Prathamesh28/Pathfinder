import React, { Component } from 'react';
import Node from './Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';

import './PathfindingVisualizer.css';

let startNodeRow = 10;
let startNodeCol = 15;
let finishNodeRow = 10;
let finishNodeCol = 35;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      moveStart: false,
      moveFinish: false,
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    const currGrid = this.state.grid.slice();
    const currNode = currGrid[row][col];
    let newGrid;
    if (currNode.isStart) {
      this.setState({ moveStart: true });
      newGrid = setNewStart(this.state.grid, row, col);
    }
    else if (currNode.isFinish) {
      this.setState({ moveFinish: true });
      newGrid = setNewFinish(this.state.grid, row, col);
    }
    else {
      newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    }
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    let newGrid;

    if (!this.state.mouseIsPressed) return;
    if (this.state.moveStart) {
      newGrid = setNewStart(this.state.grid, row, col);
    }
    else if (this.state.moveFinish) {
      newGrid = setNewFinish(this.state.grid, row, col);
    }
    else {
      newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    }
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ moveStart: false, moveFinish: false, mouseIsPressed: false });
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      const node = visitedNodesInOrder[i];
      if (node.isStart || node.isFinish) {
        continue;
      }
      setTimeout(() => {
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      const node = nodesInShortestPathOrder[i];

      if (node.isStart || node.isFinish) {
        continue;
      }
      else {
        setTimeout(() => {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            'node node-shortest-path';
        }, 50 * i);
      }
    }
  }
  clearPath(wall) {
    const newGrid = this.state.grid.slice();
    for (let row = 0; row < 15; row++) {
      for (let col = 0; col < 49; col++) {
        const node = newGrid[row][col];
        let newNode = createNode(col, row);
        if (!wall) {
          newNode.isWall = node.isWall;
        }
        newGrid[row][col] = newNode;
        if (!node.isStart && !node.isFinish) {
          if (!wall) {
            if (!node.isWall) {
              document.getElementById(`node-${node.row}-${node.col}`).className =
                'node';
            }
          }
          else {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              'node';
          }
        }
      }
    }
    this.setState({ grid: newGrid });
  }
  visualizeDijkstra() {
    const { grid } = this.state;
    const startNode = grid[startNodeRow][startNodeCol];
    const finishNode = grid[finishNodeRow][finishNodeCol];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.clearPath(false);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <>
        <div className="console">
          <button className="startAlgorithm" onClick={() => this.visualizeDijkstra()}>
            Visualize Dijkstra's Algorithm
          </button>
          <button className="clearPath" onClick={() => this.clearPath(false)}>
            Clear Path
          </button>
          <button className="clearWall" onClick={() => this.clearPath(true)}>
            Clear Walls
          </button>
        </div>

        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 15; row++) {
    const currentRow = [];
    for (let col = 0; col < 49; col++) {
      currentRow.push(createNode(col, row));
    }

    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === startNodeRow && col === startNodeCol,
    isFinish: row === finishNodeRow && col === finishNodeCol,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};
const setNewStart = (grid, row, col) => {
  let newGrid = grid.slice();
  newGrid[startNodeRow][startNodeCol].isStart = false;
  startNodeRow = row;
  startNodeCol = col;
  let newStart = newGrid[startNodeRow][startNodeCol];
  newStart.isStart = true;
  newGrid[row][col] = newStart;
  return newGrid;
}
const setNewFinish = (grid, row, col) => {
  let newGrid = grid.slice();
  newGrid[finishNodeRow][finishNodeCol].isFinish = false;
  finishNodeRow = row;
  finishNodeCol = col;
  let newFinish = newGrid[finishNodeRow][finishNodeCol];
  newFinish.isFinish = true;
  newGrid[row][col] = newFinish;
  return newGrid;
}
const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
