var _ = require('underscore');
var colors = require('colors');
var dictTree = require('./english-dictionary-tree.json');
var problemStatement = String(process.argv[2]).split(' ');
var problemMatrix = [];
var results = {};

if(problemStatement.length != 16) {
  console.log("Sorry incorrect input");
  process.exit(0);
}

for(var i = 0; i < 4; i++) {
  problemMatrix.push(new Array(4));
}

_.each(problemStatement, function(char, index) {
  problemMatrix[Math.floor(index / 4)][index%4] = char;
});

_.each(problemMatrix, function(row, rowIndex) {
  _.each(row, function(col, colIndex) {
    infectNode(problemMatrix, rowIndex, colIndex);
  });
});

var solutions = _.keys(results);

solutions = solutions.sort(function(a, b) {
  return b.length - a.length;
});

_.each(solutions.slice(0, 50), function(solution) {
  prettyPrint(solution, results[solution]);
});

function infectNode(problemMatrix, rowIndex, colIndex) {
  for(var i = rowIndex - 1; i <= rowIndex + 1; i++) {
    for(var j = colIndex - 1; j <= colIndex + 1; j++) {
      if(indexOutOfBounds(i, j) || (i == rowIndex && j == colIndex)) {
        continue;
      }

      var firstChar = problemMatrix[rowIndex][colIndex];
      var secondChar =  problemMatrix[i][j];
      //console.log(firstChar, secondChar);
      if(dictTree[firstChar] && dictTree[firstChar][secondChar]) {
        startThread(problemMatrix, i, j, [
          getTraceIndex(rowIndex, colIndex),
          getTraceIndex(i, j)
        ], [
            firstChar,
            secondChar
        ]);
      }
    }
  }
}

function indexOutOfBounds(rowIndex, colIndex) {
  if(rowIndex < 0 || rowIndex > 3) {
    return true;
  }
  else if(colIndex < 0 || colIndex > 3) {
    return true;
  }

  return false
}

function getTraceIndex(rowIndex, colIndex) {
  return rowIndex*4 + colIndex;
}

function startThread(problemMatrix, rowIndex, colIndex, charIndexTrace, charTrace) {
  for (var i = rowIndex - 1; i <= rowIndex + 1; i++) {
    for (var j = colIndex - 1; j <= colIndex + 1; j++) {
      if(indexOutOfBounds(i, j) || (i == rowIndex && j == colIndex)) {
        continue;
      }
      if(charIndexTrace.indexOf(getTraceIndex(i, j)) >= 0) {
        continue;
      }

      var testResults = testCharTrace(dictTree, charTrace);

      if(testResults.isWord) {
        storeSolution(charTrace, charIndexTrace);
      }

      if(testResults.canGoFurther) {
        startThread(problemMatrix, i, j,
            charIndexTrace.concat(getTraceIndex(i, j)),
            charTrace.concat(problemMatrix[i][j]));
      }
    }
  }
}

function testCharTrace(dictTree, charTrace) {
  var pointer = dictTree;
  if(charTrace.length > 0 && pointer.hasOwnProperty(charTrace[0])) {
    if(charTrace.length === 1) {
      if(pointer[charTrace[0]]['.']) {
        if(_.keys(pointer[charTrace[0]]).length > 1) {
          return {
            isWord: true,
            canGoFurther: true
          };
        }
        else {
          return {
            isWord: true,
            canGoFurther: false
          }
        }
      }
      else {
        return {
          canGoFurther: true
        };
      }
    }
    else {
      var newPointer = pointer[charTrace[0]];
      return testCharTrace(newPointer, charTrace.slice(1));
    }
  }
  else {
    return {
      canGoFurther: false
    }
  }
}


function storeSolution(charTrace, charIndexTrace) {
  if(charTrace.length > 3 && !results[charTrace.join('')]) {
    results[charTrace.join('')] = charIndexTrace;
  }
}

function prettyPrint(solution, charIndexTrace) {
  console.log(solution);
  for(var i = 0; i < 4; i++) {
    var printRow = '';
    for(var j = 0; j < 4; j++) {
      var numOrder = charIndexTrace.indexOf(4*i + j);
      if(numOrder >= 0) {
        printRow += problemMatrix[i][j][getColor(numOrder)];
      }
      else {
        printRow += ' ';
      }
    }
    console.log(printRow);
  }
  console.log('     \n\n')
}

function getColor(numOrder) {
  if(numOrder === 0) {
    return 'white';
  }
  else {
    return ['red', 'red', 'green'][(numOrder - 1)%3];
  }
}
