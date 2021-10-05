// // ex = ( body mass index < 40 AND body mass index >= 35 ) AND sex = 'female'

// var Parser = {
	
//     age : 0,
//     sex : { OTHER: "other", MALE: "male", FEMALE: "female"},
//     operators: ["!=", "=", ">=", "<=", ">", "<", "OR", "AND"],

//     parseValues: function(){
//         this.age = document.getElementById("intInput").value;
//         this.sex = document.getElementById("dropdownInput").value;

//         var ex = "age <= 64 AND age >= 60 AND sex = 'male'";

//         // console.log(Parser.replaceValues(ex));
//         console.log(Parser.parseAndEvaluate(Parser.replaceValues(ex)));
//     },

//     replaceValues: function (ex){
//         var expression = ex;

//         if (ex.search("age") != -1){
            
//             expression = expression.replace(/age/g, this.age);
//         }
//         if (ex.search("sex") != -1){
            
//             expression = expression.replace(/sex/g, this.sex);
//         }
        
//         return expression;
//     },

//     // parse and evaluate an expression 
//     // (ex. sex = 'female' AND age > 30)
//     parseAndEvaluate: function(ex) {
//         var array = ex.split(" ");
//         for (var i = 0; i < array.length; i++) {
            
//             // if the parsed array is not empty
//             // continue with the evaluation of the strings
//             if (array[i] !== " "){
//                 return this.parse(ex);
//             } 

//             console.error("ERROR: Expression cannot be empty!");
//             return false;
//         }
//     },


//     parse: function(ex) {
//         var op = this.operatorDetails(ex);
//         var start = op[0];
//         var left = ex.substring(0, start).trim();
//         var right = ex.substring(op[1]).trim();
//         var oper = ex.substring(start, op[1]).trim();
//         var opType = this.logicalOperatorType(oper);

//         // console.log("PARSE: Left: \"" + left + "\" Right: \"" + right + "\" Operator: \"" + oper + "\"");

//         if (opType === 0){
//             return this.parse(left) || this.parse(right);
//         }

//         else if (opType === 1){
//             return this.parse(left) && this.parse(right);
//         } 

//         var left = this.removeParens(left);
//         var right = this.removeParens(right);
//         // console.log(right);


//         if (this.isNumeric(left) && this.isNumeric(right)){
//             return this.evaluateFloat(parseFloat(left), oper, parseFloat(right));
//         }
//         else {
//             return this.evaluateStr(left, oper, right); // assume they are strings
//         }
//     },

//     // determine operator precedence and location
//     operatorDetails: function(ex) {
//         ex = ex.trim();

//         var minParens = 999999999999;
//         var currentMin = null;

//         for (var size = 1; size <= 3; size++) {
//             for (var location = 0; location < (ex.length + 1) - size; location++) {

//                 var endIndex = location + size;
//                 var sub;

//                 if ((endIndex < ex.length && ex[endIndex] === '=')){
//                     sub = ex.substring(location, 2 + endIndex).trim();
//                 }

//                 else {
//                     sub = ex.substring(location, endIndex).trim();
//                 }

//                 if (this.isOperator(sub)) {
                    
//                     // Idea here is to weight logical operators so that they will still be selected over other operators
//                     // when no parens are present
//                     var parens = (this.logicalOperatorType(sub) > -1) ? this.parens(ex, location) - 1 : this.parens(ex, location);

//                     if (parens <= minParens) {

//                         minParens = parens;
//                         currentMin = [location, endIndex, parens];
//                     }
//                 }
//             }
//         }

//         return currentMin;
//     },

//     // return 0  : if operator (op) == OR
//     // return 1  : if operator (op) == AND
//     // return -1 : otherwise
//     logicalOperatorType: function(op) {
//         if (op.trim() === "OR") {
//             return 0;
//         }
//         else if (op.trim() === "AND") {
//             return 1;
//         }
//         else {
//             return -1;
//         }
//     },

//     parens: function(ex, location) {

//         var parens = 0;

//         for (var i = 0; i < ex.length; i++){

//             if (ex[i] === '(' && i < location){
//                 parens++;
//             }

//             if (ex[i] === ')' && i >= location){
//                 parens++;
//             }
//         }

//         return parens;
//     },

//     // remove parentheses from expression
//     removeParens: function(s) {

//         s = s.trim();
//         var keep="";

//         s.split("").forEach(function(c){

//             if (!(c === '(') && !(c === ')'))
//                 keep += c;
//         });

//         return keep.toString().trim();
//     },
    
//     replaceAll: function(target, search, replacement) {
//     	return target.split(search).join(replacement);
// 	},

//     isOperator: function(op) {
//         return this.operators.indexOf(op.trim())>=0;
//     },

//     isNumeric: function(s) {
//   		return !isNaN(parseFloat(s)) && isFinite(s);
//     },

//     evaluateFloat: function(left, op, right) {

//         if (op === "=") {
//             return left === right;
//         }
//         else if (op === ">") {
//             return left > right;
//         }
//         else if (op === "<") {
//             return left < right;
//         }
//         else if (op === "<=") {
//             return left <= right;
//         }
//         else if (op === ">=") {
//             return left >= right;
//         }
//         else if (op === "!=") {
//             return left != right;
//         }
//         else {
//             console.error("ERROR: Operator type not recognized.");
//             return false;
//         }
//     },
    
//     fixQuotes: function(str){
//         return str.replace(/['"]+/g, '');   
//     },

//     evaluateStr: function(left, op, right) {

//         if (op === "=" || op=== "!=" ) {
//             return this.fixQuotes(left) === this.fixQuotes(right);
//         } 
        
