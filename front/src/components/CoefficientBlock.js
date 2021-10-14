import React from 'react';
import './CoefficientBlock.css';
function calculateCoefficient(allMines) {
  var max =25;
  var arr = [];
  arr.push(1);
  let guess = max - allMines;
  let all =25;
  let cur =1;
  let ind = 1;
  for(let u = guess; u>=1;u--) {
    cur*=(u/all);
    all--;
    arr[ind] = 1/cur;
    ind++;
  }
  console.log(arr);
  return arr;
}

class CoefficientBlock extends React.Component {
  constructor(props) {
    super(props);

  }
  render() {
    return(<div className="CoefficientBlock2">{this.props.cur.toFixed(2)}</div>);
  }
}
export { calculateCoefficient, CoefficientBlock };
