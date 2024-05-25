import { Tree, prettyPrint } from "./index.js";

// creates array of 20 random numbers < 100
const getArr = (size) => {
  const newArr = [];
  for (let i = 0; i < size; i++) {
    newArr.push(Math.floor(Math.random() * 100))
  }
  return newArr;
}

const myTree = new Tree(getArr(15));
console.log("Balanced:", myTree.isBalanced());
console.log("Levelorder =>", myTree.levelorder());
console.log("Preorder =>", myTree.preorderRec());
console.log("Inorder =>", myTree.inorderRec());
console.log("Postorder =>", myTree.postorderRec());

for (let i = 0; i < 5; i++) {
  myTree.insert(Math.floor(Math.random() * 100))
};

console.log("Unbalanced:", myTree.isBalanced());
myTree.reBalance();
console.log("Rebalanced:", myTree.isBalanced());
console.log("Levelorder =>", myTree.levelorder());
console.log("Preorder =>", myTree.preorderRec());
console.log("Inorder =>", myTree.inorderRec());
console.log("Postorder =>", myTree.postorderRec());