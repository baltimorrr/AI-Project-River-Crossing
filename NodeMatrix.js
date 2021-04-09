// Init node's states array
// [i,j,k]: 
// + i: number of cannibals in left side
// + j: number of monsters in left side
// + k: raft state (1: left side, 0: right side)
let NodeStateArr = [];
for(let i = 0; i <= 3; i++){
    for(let j = 0; j <= 3; j++){
        NodeStateArr.push([i,j,0]);
        NodeStateArr.push([i,j,1]);
    }
}

// console.log(NodeStateArr);

// // Find the state of the opposite side 
// function oppositeOf(state){
//     let opposite_state = [];
//     opposite_state.push(3-state[0]);
//     opposite_state.push(3-state[1]);
//     opposite_state.push((state[2] == 1)? 0 : 1); 
//     return opposite_state;
// }

// Check state if it's valid
function check(state){
     
    let cannibals_crr_side = state[0];// Number of cannibals in current side
    let monsters_crr_side = state[1]; // Number of monsters in current side

    let cannibals_op_side = 3-state[0];// Number of cannibals in opposite side
    let monsters_op_side = 3-state[1]; // Number of monsters in opposite side
    
    // Check if state of current side is valid 
    if(monsters_crr_side > cannibals_crr_side && monsters_crr_side != 0 && cannibals_crr_side != 0)
       return false;
    // Check if state of opposite side is valid
    if(monsters_op_side > cannibals_op_side && monsters_op_side != 0 && cannibals_op_side != 0)
       return false; 
    return true;
}


// Find the no. of Node by state in NodeStateArr
function findNodeByState(state){
    for(let i in NodeStateArr){
        let arr = NodeStateArr[i];
        if( arr[0] == state[0] && arr[1] == state[1] && arr[2] == state[2])
            return i;
    }
    return -1;
}

// Init Node Matrix
let NodeMatrix = [];
for(let i = 0; i < 32; i++){
    NodeMatrix[i] = [];
}

// Add Node to Node Matrix
function addNode(current_state, next_state){
    // If current state isn't valid -> don't add next_state into current_state branch
    if(check(current_state)){
        // Find the no. of Node by state in NodeStateArr
        let current_no = findNodeByState(current_state);
        let next_no = findNodeByState(next_state);
        NodeMatrix[current_no].push(next_no);
    } 
}

for(let current_state of NodeStateArr){
    
    if(current_state[2] == 1){// Raft on the left side
            
        // Move 1 or 2 cannibals
        for(let i = 1; i <= 2 && i <= current_state[0]; i++){
            addNode(current_state, [current_state[0]-i,current_state[1], 0]);
        }

        // Move 1 or 2 monsters
        for(let i = 1; i <= 2 && i <= current_state[1]; i++){
            addNode(current_state, [current_state[0],current_state[1]-i, 0]);
        }

        // Move 1 cannibal and 1 monster
        if(current_state[0] >= 1 && current_state[1] >= 1){
            addNode(current_state, [current_state[0]-1,current_state[1]-1,0]);
        }
    }

    else{// Raft on the right side
        // Add 1 or 2 cannibals
        for(let i = 1; i <= 2 && i <= 3-current_state[0]; i++){
            addNode(current_state, [current_state[0]+i, current_state[1], 1]);
        }

        // Add 1 or 2 monsters
        for(let i = 1; i <= 2 && i <= 3-current_state[1]; i++){
            addNode(current_state,[current_state[0], current_state[1]+i, 1]);
        }

        // Add 1 cannibal and 1 monster
        if(current_state[0] < 3  && current_state[1] < 3){
            let next_state = [current_state[0]+1,current_state[1]+1,1];
            addNode(current_state,next_state);
        }
    }
}

for(let arr of NodeMatrix){
    arr.sort((a,b) => a-b);
}

console.log(NodeMatrix);

function bfs(NodeMatrix, StartState, GoalState){
    let start_no = findNodeByState(StartState);
    let goal_no = findNodeByState(GoalState);
    
    let parent_node_no = [];
    parent_node_no[start_no] = -1;
    let marked = [];
    for(let i = 0; i < 32; i++)
       marked[i] = false;
    marked[start_no] = true;
    
    let queue = [];
    queue.push(start_no);
    let count = 0;
    while(1){
        count++;
        let crr_no = queue.shift();
        console.log(crr_no + " : " + queue);
        if(crr_no == goal_no) break;
        for(let x of NodeMatrix[crr_no]){
            if(!marked[x]){
                parent_node_no[x] = crr_no;
                queue.push(x);
                marked[x] = true;
            }
        } 
    }
    console.log(count);

    
    let path = [];
    let crr_no = goal_no;
    while(crr_no != -1){
        path.push(crr_no);
        crr_no = parent_node_no[crr_no];
    }
    path.reverse();
    for(let x of path){
        console.log(x + " " + NodeStateArr[x]);
    }
    return path;
}

console.log(bfs(NodeMatrix, [0,0,0], [3,3,1]));


// for(let i = 21; i < 33; i++){
//     console.log(i+ ":" + NodeStateArr[i] +  " " + oppositeOf(NodeStateArr[i]) + " - " +  
//               (check(NodeStateArr[i])&&check(oppositeOf(NodeStateArr[i]))) );
//     for(let x of NodeMatrix[i])
//          console.log(x + " : " + NodeStateArr[x]);
// }

// function find(arr, x){
//     for(let i in arr){
//         if(arr[i] == x)
//            return true;
//     }
//     return false;
// }

// for(let i = 0; i < 32; i++){
//     for(let j = 0; j < 32; j++){
//         if(find(NodeMatrix[i],j)) 
//             document.write("1, ");
//         else 
//             document.write("0, ");
//     }
//     document.write("<br>");
//}
export default NodeMatrix;