//         else {
//             console.error("ERROR: Operator type not recognized." + left + " " +  op +  " " + right);
//             return false;
//         }
//     }
// };




// console.log(ex.replace(/age/g, '15'));
// console.log(Parser.parseAndEvaluate(Parser.));


// ex = "( body mass index < 40 AND body mass index >= 35 ) AND sex = 'female'";


// var RiskEvidenceConditionParser = {
	
//     operators: ["!=", "=", ">=", "<=", ">", "<", "OR", "AND"],

//     parseAndEvaluateExpression: function(ex) {
//         var arr = ex.split("");
//         for (var i = 0; i < arr.length; i++) {

//             if (arr[i] !== " ") return this.parseWithStrings(ex);
//             console.error("ERROR: Expression cannot be empty!");
//             return false;
//         }
//     },

//     evaluate: function(condition, vars) {
//         // sort by key length
//         var sortedVals = Object.keys(vars).sort(function(a,b){return b.length>a.length;});
//         sortedVals.forEach(function(val){
//             condition=RiskEvidenceConditionParser.replaceAll(condition,val+" ",vars[val]);
//         });
        
// 		//error control
// 		if(condition.indexOf("OB_")>=0) {
// // 			console.error("===ERROR in OB replacement===");
// // 			console.error("--Condition:",condition);
// // 			console.error("--Observable:",
// // 			condition.substr(condition.indexOf("OB_"),5));
// 			return false;
// 		}
//         return this.parseAndEvaluateExpression(condition);
//     },

//     parseWithStrings: function(s) {
//         var op = this.determineOperatorPrecedenceAndLocation(s);
//         var start = op[0];
//         var left = s.substring(0, start).trim();
//         var right = s.substring(op[1]).trim();
//         var oper = s.substring(start, op[1]).trim();
//         var logType = this.logicalOperatorType(oper);

//         // console.log("PARSE: Left: \"" + left + "\" Right: \"" + right + "\" Operator: \"" + oper + "\"");

//         if (logType === 0) // encounters OR- recurse
//             return this.parseWithStrings(left) || this.parseWithStrings(right);
//         else if (logType === 1) // encounters AND- recurse
//             return this.parseWithStrings(left) && this.parseWithStrings(right);
//         var leftSansParen = this.removeParens(left);
//         var rightSansParen = this.removeParens(right);
//         if (this.isNumeric(leftSansParen) && this.isNumeric(rightSansParen))
//             return this.evaluateFloat(parseFloat(leftSansParen), oper, parseFloat(rightSansParen));
//         else return this.evaluateStr(leftSansParen, oper, rightSansParen); // assume they are strings
//     },

//     determineOperatorPrecedenceAndLocation: function(s) {
//         s = s.trim();
//         var minParens = 999999999999;
//         var currentMin = null;
//         for (var sampSize = 1; sampSize <= 3; sampSize++) {
//             for (var locInStr = 0; locInStr < (s.length + 1) - sampSize; locInStr++) {
//                 var endIndex = locInStr + sampSize;
//                 var sub;
//                 if ((endIndex < s.length && s[endIndex] === '='))
//                     sub = s.substring(locInStr, 2+endIndex).trim();
//                 else
//                     sub = s.substring(locInStr, endIndex).trim();
//                 if (this.isOperator(sub)) {
//                     // Idea here is to weight logical operators so that they will still be selected over other operators
//                     // when no parens are present
//                     var parens = (this.logicalOperatorType(sub) > -1) ? this.parens(s, locInStr) - 1 : this.parens(s, locInStr);
//                     if (parens <= minParens) {
//                         minParens = parens;
//                         currentMin = [locInStr, endIndex, parens];
//                     }
//                 }
//             }
//         }
//         return currentMin;
//     },

//     logicalOperatorType: function(op) {
//         if (op.trim()==="OR") {
//             return 0;
//         }
//         else if (op.trim()==="AND") {
//             return 1;
//         }
//         else {
//             return -1;
//         }
//     },

//     parens: function(s, loc) {
//         var parens = 0;
//         for (var i = 0; i < s.length; i++) {
//             if (s[i] === '(' && i < loc)
//                 parens++;
//             if (s[i] === ')' && i >= loc)
//                 parens++;
//         }
//         return parens;
//     },

//     removeParens: function(s) {
//         s = s.trim();
//         var keep="";
//         s.split("").forEach(function(c){
//             if (!(c === '(') && !(c === ')'))
//                 keep+=c;
//         });
//         return keep.toString().trim();
//     },
    
//     replaceAll: function(target, search, replacement) {
//     	return target.split(search).join(replacement);
// 	},

//     isOperator: function(op) {
//         return this.operators.indexOf(op.trim())>=0;
//     },

//     isNumeric: function(s) {
//   		return !isNaN(parseFloat(s)) && isFinite(s);
//     },

//     evaluateFloat: function(left, op, right) {
//         if (op==="=") {
//             return left === right;
//         }
//         else if (op===">") {
//             return left > right;
//         }
//         else if (op==="<") {
//             return left < right;
//         }
//         else if (op==="<=") {
//             return left <= right;
//         }
//         else if (op===">=") {
//             return left >= right;
//         }
//         else if (op==="!=") {
//             return left != right;
//         }
//         else {
//             console.error("ERROR: Operator type not recognized.");
//             return false;
//         }
//     },
    
//     fixQuotes: function(str){
//       return str.replace(/['"]+/g, '');
        
//     },

//     evaluateStr: function(left, op, right) {
//         if (op==="=" || op==="!=" ) {
//             return this.fixQuotes(left)===this.fixQuotes(right);
//         } else {
//             console.error("ERROR: Operator type not recognized." + left + " " +  op +  " " + right);
//             return false;
//         }
//     }

// };

