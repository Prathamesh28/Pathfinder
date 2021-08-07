export function dfs(grid,start,target){
    var nodesTillVisisted = [];
    nodesTillVisisted.push(start);
    var ans = recurse(nodesTillVisisted,grid,start,target);
    if(ans){};
    return nodesTillVisisted;
}
function recurse(nodesTillVisisted,grid,current,target){
    if(current === target){
        return true;
    }
    var neighbors = getNeighbor(grid,current);
    //console.log(neighbors);
    var ans = false;
    for(var neighbor of neighbors){
        if(!nodesTillVisisted.includes(neighbor) && !neighbor.isWall){
            nodesTillVisisted.push(neighbor);
            neighbor.previousNode = current;
            ans |= recurse(nodesTillVisisted,grid,neighbor,target);
            if(ans){
              return true;
            }
        }
    }
    current.previousNode = null;
    return false;
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
