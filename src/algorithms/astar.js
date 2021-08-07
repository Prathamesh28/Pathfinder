export function astar(grid, start, target) {
  //var nodesTillVisisted = [];
  if (!start || !target || start === target) {
    return false;
  }
  var openSet = [];
  var closedSet = [];
  openSet.push(start);
  while(openSet.length > 0){
    var winner = 0;
    for(var i = 0;i < openSet.length; i++){
      if(openSet[i].f < openSet[winner].f){
        winner = i;
      }
    }

    var current = openSet[winner];
    console.log(current);
    if(current === target){
      return closedSet;
    }

    removeFromArray(openSet,current);
    closedSet.push(current);

    var neighbors = getNeighbor(grid,current);
    for(var neighbor of neighbors){
      if(!closedSet.includes(neighbor) && !neighbor.isWall){
        var tempG = current.g + 1;
        var newPath = false;
        if(openSet.includes(neighbor)){
          if(tempG < neighbor.g){
            neighbor.g = tempG;
            newPath = true;
          }
        }
        else{
          neighbor.g = tempG;
          newPath = true;
          openSet.push(neighbor);
        }
        if(newPath){
          neighbor.h = heuristic(neighbor,target);
          neighbor.f = neighbor.h + neighbor.g;
          neighbor.previousNode = current;
        }
      }
    }
  }
  return closedSet;
}

function heuristic(a,b){
  var d = Math.abs(a.col - b.col) + Math.abs(a.row-b.row);
  return d;
}
function getNeighbor(grid,current){
  var neighbors = [];
  var i = current.row;
  var j = current.col;
  if(i > 0){
    neighbors.push(grid[i-1][j]);
  }
  if(i < 14){
    neighbors.push(grid[i+1][j]);
  }
  if(j > 0){
    neighbors.push(grid[i][j-1]);
  }
  if(j < 48){
    neighbors.push(grid[i][j+1]);
  }
  return neighbors;
}

function removeFromArray(openSet,current){
  for(var i=openSet.length-1;i>=0;i--){
    if(openSet[i] === current){
      openSet.splice(i,1);
    }
  }
}
