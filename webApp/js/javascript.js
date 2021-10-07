var Parser = {
	
    operators: ["!=", "=", ">=", "<=", ">", "<", "OR", "AND"],

    parseAndEvaluateExpression: function(ex) {
        var arr = ex.split("");
        for (var i = 0; i < arr.length; i++) {

            if (arr[i] !== " ") return this.parseWithStrings(ex);
            console.error("ERROR: Expression cannot be empty!");
            return false;
        }
    },

    evaluate: function(condition, vars) {
        // sort by key length
        var sortedVals = Object.keys(vars).sort(function(a,b){return b.length>a.length;});
        sortedVals.forEach(function(val){
            condition=RiskEvidenceConditionParser.replaceAll(condition,val+" ",vars[val]);
        });
        
		//error control
		if(condition.indexOf("OB_")>=0) {
			console.error("===ERROR in OB replacement===");
			console.error("--Condition:",condition);
			console.error("--Observable:",
			condition.substr(condition.indexOf("OB_"),5));
			return false;
		}
        return this.parseAndEvaluateExpression(condition);
    },

    parseWithStrings: function(s) {
        var op = this.determineOperatorPrecedenceAndLocation(s);
        var start = op[0];
        var left = s.substring(0, start).trim();
        var right = s.substring(op[1]).trim();
        var oper = s.substring(start, op[1]).trim();
        var logType = this.logicalOperatorType(oper);

        console.log("PARSE: Left: \"" + left + "\" Right: \"" + right + "\" Operator: \"" + oper + "\"");

        if (logType === 0) // encounters OR- recurse
            return this.parseWithStrings(left) || this.parseWithStrings(right);
        else if (logType === 1) // encounters AND- recurse
            return this.parseWithStrings(left) && this.parseWithStrings(right);
        var leftSansParen = this.removeParens(left);
        var rightSansParen = this.removeParens(right);
        if (this.isNumeric(leftSansParen) && this.isNumeric(rightSansParen))
            return this.evaluateFloat(parseFloat(leftSansParen), oper, parseFloat(rightSansParen));
        else return this.evaluateStr(leftSansParen, oper, rightSansParen); // assume they are strings
    },

    determineOperatorPrecedenceAndLocation: function(s) {
        s = s.trim();
        var minParens = 999999999999;
        var currentMin = null;
        for (var sampSize = 1; sampSize <= 3; sampSize++) {
            for (var locInStr = 0; locInStr < (s.length + 1) - sampSize; locInStr++) {
                var endIndex = locInStr + sampSize;
                var sub;
                if ((endIndex < s.length && s[endIndex] === '='))
                    sub = s.substring(locInStr, 2+endIndex).trim();
                else
                    sub = s.substring(locInStr, endIndex).trim();
                if (this.isOperator(sub)) {
                    // Idea here is to weight logical operators so that they will still be selected over other operators
                    // when no parens are present
                    var parens = (this.logicalOperatorType(sub) > -1) ? this.parens(s, locInStr) - 1 : this.parens(s, locInStr);
                    if (parens <= minParens) {
                        minParens = parens;
                        currentMin = [locInStr, endIndex, parens];
                    }
                }
            }
        }
        return currentMin;
    },

    logicalOperatorType: function(op) {
        if (op.trim()==="OR") {
            return 0;
        }
        else if (op.trim()==="AND") {
            return 1;
        }
        else {
            return -1;
        }
    },

    parens: function(s, loc) {
        var parens = 0;
        for (var i = 0; i < s.length; i++) {
            if (s[i] === '(' && i < loc)
                parens++;
            if (s[i] === ')' && i >= loc)
                parens++;
        }
        return parens;
    },

    removeParens: function(s) {
        s = s.trim();
        var keep="";
        s.split("").forEach(function(c){
            if (!(c === '(') && !(c === ')'))
                keep+=c;
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
        if (op==="=") {
            return left === right;
        }
        else if (op===">") {
            return left > right;
        }
        else if (op==="<") {
            return left < right;
        }
        else if (op==="<=") {
            return left <= right;
        }
        else if (op===">=") {
            return left >= right;
        }
        else if (op==="!=") {
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
        if (op=="=" || op=="!=" ) {
            return this.fixQuotes(left) === this.fixQuotes(right);
        } else {
            console.error("ERROR: Operator type not recognized." + left + " " +  op +  " " + right);
            return false;
        }
    }

};

var observableMap = {};
var measurementTypesMap = {};
var riskElementsMap = {};
var riskEvidencesMap = {};

function load(){

    let observablesURL = "https://devices.duth.carre-project.eu/sparql?default-graph-uri=http%3A%2F%2Fcarre.kmi.open.ac.uk%2Fcarreriskdata&query=PREFIX+xsd%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3EPREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3EPREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3EPREFIX+%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fontology%2Fsensors.owl%23%3EPREFIX+risk%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fontology%2Frisk.owl%23%3EPREFIX+carreManufacturer%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fmanufacturers%2F%3EPREFIX+carreUsers%3A+%3Chttps%3A%2F%2Fcarre.kmi.open.ac.uk%2Fusers%2F%3E%0D%0ASELECT+%3Fobservable%2C+%3Fname%2C+%3Fmeasurement%2C+%3Fmodifiable%2C+%28COUNT%28%3Frisk_evidence%29+AS+%3FcountRV%29+FROM+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fcarreriskdata%3E+%0D%0AWHERE+%7B++%0D%0A++%7B++++%3Fobservable+a+risk%3Aobservable%3Brisk%3Ahas_observable_name+%3Fname%3B%0D%0Arisk%3Ahas_observable_measurement_type+%3Fmeasurement.+OPTIONAL+%7B+%3Fobservable+risk%3Ahas_observable_modifiable_status+%3Fmodifiable+%7D+OPTIONAL+%7B%3Frisk_evidence+risk%3Ahas_risk_evidence_observable+%3Fobservable+%7D+FILTER+%28lang%28%3Fname%29%3D%27en%27%29%7D%7D&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on";
    let measurementTypesURL = "https://devices.duth.carre-project.eu/sparql?default-graph-uri=http%3A%2F%2Fcarre.kmi.open.ac.uk%2Fcarreriskdata&query=PREFIX+xsd%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3EPREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3EPREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3EPREFIX+%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fontology%2Fsensors.owl%23%3EPREFIX+risk%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fontology%2Frisk.owl%23%3EPREFIX+carreManufacturer%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fmanufacturers%2F%3EPREFIX+carreUsers%3A+%3Chttps%3A%2F%2Fcarre.kmi.open.ac.uk%2Fusers%2F%3E%0D%0ASELECT+DISTINCT+%2A+FROM+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fcarreriskdata%3E+%0D%0AWHERE+%7B++%0D%0A++%7B++++%3Fmeasurement_type+a+risk%3Ameasurement_type%3B+risk%3Ahas_measurement_type_name+%3Fname%3B+risk%3Ahas_datatype+%3Fdatatype.+OPTIONAL+%7B+%3Fmeasurement_type+risk%3Ahas_enumeration_values+%3Fenum_values.+FILTER+%28lang%28%3Fenum_values%29%3D%27en%27%29%7D+OPTIONAL+%7B+%3Fmeasurement_type+risk%3Ahas_label+%3Flabel.+FILTER+%28lang%28%3Flabel%29%3D%27en%27%29%7D%0D%0AFILTER+%28lang%28%3Fname%29%3D%27en%27%29%7D%7D&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on";
    let riskElementsURL = "https://devices.duth.carre-project.eu/sparql?default-graph-uri=http%3A%2F%2Fcarre.kmi.open.ac.uk%2Fcarreriskdata&query=PREFIX+xsd%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3EPREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3EPREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3EPREFIX+%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fontology%2Fsensors.owl%23%3EPREFIX+risk%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fontology%2Frisk.owl%23%3EPREFIX+carreManufacturer%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fmanufacturers%2F%3EPREFIX+carreUsers%3A+%3Chttps%3A%2F%2Fcarre.kmi.open.ac.uk%2Fusers%2F%3E%0D%0ASELECT+DISTINCT+%2A+FROM+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fcarreriskdata%3E+%0D%0AWHERE+%7B++%0D%0A++%7B++++%3Frisk_element+a+risk%3Arisk_element%3Brisk%3Ahas_risk_element_name+%3Fname%3B+risk%3Ahas_risk_element_modifiable_status+%3Fmodifiable.%0D%0AFILTER+%28lang%28%3Fname%29%3D%27en%27%29%7D%7D&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on";
    let riskEvidencesURL = "https://devices.duth.carre-project.eu/sparql?default-graph-uri=http%3A%2F%2Fcarre.kmi.open.ac.uk%2Fcarreriskdata&query=PREFIX+xsd%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3EPREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3EPREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3EPREFIX+%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fontology%2Fsensors.owl%23%3EPREFIX+risk%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fontology%2Frisk.owl%23%3EPREFIX+carreManufacturer%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fmanufacturers%2F%3EPREFIX+carreUsers%3A+%3Chttps%3A%2F%2Fcarre.kmi.open.ac.uk%2Fusers%2F%3ESELECT+DISTINCT+%3Frisk_evidence+%3Fcondition+%3Fconfidence_interval_min+%3Fconfidence_interval_max+%3Frisk_evidence_ratio_value+%3Frisk_evidence_ratio_type+%3Frisk_factor+%3Fhas_risk_factor_source+%3Fhas_risk_factor_target+%3Fhas_risk_factor_association_type+FROM+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fcarreriskdata%3E+WHERE+%7B++%0D%0A++%3Frisk_evidence+a+risk%3Arisk_evidence+%3B++++%0D%0A+++risk%3Ahas_risk_factor+%3Frisk_factor%3B%0D%0A++++risk%3Ahas_risk_evidence_ratio_type+%3Frisk_evidence_ratio_type%3B+%0D%0A+++++++++risk%3Ahas_risk_evidence_ratio_value+%3Frisk_evidence_ratio_value.++++++%0D%0A+++++++++OPTIONAL+%7B+%3Frisk_evidence+risk%3Ahas_confidence_interval_max+%3Fconfidence_interval_max%3B+%0D%0A+++++++++++++risk%3Ahas_confidence_interval_min+%3Fconfidence_interval_min.+%7D++++++%0D%0A+++++++++++++%3Frisk_evidence+risk%3Ahas_risk_evidence_observable+%3Fob+%3B+%0D%0A+++++++++++++risk%3Ahas_observable_condition+%3Fcondition+.++++%0D%0A+++++++++++++%23details+for+risk+factor++++%0D%0A+++++++++++++%3Frisk_factor+risk%3Ahas_risk_factor_association_type+%3Fhas_risk_factor_association_type%3B++++%0D%0A+++++++++++++risk%3Ahas_risk_factor_source+%3Fhas_risk_factor_source%3B++++%0D%0A+++++++++++++risk%3Ahas_risk_factor_target+%3Fhas_risk_factor_target.++++++%7D&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on";
    
   
    var mapObvSort = {};

    // fetch observables JSON from URL
    fetch(observablesURL)
    .then(res => res.json())
    .then((observables) => {

        var string = JSON.stringify(observables);
        const obj = JSON.parse(string);
        
        const obv = obj.results.bindings;

        Object.entries(obv).forEach((entry) => {
            const [key, value] = entry;

            var obvName = value.name.value;
            var obvCountRV =  value.countRV.value;
            
            var obvID = value.observable.value;
            var x = obvID.search('OB');
            var obvIDFinal = obvID.substr(x, x + 2);

            var obvMesID = value.measurement.value;
            var y = obvMesID.search('ME');
            var obvMesIDFinal = obvMesID.substr(y, y + 2);
           
            observableMap[obvIDFinal] = [obvMesIDFinal, obvName, obvCountRV];

        });
        
        // Solution 1: sort observables map - count rvs 
        // observableMap[Symbol.iterator] = function* () {
        //     yield* [...Object.entries( observableMap)].sort((a, b) => (a[1])[2] - (b[1])[2]);
        // }
        // console.log([...observableMap]);

        // Solution 2: sort observables map - count rvs 
        // mapObvSort = new Map([...Object.entries(observableMap)].sort((a, b) => (a[1])[2] - (b[1])[2]));
        // console.log(mapObvSort);
        
        // map OB id with count rv
        // var mapRV = {};

        // var keys = Object.keys(observableMap);
        // keys.forEach(k=>{
        //     var valueRV = parseInt((observableMap[k])[2]);
        //     mapRV[k] = valueRV;   
        // });

        // // Solution 3: sort map rv 
        // mapRV[Symbol.iterator] = function* () {
        //     yield* [...Object.entries(mapRV)].sort((a, b) => a[1] - b[1]);
        // }
        // console.log([...mapRV]);  

        // Solution 4: sort map rv 
        // const mapRVSort = new Map([...Object.entries(mapRV)].sort((a, b) => b[1] - a[1]));
        // console.log(mapRVSort);
    })

    // fetch measurement types JSON from URL
    fetch(measurementTypesURL)
    .then(res => res.json())
    .then((measurementTypes) => {

        var string = JSON.stringify(measurementTypes);
        const obj = JSON.parse(string);
        
        const mes = obj.results.bindings;

        Object.entries(mes).forEach((entry) => {
            const [key, value] = entry;
            
            var mesLabel;
            
            var mesID = value.measurement_type.value;
            var x = mesID.search('ME');
            var mesIDFinal = mesID.substr(x, x + 2);

            var mesType = value.datatype.value;
            var x = mesType.search('#');
            var datatype = mesType.slice(x + 1);

            
            if(datatype.valueOf() == 'enum'.valueOf() || datatype.valueOf() == 'boolean'.valueOf()){
                mesLabel = value.enum_values.value.split(';');
                
            }
            else if(mesIDFinal.valueOf() == "ME_25".valueOf()){
                mesLabel = "----";
            }
            else{
                mesLabel = value.label.value;
            }
                      
            measurementTypesMap[mesIDFinal] = [datatype, mesLabel];
        });

        observableMap[Symbol.iterator] = function* () {
            yield* [...Object.entries( observableMap)].sort((a, b) => (a[1])[2] - (b[1])[2]);
        }

        var container = document.getElementById("container");

        // find ME that for each OB 
        var keys = Object.keys([...observableMap]);
        keys.forEach(key =>{
            // TODO
            if(parseInt([...observableMap][key][1][2]) > 20){
                var mesID = [...observableMap][key][1][0];   

                // console.log(measurementTypesMap[mesID]);

                if(((measurementTypesMap[mesID])[0]).valueOf() == 'enum'.valueOf() ||
                   ((measurementTypesMap[mesID])[0]).valueOf() == 'boolean'.valueOf()){

                    // Create an <input> element, set its type and name attributes
                    var select = document.createElement("select");
                    select.id = [...observableMap][key][1][1];

                    // TODO fix select - required (not working)
                    // select.required = true;
                    var option = document.createElement('option');

                    option.disabled = true;
                    option.selected = true;
                    option.innerHTML = [...observableMap][key][1][1];
                    select.appendChild(option);

                    var countID = 0;
                    ((measurementTypesMap[mesID])[1]).forEach(async function(mes) {
                        
                        option = document.createElement('option');
                        
                        option.id = [...observableMap][key][0] + (countID++);

                        option.class = "dropdown-content";
                        option.innerHTML = mes;

                        select.appendChild(option);
                    })

                    //TODO selects in reversed order
                    // container.prepend(select);

                    container.appendChild(select);
                    
                    console.log(container);
                }

                else {
                    // Create an <input> element, set its type and name attributes
                    var input = document.createElement("input");

                    input.type = "text";
                    input.className = 'form-text';
                    input.placeholder = ([...observableMap][key])[1][1];
                    input.id = [...observableMap][key][0];

                    container.appendChild(input);
                }
                
                // Append a line break 
                container.appendChild(document.createElement("br"));
            }
            
        });

    })

    fetch(riskElementsURL)
    .then(res => res.json())
    .then((elements) => {

        var string = JSON.stringify(elements);
        const obj = JSON.parse(string);
        
        const ele = obj.results.bindings;

        Object.entries(ele).forEach((entry) => {
            const [key, value] = entry;

            var riskName = value.name.value;
            
            var riskID = value.risk_element.value;
            var x = riskID.search('RL');
            var riskIDFinal = riskID.substr(x, x + 2);
           
            riskElementsMap[riskIDFinal] = [riskName];
        });
    })

    fetch(riskEvidencesURL)
    .then(res => res.json())
    .then((evidences) => {

        var string = JSON.stringify(evidences);
        const obj = JSON.parse(string);
        
        const ev = obj.results.bindings;

        Object.entries(ev).forEach((entry) => {
            const [key, value] = entry;

            var condition = value.condition.value;
            // var min = value.confidece_interval_min.value;
            // var max = value.confidece_interval_max.value;
            var average = value.risk_evidence_ratio_value.value;
            
            var evidence = value.risk_evidence.value;
            var z = evidence.search('RV');
            var evidenceID = evidence.substr(z, z + 2);

            var source = value.has_risk_factor_source.value;
            var x = source.search('RL');
            var sourceID = source.substr(x, x + 2);

            var target = value.has_risk_factor_target.value;
            var y = target.search('RL');
            var targetID = target.substr(y, y + 2);
           
            riskEvidencesMap[evidenceID] = [condition, sourceID, targetID, average];
            // console.log(Parser.parseAndEvaluateExpression(condition));
        });
    
    })

    console.log(riskEvidencesMap);
}

function parse(){
    var selects =  document.getElementsByTagName('select');
    var inputs = document.getElementsByTagName('input');
    
    for (var i = 0; i < selects.length; i++) {
        console.log(selects[i].value);
    }

    for (var i = 0; i < inputs.length; i++) {
        console.log(inputs[i].value);
    }
}