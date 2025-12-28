function fuzzySearchStringArray(sourceArray, searchTerm, scoreThreshold = 0.0) {
    var matches = {}
    for (let i=0;i<sourceArray.length;i++) {
        var string = sourceArray[i]
        let scoreExact = string.completeMatchSearch(searchTerm)
        let scoreOrdered = string.orderedMatchSearch(searchTerm)
        let scoreUnordered = string.unorderedMatchSearch(searchTerm)
        let score = scoreExact * 3 + scoreOrdered * 2 + scoreUnordered
        if (score > scoreThreshold || scoreExact > 0) {
            matches[sourceArray[i]] = score
        }
    }
    matches = Object.keys(matches).map(function(key) {return [key, matches[key]]})
    matches.sort(function(first, second) {return second[1] - first[1]})
    return matches
}

String.prototype.completeMatchSearch = function(searchTerm) {
    var string = this.toLowerCase();
    searchTerm = searchTerm.toLowerCase();
    var score = 0
    if (string.indexOf(searchTerm) > -1) {
        score = searchTerm.length/string.length
        } 
    return score
}

String.prototype.orderedMatchSearch = function(searchTerm) {
    var string = this.toLowerCase();
    var searchTermIdx = -1
    searchTerm = searchTerm.toLowerCase();
    for (let i = 0; i < searchTerm.length ; i++) {
        searchTermIdx = string.indexOf(searchTerm[i], searchTermIdx+1)
        if (searchTermIdx < 0) return 0.0
    }
    return searchTerm.length/this.length
}

String.prototype.unorderedMatchSearch = function(searchTerm) {
    var string = this.toLowerCase();
    var score = 0
    var matches = 0
    searchTerm = searchTerm.toLowerCase();
    for (var i = 0; i < searchTerm.length; i++) {
        if (string.indexOf(searchTerm[i]) > -1) {
            matches += 1
            string = string.substring(0, string.indexOf(searchTerm[i])) + string.substring(string.indexOf(searchTerm[i]) + 1)
        } else {
            matches -=1;
        }
    }
    score = matches/this.length
    return score
}