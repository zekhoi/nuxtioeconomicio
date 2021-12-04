const mathjs = require("mathjs");

function getAllocationMatrix(transaction, inputoutput) {
  /**
   * get Allocation matrix
   *
   * Args:
   *      transaction =>  type: array | transaction matrix
   *      inputoutput => type: array | ouput vector
   *
   * return => type: Matrix mathjs obj
   */
  let indexRow = 0,
    indexCol = 0;
  const numrow = mathjs.size(transaction)[0],
    numcol = mathjs.size(transaction[1]);

  // const numrow = mathjs.size(transaction)[0] , numcol = mathjs.size(transaction[1]);
  let allocation = mathjs.zeros(mathjs.size(transaction));

  while (true) {
    let t_ij = mathjs.column(transaction, indexCol)[indexRow]; // transaction item in i, j index
    let o_j = inputoutput[indexCol]; // inputoutput item in j index
    let a = t_ij / o_j; // allocation coefficient
    allocation[indexRow][indexCol] = a;

    if (indexRow == numrow - 1) {
      indexRow = 0;
      indexCol += 1;
    } else {
      indexRow += 1;
    }
    if (indexCol == numcol) {
      break;
    }
  }
  return mathjs.matrix(allocation);
}

function getLeontiefInv(transaction, inputoutput) {
  /**
   * get leontief inverse matrix
   *
   * Args:
   *      transaction =>  type: array | transaction matrix
   *      inputoutput => type: array | ouput vector
   *
   * return => type: Matrix mathjs obj
   */
  const numcol = mathjs.size(transaction)[1];
  const identity = mathjs.identity(numcol); // size is (numrow, numcol)
  const allocation = getAllocationMatrix(transaction, inputoutput);
  const temp = mathjs.subtract(identity, allocation);
  const leontiefInv = mathjs.inv(temp);

  return leontiefInv;
}

function getGhoshianInv(transaction, inputoutput) {
  /**
   * get ghoshian inverse matrix
   *
   * Args:
   *      transaction =>  type: array | transaction matrix
   *      inputoutput => type: array | ouput vector
   *
   * return => type: Matrix mathjs obj
   */
  const numcol = mathjs.size(transaction)[1];
  const identity = mathjs.identity(numcol); // size is (numrow, numcol)
  const transactionTranspose = mathjs.transpose(transaction);
  const allocation = getAllocationMatrix(transactionTranspose, inputoutput);

  const temp = mathjs.subtract(identity, allocation);
  const ghoshianInv = mathjs.inv(temp);

  return ghoshianInv;
}

function getImpactAnalysis(transaction, inputoutput, scenario) {
  /**
   * get inputoutput impact from given scenario
   *
   * Args:
   *      transaction =>  type: array | transaction matrix
   *      inputoutput => type: array | ouput vector
   *      scenario => type: array | scenario vector
   *
   * return => type: Matrix mathjs obj
   */
  const leontiefInv = getLeontiefInv(transaction, inputoutput);
  let final = mathjs.zeros(mathjs.size(scenario)[1], mathjs.size(scenario)[0])
    ._data;
  for (let i = 0; i < scenario.length; i++) {
    let result = mathjs.multiply(leontiefInv, scenario[i])._data;
    result.forEach((element, index) => {
      final[index][i] = element;
    });
  }
  return final;
}

function getOutputMultiplier(transaction, inputoutput) {
  /**
   * get output multiplier
   *
   * Args:
   *      transaction =>  type: array | transaction matrix
   *      inputoutput => type: array | ouput vector
   *
   * return => type: Matrix mathjs obj | output multiplier vector
   */

  let outputMult = mathjs.zeros(mathjs.size(inputoutput));
  const leontiefInv = getLeontiefInv(transaction, inputoutput);
  const numrow = mathjs.size(transaction)[0],
    numcol = mathjs.size(transaction)[1];

  for (let j = 0; j < numcol; j++) {
    let Oj = 0;
    for (let i = 0; i < numrow; i++) {
      Oj += leontiefInv.subset(mathjs.index(i, j));
    }
    outputMult[j] = [Oj];
  }
  return outputMult;
}

function getIncomeMultiplier(transaction, inputoutput, income) {
  /**
   * get income multiplier
   *
   * Args:
   *      transaction => type: array | transaction matrix
   *      inputoutput => type: array | ouput vector
   *      income => type: array | income vector
   *
   * return => type: Matrix mathjs obj | income multiplier vector
   */
  const leontiefInv = getLeontiefInv(transaction, inputoutput);

  const inputMult = mathjs.zeros(mathjs.size(income));
  let a;
  for (let i = 0; i < income.length; i++) {
    a = income[i] / inputoutput[i];
    inputMult[i] = a;
  }
  console.log(inputMult);
  console.log(leontiefInv);
  let result = mathjs.multiply(inputMult, leontiefInv)._data;
  let matrix = [];
  for (let i = 0; i < result.length; i++) {
    matrix.push([result[i]]);
  }
  return matrix;
}

function getEmploymentMultiplier(transaction, inputoutput, employment) {
  /**
   * get employment multiplier
   *
   * Args:
   *      transaction => type: array | transaction matrix
   *      inputoutput => type: array | ouput vector
   *      employment => type: array | employment
   *
   * return => type: array | employment multiplier vector
   */

  const leontiefInv = getLeontiefInv(transaction, inputoutput);

  const employmentMult = mathjs.zeros(mathjs.size(employment));
  let w;
  for (let i = 0; i < employment.length; i++) {
    w = employment[i] / inputoutput[i];
    employmentMult[i] = w;
  }
  let result = mathjs.multiply(employmentMult, leontiefInv)._data;
  let matrix = [];
  for (let i = 0; i < result.length; i++) {
    matrix.push([result[i]]);
  }
  return matrix;
}

function getInputOrSupplyMultiplier(transaction, inputoutput) {
  /**
   * get supply (input) multiplier
   *
   * Args:
   *      transaction => type: array | transaction matrix
   *      inputoutput => type: array | ouput vector
   *
   * return => type: Matrix mathjs obj| supply multiplier vector
   */

  // let final = mathjs.zeros(
  //   mathjs.size(inputoutput)[1],
  //   mathjs.size(inputoutput)[0]
  // )._data;

  // for (let index = 0; index < inputoutput.length; index++) {
  //   const ghoshianInv = getGhoshianInv(transaction, inputoutput[index]);
  //   const numrow = mathjs.size(transaction)[0],
  //     numcol = mathjs.size(transaction)[1];

  //   for (let j = 0; j < numcol; j++) {
  //     let Oj = 0;
  //     for (let i = 0; i < numrow; i++) {
  //       Oj += ghoshianInv.subset(mathjs.index(i, j));
  //     }
  //     final[j][index] = Oj;
  //   }
  // }
  // return final;
  const ghoshianInv = getGhoshianInv(transaction, inputoutput);

  let supplyMult = mathjs.zeros(mathjs.size(inputoutput));
  const numrow = mathjs.size(transaction)[0],
    numcol = mathjs.size(transaction)[1];

  for (let j = 0; j < numcol; j++) {
    let Oj = 0;
    for (let i = 0; i < numrow; i++) {
      Oj += ghoshianInv.subset(mathjs.index(i, j));
    }
    supplyMult[j] = [Oj];
  }
  return supplyMult;
}

module.exports = {
  getAllocationMatrix,
  getLeontiefInv,
  getGhoshianInv,
  getImpactAnalysis,
  getOutputMultiplier,
  getIncomeMultiplier,
  getEmploymentMultiplier,
  getInputOrSupplyMultiplier
};