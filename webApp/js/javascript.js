// "https://devices.duth.carre-project.eu/sparql?default-graph-uri=http%3A%2F%2Fcarre.kmi.open.ac.uk%2Fcarreriskdata&query=PREFIX+xsd%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3EPREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3EPREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3EPREFIX+%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fontology%2Fsensors.owl%23%3EPREFIX+risk%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fontology%2Frisk.owl%23%3EPREFIX+carreManufacturer%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fmanufacturers%2F%3EPREFIX+carreUsers%3A+%3Chttps%3A%2F%2Fcarre.kmi.open.ac.uk%2Fusers%2F%3E%0D%0ASELECT+%3Fobservable%2C+%3Fname%2C+%3Fmeasurement%2C+%3Fmodifiable%2C+%28COUNT%28%3Frisk_evidence%29+AS+%3FcountRV%29+FROM+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fcarreriskdata%3E+%0D%0AWHERE+%7B++%0D%0A++%7B++++%3Fobservable+a+risk%3Aobservable%3Brisk%3Ahas_observable_name+%3Fname%3B%0D%0Arisk%3Ahas_observable_measurement_type+%3Fmeasurement.+OPTIONAL+%7B+%3Fobservable+risk%3Ahas_observable_modifiable_status+%3Fmodifiable+%7D+OPTIONAL+%7B%3Frisk_evidence+risk%3Ahas_risk_evidence_observable+%3Fobservable+%7D+FILTER+%28lang%28%3Fname%29%3D%27en%27%29%7D%7D&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on"

function load(){
    let observablesURL = "https://devices.duth.carre-project.eu/sparql?default-graph-uri=http%3A%2F%2Fcarre.kmi.open.ac.uk%2Fcarreriskdata&query=PREFIX+xsd%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3EPREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3EPREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3EPREFIX+%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fontology%2Fsensors.owl%23%3EPREFIX+risk%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fontology%2Frisk.owl%23%3EPREFIX+carreManufacturer%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fmanufacturers%2F%3EPREFIX+carreUsers%3A+%3Chttps%3A%2F%2Fcarre.kmi.open.ac.uk%2Fusers%2F%3E%0D%0ASELECT+%3Fobservable%2C+%3Fname%2C+%3Fmeasurement%2C+%3Fmodifiable%2C+%28COUNT%28%3Frisk_evidence%29+AS+%3FcountRV%29+FROM+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fcarreriskdata%3E+%0D%0AWHERE+%7B++%0D%0A++%7B++++%3Fobservable+a+risk%3Aobservable%3Brisk%3Ahas_observable_name+%3Fname%3B%0D%0Arisk%3Ahas_observable_measurement_type+%3Fmeasurement.+OPTIONAL+%7B+%3Fobservable+risk%3Ahas_observable_modifiable_status+%3Fmodifiable+%7D+OPTIONAL+%7B%3Frisk_evidence+risk%3Ahas_risk_evidence_observable+%3Fobservable+%7D+FILTER+%28lang%28%3Fname%29%3D%27en%27%29%7D%7D&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on";
    let measurementTypesURL = "https://devices.duth.carre-project.eu/sparql?default-graph-uri=http%3A%2F%2Fcarre.kmi.open.ac.uk%2Fcarreriskdata&query=PREFIX+xsd%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3EPREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3EPREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3EPREFIX+%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fontology%2Fsensors.owl%23%3EPREFIX+risk%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fontology%2Frisk.owl%23%3EPREFIX+carreManufacturer%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fmanufacturers%2F%3EPREFIX+carreUsers%3A+%3Chttps%3A%2F%2Fcarre.kmi.open.ac.uk%2Fusers%2F%3E%0D%0ASELECT+DISTINCT+%2A+FROM+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fcarreriskdata%3E+%0D%0AWHERE+%7B++%0D%0A++%7B++++%3Fmeasurement_type+a+risk%3Ameasurement_type%3B+risk%3Ahas_measurement_type_name+%3Fname%3B+risk%3Ahas_datatype+%3Fdatatype.+OPTIONAL+%7B+%3Fmeasurement_type+risk%3Ahas_enumeration_values+%3Fenum_values.+FILTER+%28lang%28%3Fenum_values%29%3D%27en%27%29%7D+OPTIONAL+%7B+%3Fmeasurement_type+risk%3Ahas_label+%3Flabel.+FILTER+%28lang%28%3Flabel%29%3D%27en%27%29%7D%0D%0AFILTER+%28lang%28%3Fname%29%3D%27en%27%29%7D%7D&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on";
    
    
    var observableMap = {};
    var measurementTypesMap = {};

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

            // console.log(`${key}: ${value}`); 
            // console.log(key, " : ", obvName);
        });
        

        

        var mapRV = {};

        var keys = Object.keys(observableMap);
        keys.forEach(k=>{
            var valueRV = parseInt((observableMap[k])[2]);
            mapRV[k] = valueRV;   
        });

        mapRV[Symbol.iterator] = function* () {
            yield* [...Object.entries(mapRV)].sort((a, b) => a[1] - b[1]);
        }

        // const mapRVSort = new Map([...Object.entries(mapRV)].sort((a, b) => b[1] - a[1]));
        // console.log(mapRVSort);

        
        console.log([...mapRV]);   
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
    })

    console.log(observableMap);

    
    // console.log(measurementTypesMap);

}
