// ex = ( body mass index < 40 AND body mass index >= 35 ) AND sex = 'female'

var Parser = {
	
    age : 0,
    sex : { OTHER: "other", MALE: "male", FEMALE: "female"},
    operators: ["!=", "=", ">=", "<=", ">", "<", "OR", "AND"],

    parseValues: function(){
        this.age = document.getElementById("ageInput").value;
        this.sex = document.getElementById("sexInput").value;

        var ex = "age <= 64 AND age >= 60 AND sex = 'male'";

        // console.log(Parser.replaceValues(ex));
        console.log(Parser.parseAndEvaluate(Parser.replaceValues(ex)));
    },

    replaceValues: function (ex){
        var expression = ex;

        if (ex.search("age") != -1){
            
            expression = expression.replace(/age/g, this.age);
        }
        if (ex.search("sex") != -1){
            
            expression = expression.replace(/sex/g, this.sex);
        }
        
        return expression;
    },

    // parse and evaluate an expression 
    // (ex. sex = 'female' AND age > 30)
    parseAndEvaluate: function(ex) {
        var array = ex.split(" ");
        for (var i = 0; i < array.length; i++) {
            
            // if the parsed array is not empty
            // continue with the evaluation of the strings
            if (array[i] !== " "){
                return this.parse(ex);
            } 

            console.error("ERROR: Expression cannot be empty!");
            return false;
        }
    },


    parse: function(ex) {
        var op = this.operatorDetails(ex);
        var start = op[0];
        var left = ex.substring(0, start).trim();
        var right = ex.substring(op[1]).trim();
        var oper = ex.substring(start, op[1]).trim();
        var opType = this.logicalOperatorType(oper);

        // console.log("PARSE: Left: \"" + left + "\" Right: \"" + right + "\" Operator: \"" + oper + "\"");

        if (opType === 0){
            return this.parse(left) || this.parse(right);
        }

        else if (opType === 1){
            return this.parse(left) && this.parse(right);
        } 

        var left = this.removeParens(left);
        var right = this.removeParens(right);
        // console.log(right);


        if (this.isNumeric(left) && this.isNumeric(right)){
            return this.evaluateFloat(parseFloat(left), oper, parseFloat(right));
        }
        else {
            return this.evaluateStr(left, oper, right); // assume they are strings
        }
    },

    // determine operator precedence and location
    operatorDetails: function(ex) {
        ex = ex.trim();

        var minParens = 999999999999;
        var currentMin = null;

        for (var size = 1; size <= 3; size++) {
            for (var location = 0; location < (ex.length + 1) - size; location++) {

                var endIndex = location + size;
                var sub;

                if ((endIndex < ex.length && ex[endIndex] === '=')){
                    sub = ex.substring(location, 2 + endIndex).trim();
                }

                else {
                    sub = ex.substring(location, endIndex).trim();
                }

                if (this.isOperator(sub)) {
                    
                    // Idea here is to weight logical operators so that they will still be selected over other operators
                    // when no parens are present
                    var parens = (this.logicalOperatorType(sub) > -1) ? this.parens(ex, location) - 1 : this.parens(ex, location);

                    if (parens <= minParens) {

                        minParens = parens;
                        currentMin = [location, endIndex, parens];
                    }
                }
            }
        }

        return currentMin;
    },

    // return 0  : if operator (op) == OR
    // return 1  : if operator (op) == AND
    // return -1 : otherwise
    logicalOperatorType: function(op) {
        if (op.trim() === "OR") {
            return 0;
        }
        else if (op.trim() === "AND") {
            return 1;
        }
        else {
            return -1;
        }
    },

    parens: function(ex, location) {

        var parens = 0;

        for (var i = 0; i < ex.length; i++){

            if (ex[i] === '(' && i < location){
                parens++;
            }

            if (ex[i] === ')' && i >= location){
                parens++;
            }
        }

        return parens;
    },

    // remove parentheses from expression
    removeParens: function(s) {

        s = s.trim();
        var keep="";

        s.split("").forEach(function(c){

            if (!(c === '(') && !(c === ')'))
                keep += c;
        });

        return keep.toString().trim();
    },
    
    replaceAll: function(target, search, replacement) {
    	return target.split(search).join(replacement);
	},

    isOperator: function(op) {
        return this.operators.indexOf(op.trim())>=0;
    },

    isNumeric: function(s) {
  		return !isNaN(parseFloat(s)) && isFinite(s);
    },

    evaluateFloat: function(left, op, right) {

        if (op === "=") {
            return left === right;
        }
        else if (op === ">") {
            return left > right;
        }
        else if (op === "<") {
            return left < right;
        }
        else if (op === "<=") {
            return left <= right;
        }
        else if (op === ">=") {
            return left >= right;
        }
        else if (op === "!=") {
            return left != right;
        }
        else {
            console.error("ERROR: Operator type not recognized.");
            return false;
        }
    },
    
    fixQuotes: function(str){
        return str.replace(/['"]+/g, '');   
    },

    evaluateStr: function(left, op, right) {

        if (op === "=" || op=== "!=" ) {
            return this.fixQuotes(left) === this.fixQuotes(right);
        } 
        
        else {
            console.error("ERROR: Operator type not recognized." + left + " " +  op +  " " + right);
            return false;
        }
    }
};




// console.log(ex.replace(/age/g, '15'));
// console.log(Parser.parseAndEvaluate(Parser.));
