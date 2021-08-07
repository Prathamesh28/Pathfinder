export function bfs(grid,start,target){
    var nodesTillVisisted = [];
    var queue = [];
    nodesTillVisisted.push(start);
    queue.push(start);
    while(queue.length){
        var current = queue.shift();
        if(current === target){
            return nodesTillVisisted;
        }
        var neighbors = getNeighbor(grid,current);
        console.log(nodesTillVisisted);
        for(var neighbor of neighbors){
            if(!nodesTillVisisted.includes(neighbor) && !neighbor.isWall){
                neighbor.previousNode = current;
                nodesTillVisisted.push(neighbor);
                queue.push(neighbor);
            }
        }
    }
    return nodesTillVisisted;
}
function getNeighbor(grid,current){
    var neighbors = [];
    var i = current.row;
    var j = current.col;
    
    if(i < 14){
        neighbors.push(grid[i+1][j]);
    }
    if(j < 48){
        neighbors.push(grid[i][j+1]);
      }
    if(i > 0){
      neighbors.push(grid[i-1][j]);
    }
    if(j > 0){
      neighbors.push(grid[i][j-1]);
    }
    return neighbors;
  }
