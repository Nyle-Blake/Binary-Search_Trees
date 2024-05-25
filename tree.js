class Node {
  constructor(key = null, left = null, right = null) {
    this.key = key;
    this.left = left;
    this.right = right;
  }
}

class Tree {
  constructor(arr) {
    this.root = this.buildTree(arr);
  }

  clean(arr) {
    return [...new Set(arr)].sort((a, b) => a - b);
  }

  minVal(node) {
    let current = node;
    let min = current.key;
    while (current.left !== null) {
      min = current.left.key;
      current = current.left;
    }
    return min;
  }

  buildTree(arr) {
    let sortedArr = this.clean(arr);
    if (sortedArr.length === 0) return null; // base case
    const mid = parseInt(sortedArr.length / 2);
    let root = new Node(
      sortedArr[mid], // Takes number in the middle as key, LIST IS SORTED so it will always be the median value
      this.buildTree(sortedArr.slice(0, mid)), // recursive for left node
      this.buildTree(sortedArr.slice(mid + 1)) // recursive for right node
    )
    return root;
  }

  insert(key) { // WILL HAVE BETTER TIME COMPLEXITY USING RECURSION
    let current = this.root // current is only used to get to the end of the tree we want to be at
    let previous = null; // previous is used to keep track of the node that we will insert the node to
    const newNode = new Node(key)
    while (current !== null) {
      previous = current;
      key > current.key ? current = current.right : current = current.left;
    }
    key > previous.key ? previous.right = newNode : previous.left = newNode;
  }

  // real delete method
  delete(key, node = this.root) {
    // Base case, The previous node is a leaf node and we reach a null
    if (node === null) return node;

    // If key to be deleted is smaller than node key, it lies in the left subtree
    if (key < node.key) {
      node.left = this.delete(key, node.left);

      // If key to be deleted is bigger than node key, it lies in the right subtree
    } else if (key > node.key) {
      node.right = this.delete(key, node.right);

      // If the key to be deleted is not bigger or smaller, it must be equal, making this the node to be deleted
    } else {
      // Checks if the node has one or no children
      if (node.left === null) { return node.right }
      else if (node.right === null) { return node.left };

      // The node has two children, so get the inorder successor ( samllest in the right subtree )
      node.key = this.minVal(node.right);

      // Delete the inorder successor ( smallest in the right subtree )
      node.right = this.delete(node.key, node.right);
    }
    return node;
  }

  find(key) {
    let current = this.root;
    while (current.key !== key) {
      if (key > current.key) {
        current = current.right;
      } else {
        current = current.left;
      }
    }
    return current;
  }

  // number of nodes from root node to lowest point
  height(node = this.root) {
    if (node === null) return -1;
    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);
    return Math.max(leftHeight, rightHeight) + 1
    // (if we have 2 null ends which both equal -1, we compare, -1 biggest so, -1 + 1 = 0)
    // works as such: 
    //        ┌── 0
    //│   ┌── +2
    //│   │   └── +1
    //│   │       └── 0
    //└── +4
    //    │   ┌── +2
    //    │   │   └── +1
    //    │   │       └── 0
    //    └── +3
    //        └── +1
    //            └── 0
    // This tree has a height of +4
  }

  // number of nodes from chosen node to root node
  // uses a queue LIFO
  depth(node, root = this.root, level = 0) {
    if (node === null) return null;
    if (root === null) return 0;
    if (root.key === node.key) return level;
    let count = this.depth(node, root.left, level + 1);
    if (count !== 0) return count;
    return this.depth(node, root.right, level + 1);
  }

  levelorder(callback) {
    if (this.root === null) return [];
    let queue = [this.root]; // an array is used as a queue, The length of the queue is initially 1 then we add nodes to it
    const result = [];
    while (queue.length) {
      let level = []
      let size = queue.length; // save size of queue on each interation of each level so length == 1 then 2 then 4 depending on our tree
      for (let i = 0; i < size; i++) {
        const node = queue.shift();
        level.push(node.key);
        if (node.left) queue.push(node.left); // push left node of the current node onto the queue
        if (node.right) queue.push(node.right); // push right node of the current node onto the queue
        if (callback) callback(node)
      }
      result.push(level);
    }
    if (!callback) return result;
  }

  // DFS, uses a stack
  // preorder and postorder with recursive versions and non-recursive versions
  // in order recursive
  // An array represents a stack in non-recursive functions using push and pop methods

  // preorder using no recursion
  preorder(callback) {
    if (this.root === null) return [];
    const stack = [this.root];
    const result = [];
    while (stack.length) {
      const node = stack.pop();
      result.push(node.key);
      if (node.right) stack.push(node.right);
      if (node.left) stack.push(node.left);
      if (callback) callback(node);
    }
    if (!callback) return result;
  }

  // postorder using no recursion
  postorder(callback) {
    if (this.root === null) return [];
    const stack = [this.root];
    const result = [];
    while (stack.length) {
      const node = stack.pop();
      result.push(node.key);
      if (node.left) stack.push(node.left);
      if (node.right) stack.push(node.right);
      if (callback) callback(node);
    }
    if (!callback) return result.reverse();
  }

  // preorder using recursion
  preorderRec(callback, node = this.root, result = []) {
    if (!node) return;
    result.push(node.key);
    if (node.left) this.preorderRec(callback, node.left, result);
    if (node.right) this.preorderRec(callback, node.right, result);
    if (callback) {
      callback(node);
    } else {
      return result;
    }
  }

  // inorder using recursion
  inorderRec(callback, node = this.root, result = []) {
    if (!node) return;
    if (node.left) this.inorderRec(callback, node.left, result);
    result.push(node.key);
    if (node.right) this.inorderRec(callback, node.right, result);
    if (callback) {
      callback(node);
    } else {
      return result;
    }
  }

  // postorder using recursion
  postorderRec(callback, node = this.root, result = []) {
    if (!node) return;
    if (node.left) this.postorderRec(callback, node.left, result);
    if (node.right) this.postorderRec(callback, node.right, result);
    result.push(node.key)
    if (callback) {
      callback(node);
    } else {
      return result;
    }
  }

  isBalanced(node = this.root) {
    if (node === null) return true;
    const heightDiff = Math.abs(this.height(node.left) - this.height(node.right));
    return (heightDiff <= 1 && this.isBalanced(node.left) && this.isBalanced(node.right))
  }

  reBalance() {
    if (this.root === null) return null;
    let newArr = this.inorderRec(); // put all node keys in an array, it is already sorted because we use inorder dfs
    this.root = this.buildTree(newArr)
  }
}



// logs tree
const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.key}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

export { Tree, prettyPrint }