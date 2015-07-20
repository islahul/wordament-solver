var fs = require('fs');
var _ = require('underscore');
var dictionaryMap = {
  dict: {}
};

fs.readFile(process.argv[2], 'utf8', function(err, txtFileData) {
  if (err) {
    console.log(err);
    return;
  }

  var words = txtFileData.split('\n');

  _.each(words, function(word) {
    writeWordToDictionaryMap(dictionaryMap, word);
  });

  if(test(dictionaryMap)) {
    writeDictionaryToFile('english-dictionary-tree.json', dictionaryMap.dict);
  }
});


function writeWordToDictionaryMap(dictionaryMap, word) {
  var pointer = dictionaryMap.dict;

  _.each(word.split(''), function(character) {
    character = character.toLowerCase();
    pointer[character] = pointer[character] || {};
    pointer = pointer[character];
  });

  pointer['.'] = true;
}

function writeDictionaryToFile(filename, dictionaryMap) {
  fs.writeFile('./' + filename, JSON.stringify(dictionaryMap), function(err) {
    if(err) {
      console.log(err);
      return;
    }

    console.log('Tree stored. Cheers!');
  });
}

function test(dictionaryMap) {
  return dictionaryMap.dict.s.h.i.t['.'];
}
