var Parser = {

    operators: ["!=", "=", ">=", "<=", ">", "<", "OR", "AND"],

    parseAndEvaluateExpression: function (ex) {
        var arr = ex.split("");
        for (var i = 0; i < arr.length; i++) {

            if (arr[i] !== " ") return this.parseWithStrings(ex);
            console.error("ERROR: Expression cannot be empty!");
            return false;
        }
    },

    evaluate: function (condition, vars) {
        // sort by key length
        var sortedVals = Object.keys(vars).sort(function (a, b) {
            return b.length > a.length;
        });

        sortedVals.forEach(function (val) {
            condition = Parser.replaceAll(condition, val + " ", vars[val]);
        });

        //error control
        if (condition.indexOf("OB_") >= 0) {
            console.error("===ERROR in OB replacement===");
            console.error("--Condition:", condition);
            console.error("--Observable:",
                condition.substr(condition.indexOf("OB_"), 5));
            return false;
        }

        return this.parseAndEvaluateExpression(condition);
    },

    parseWithStrings: function (s) {
        var op = this.determineOperatorPrecedenceAndLocation(s);
        var start = op[0];
        var left = s.substring(0, start).trim();
        var right = s.substring(op[1]).trim();
        var oper = s.substring(start, op[1]).trim();
        var logType = this.logicalOperatorType(oper);

        // console.log("PARSE: Left: \"" + left + "\" Right: \"" + right + "\" Operator: \"" + oper + "\"");

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

    determineOperatorPrecedenceAndLocation: function (s) {
        s = s.trim();
        var minParens = 999999999999;
        var currentMin = null;
        for (var sampSize = 1; sampSize <= 3; sampSize++) {
            for (var locInStr = 0; locInStr < (s.length + 1) - sampSize; locInStr++) {
                var endIndex = locInStr + sampSize;
                var sub;
                if ((endIndex < s.length && s[endIndex] === '='))
                    sub = s.substring(locInStr, 2 + endIndex).trim();
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

    logicalOperatorType: function (op) {
        if (op.trim() === "OR") {
            return 0;
        } else if (op.trim() === "AND") {
            return 1;
        } else {
            return -1;
        }
    },

    parens: function (s, loc) {
        var parens = 0;
        for (var i = 0; i < s.length; i++) {
            if (s[i] === '(' && i < loc)
                parens++;
            if (s[i] === ')' && i >= loc)
                parens++;
        }
        return parens;
    },

    removeParens: function (s) {
        s = s.trim();
        var keep = "";
        s.split("").forEach(function (c) {
            if (!(c === '(') && !(c === ')'))
                keep += c;
        });
        return keep.toString().trim();
    },

    replaceAll: function (target, search, replacement) {
        return target.split(search).join(replacement);
    },

    isOperator: function (op) {
        return this.operators.indexOf(op.trim()) >= 0;
    },

    isNumeric: function (s) {
        return !isNaN(parseFloat(s)) && isFinite(s);
    },

    evaluateFloat: function (left, op, right) {
        if (op === "=") {
            return left === right;
        } else if (op === ">") {
            return left > right;
        } else if (op === "<") {
            return left < right;
        } else if (op === "<=") {
            return left <= right;
        } else if (op === ">=") {
            return left >= right;
        } else if (op === "!=") {
            return left != right;
        } else {
            // console.error("ERROR: Operator type not recognized.");
            return false;
        }
    },

    fixQuotes: function (str) {
        return str.replace(/['"]+/g, '');

    },

    evaluateStr: function (left, op, right) {
        if (op == "=" || op == "!=") {
            return this.fixQuotes(left) === this.fixQuotes(right);
        } else {
            // console.error("ERROR: Operator type not recognized: " + left + " " +  op +  " " + right);
            return false;
        }
    }

};

// Observable ID -> observable details
var observableMap = {};

// measurement type ID -> measurement type details
var measurementTypesMap = {};

// Risk element ID -> risk element name
var riskElementsMap = {};

// Risk evidence ID -> risk evidence details
var riskEvidencesMap = {};

window.addEventListener("load", function () {


    let observablesURL = "https://devices.duth.carre-project.eu/sparql?default-graph-uri=http%3A%2F%2Fcarre.kmi.open.ac.uk%2Fnous&query=PREFIX+xsd%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3EPREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3EPREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3EPREFIX+%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fontology%2Fsensors.owl%23%3EPREFIX+risk%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fontology%2Frisk.owl%23%3EPREFIX+carreManufacturer%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fmanufacturers%2F%3EPREFIX+carreUsers%3A+%3Chttps%3A%2F%2Fcarre.kmi.open.ac.uk%2Fusers%2F%3E%0D%0ASELECT+%3Fobservable%2C+%3Fname%2C+%3Fmeasurement%2C+%3Fmodifiable%2C+%28COUNT%28%3Frisk_evidence%29+AS+%3FcountRV%29+FROM+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fnous%3E+%0D%0AWHERE+%7B++%0D%0A++%7B++++%3Fobservable+a+risk%3Aobservable%3Brisk%3Ahas_observable_name+%3Fname%3B%0D%0Arisk%3Ahas_observable_measurement_type+%3Fmeasurement.+OPTIONAL+%7B+%3Fobservable+risk%3Ahas_observable_modifiable_status+%3Fmodifiable+%7D+OPTIONAL+%7B%3Frisk_evidence+risk%3Ahas_risk_evidence_observable+%3Fobservable+%7D+FILTER+%28lang%28%3Fname%29%3D%27en%27%29%7D%7D&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on";
    let measurementTypesURL = "https://devices.duth.carre-project.eu/sparql?default-graph-uri=http%3A%2F%2Fcarre.kmi.open.ac.uk%2Fnous&query=PREFIX+xsd%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3EPREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3EPREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3EPREFIX+%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fontology%2Fsensors.owl%23%3EPREFIX+risk%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fontology%2Frisk.owl%23%3EPREFIX+carreManufacturer%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fmanufacturers%2F%3EPREFIX+carreUsers%3A+%3Chttps%3A%2F%2Fcarre.kmi.open.ac.uk%2Fusers%2F%3E%0D%0ASELECT+DISTINCT+%2A+FROM+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fnous%3E+%0D%0AWHERE+%7B++%0D%0A++%7B++++%3Fmeasurement_type+a+risk%3Ameasurement_type%3B+risk%3Ahas_measurement_type_name+%3Fname%3B+risk%3Ahas_datatype+%3Fdatatype.+OPTIONAL+%7B+%3Fmeasurement_type+risk%3Ahas_enumeration_values+%3Fenum_values.+FILTER+%28lang%28%3Fenum_values%29%3D%27en%27%29%7D+OPTIONAL+%7B+%3Fmeasurement_type+risk%3Ahas_label+%3Flabel.+FILTER+%28lang%28%3Flabel%29%3D%27en%27%29%7D%0D%0AFILTER+%28lang%28%3Fname%29%3D%27en%27%29%7D%7D&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on";
    let riskElementsURL = "https://devices.duth.carre-project.eu/sparql?default-graph-uri=http%3A%2F%2Fcarre.kmi.open.ac.uk%2Fnous&query=PREFIX+xsd%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3EPREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3EPREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3EPREFIX+%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fontology%2Fsensors.owl%23%3EPREFIX+risk%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fontology%2Frisk.owl%23%3EPREFIX+carreManufacturer%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fmanufacturers%2F%3EPREFIX+carreUsers%3A+%3Chttps%3A%2F%2Fcarre.kmi.open.ac.uk%2Fusers%2F%3E%0D%0ASELECT+DISTINCT+%2A+FROM+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fnous%3E+%0D%0AWHERE+%7B++%0D%0A++%7B++++%3Frisk_element+a+risk%3Arisk_element%3Brisk%3Ahas_risk_element_name+%3Fname%3B+risk%3Ahas_risk_element_modifiable_status+%3Fmodifiable.%0D%0AFILTER+%28lang%28%3Fname%29%3D%27en%27%29%7D%7D&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on";
    let riskEvidencesURL = "https://devices.duth.carre-project.eu/sparql?default-graph-uri=http%3A%2F%2Fcarre.kmi.open.ac.uk%2Fnous&query=PREFIX+xsd%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3EPREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3EPREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3EPREFIX+%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fontology%2Fsensors.owl%23%3EPREFIX+risk%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fontology%2Frisk.owl%23%3EPREFIX+carreManufacturer%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fmanufacturers%2F%3EPREFIX+carreUsers%3A+%3Chttps%3A%2F%2Fcarre.kmi.open.ac.uk%2Fusers%2F%3ESELECT+DISTINCT+%3Frisk_evidence+%3Fcondition+%3Fconfidence_interval_min+%3Fconfidence_interval_max+%3Frisk_evidence_ratio_value+%3Frisk_evidence_ratio_type+%3Frisk_factor+%3Fhas_risk_factor_source+%3Fhas_risk_factor_target+%3Fhas_risk_factor_association_type+FROM+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fnous%3E+WHERE+%7B++%0D%0A++%3Frisk_evidence+a+risk%3Arisk_evidence+%3B++++%0D%0A+++risk%3Ahas_risk_factor+%3Frisk_factor%3B%0D%0A++++risk%3Ahas_risk_evidence_ratio_type+%3Frisk_evidence_ratio_type%3B+%0D%0A+++++++++risk%3Ahas_risk_evidence_ratio_value+%3Frisk_evidence_ratio_value.++++++%0D%0A+++++++++OPTIONAL+%7B+%3Frisk_evidence+risk%3Ahas_confidence_interval_max+%3Fconfidence_interval_max%3B+%0D%0A+++++++++++++risk%3Ahas_confidence_interval_min+%3Fconfidence_interval_min.+%7D++++++%0D%0A+++++++++++++%3Frisk_evidence+risk%3Ahas_risk_evidence_observable+%3Fob+%3B+%0D%0A+++++++++++++risk%3Ahas_observable_condition+%3Fcondition+.++++%0D%0A+++++++++++++%23details+for+risk+factor++++%0D%0A+++++++++++++%3Frisk_factor+risk%3Ahas_risk_factor_association_type+%3Fhas_risk_factor_association_type%3B++++%0D%0A+++++++++++++risk%3Ahas_risk_factor_source+%3Fhas_risk_factor_source%3B++++%0D%0A+++++++++++++risk%3Ahas_risk_factor_target+%3Fhas_risk_factor_target.++++++%7D&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on";


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
                var obvCountRV = value.countRV.value;

                var obvID = value.observable.value;
                var x = obvID.search('OB');
                var obvIDFinal = obvID.substr(x, x + 2);

                var obvMesID = value.measurement.value;
                var y = obvMesID.search('ME');
                var obvMesIDFinal = obvMesID.substr(y, y + 2);

                observableMap[obvIDFinal] = [obvMesIDFinal, obvName, obvCountRV];

            });
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


                if (datatype.valueOf() == 'enum'.valueOf() || datatype.valueOf() == 'boolean'.valueOf()) {
                    mesLabel = value.enum_values.value.split(';');

                } else if (mesIDFinal.valueOf() == "ME_25".valueOf()) {
                    mesLabel = "----";
                } else {
                    mesLabel = value.label.value;
                }

                measurementTypesMap[mesIDFinal] = [datatype, mesLabel];
            });

            observableMap[Symbol.iterator] = function* () {
                yield*[...Object.entries(observableMap)].sort((a, b) => (a[1])[2] - (b[1])[2]);
            }

            var container = document.getElementById("container");

            // find ME that for each OB 
            var keys = Object.keys([...observableMap]);
            keys.forEach(key => {
                // TODO
                if (parseInt([...observableMap][key][1][2]) > 0) {
                    var mesID = [...observableMap][key][1][0];

                    // console.log(measurementTypesMap[mesID]);

                    if (((measurementTypesMap[mesID])[0]).valueOf() == 'enum'.valueOf() ||
                        ((measurementTypesMap[mesID])[0]).valueOf() == 'boolean'.valueOf()) {

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

                        ((measurementTypesMap[mesID])[1]).forEach(async function (mes) {

                            option = document.createElement('option');

                            option.id = [...observableMap][key][0];

                            option.class = "dropdown-content";
                            option.innerHTML = mes;

                            select.appendChild(option);
                        })

                        //TODO selects in reversed order
                        // container.prepend(select);

                        container.appendChild(select);

                        console.log(container);
                    } else {
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
});

function parse() {
    var selects = document.getElementsByTagName('select');
    var inputs = document.getElementsByTagName('input');

    console.log("Parse starting");
    // Observable ID -> observable value (html form)
    var formInputMap = {};

    // console.log(observableMap);
    // console.log(measurementTypesMap);
    for (var i = 0; i < selects.length; i++) {

        // name of observable
        var obName = selects[i].id;
        var ob;

        var keys = Object.keys(observableMap);
        keys.forEach(key => {

            if (obName == observableMap[key][1]) {
                ob = key;

                formInputMap[ob] = selects[i].value;
            }
        });

    }

    for (var i = 0; i < inputs.length; i++) {
        formInputMap[inputs[i].id] = inputs[i].value;
    }

    // console.log(formInputMap);

    replaceOB(formInputMap);

    var target = document.getElementById('chartContainer');
    var scrollContainer = target;
    do { //find scroll container
        scrollContainer = scrollContainer.parentNode;
        if (!scrollContainer) return;
        scrollContainer.scrollTop += 1;
    } while (scrollContainer.scrollTop == 0);

    var targetY = 0;
    do { //find the top of target relatively to the container
        if (target == scrollContainer) break;
        targetY += target.offsetTop;
    } while (target = target.offsetParent);

    scroll = function (c, a, b, i) {
        i++;
        if (i > 30) return;
        c.scrollTop = a + (b - a) / 30 * i;
        setTimeout(function () {
            scroll(c, a, b, i);
        }, 20);
    }
    // start scrolling
    scroll(scrollContainer, scrollContainer.scrollTop, targetY, 0);

}


var myChart = null;

function replaceOB(formInputMap) {
    var retrievedData = [];

    var retrievedData_Label = [];
    var retrievedData_Data = [];

    // console.log(riskEvidencesMap);

    // create copy of riskEvidencesMap to replace values
    var map = {};
    for (var i in riskEvidencesMap) {
        // map[i] = riskEvidencesMap[i];
        map[i] = JSON.parse(JSON.stringify(riskEvidencesMap[i]));
        map[i][4] = 0;
    }

    // TODO map return to default when button is pressed (Ajax query??)

    var keys = Object.keys(formInputMap);

    keys.forEach(key => {

        var keys2 = Object.keys(map);
        keys2.forEach(key2 => {

            if (map[key2][0].search(key) >= 0) {

                var text = map[key2][0].split(key).join(formInputMap[key]);

                map[key2][0] = text;
                map[key2][4] = 1;
            }

        });

    });

    var count = 0;
    var keys2 = Object.keys(map);

    console.log(map);

    keys2.forEach(key2 => {

        console.log(map[key2][4]);

        if (map[key2][4] == 1) {

            if (Parser.parseAndEvaluateExpression(map[key2][0]) != false) {

                var source = map[key2][1];
                var target = map[key2][2];
                var ratio = map[key2][3];

                // console.log(riskElementsMap[source] + " -> " + riskElementsMap[target] + " ---- " + ratio);
                retrievedData[count] = {
                    y: parseFloat(ratio),
                    label: String(riskElementsMap[source])
                };

                retrievedData_Data[count] = parseFloat(ratio);
                retrievedData_Label[count] = String(riskElementsMap[source]);

                count++;
            }
        }
    });

    console.log(retrievedData);

    // var chart = new CanvasJS.Chart("chartContainer", {
    //     animationEnabled: true,
    //     theme: "light2", // "light1", "light2", "dark1", "dark2"
    //     title:{
    //         text: "Risk of Knee Osteoarthritis"
    //     },
    //     axisY: {
    //         title: "Risk Factor"
    //     },
    //     data: [{        
    //         type: "column",  
    //         showInLegend: true, 
    //         legendMarkerColor: "grey",
    //         legendText: "Hello",
    //         dataPoints: retrievedData
    //     }]
    // });
    // chart.render();




    var ctx = document.getElementById('chartContainer2');

    if (myChart != null)
    {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: retrievedData_Label,

            datasets: [{
                label: 'Risk Factor',
                data: retrievedData_Data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Risk of Knee Osteoarthritis',
                    padding: {
                        top: 10,
                        bottom: 30
                    }
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        color: 'rgb(255, 99, 132)'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

}
