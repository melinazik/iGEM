// "https://devices.duth.carre-project.eu/sparql?default-graph-uri=http%3A%2F%2Fcarre.kmi.open.ac.uk%2Fcarreriskdata&query=PREFIX+xsd%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3EPREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3EPREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3EPREFIX+%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fontology%2Fsensors.owl%23%3EPREFIX+risk%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fontology%2Frisk.owl%23%3EPREFIX+carreManufacturer%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fmanufacturers%2F%3EPREFIX+carreUsers%3A+%3Chttps%3A%2F%2Fcarre.kmi.open.ac.uk%2Fusers%2F%3E%0D%0ASELECT+%3Fobservable%2C+%3Fname%2C+%3Fmeasurement%2C+%3Fmodifiable%2C+%28COUNT%28%3Frisk_evidence%29+AS+%3FcountRV%29+FROM+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fcarreriskdata%3E+%0D%0AWHERE+%7B++%0D%0A++%7B++++%3Fobservable+a+risk%3Aobservable%3Brisk%3Ahas_observable_name+%3Fname%3B%0D%0Arisk%3Ahas_observable_measurement_type+%3Fmeasurement.+OPTIONAL+%7B+%3Fobservable+risk%3Ahas_observable_modifiable_status+%3Fmodifiable+%7D+OPTIONAL+%7B%3Frisk_evidence+risk%3Ahas_risk_evidence_observable+%3Fobservable+%7D+FILTER+%28lang%28%3Fname%29%3D%27en%27%29%7D%7D&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on"

function load(){
    var observables = $.getJSON("https://devices.duth.carre-project.eu/sparql?default-graph-uri=http%3A%2F%2Fcarre.kmi.open.ac.uk%2Fcarreriskdata&query=PREFIX+xsd%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3EPREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3EPREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3EPREFIX+%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fontology%2Fsensors.owl%23%3EPREFIX+risk%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fontology%2Frisk.owl%23%3EPREFIX+carreManufacturer%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fmanufacturers%2F%3EPREFIX+carreUsers%3A+%3Chttps%3A%2F%2Fcarre.kmi.open.ac.uk%2Fusers%2F%3E%0D%0ASELECT+%3Fobservable%2C+%3Fname%2C+%3Fmeasurement%2C+%3Fmodifiable%2C+%28COUNT%28%3Frisk_evidence%29+AS+%3FcountRV%29+FROM+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fcarreriskdata%3E+%0D%0AWHERE+%7B++%0D%0A++%7B++++%3Fobservable+a+risk%3Aobservable%3Brisk%3Ahas_observable_name+%3Fname%3B%0D%0Arisk%3Ahas_observable_measurement_type+%3Fmeasurement.+OPTIONAL+%7B+%3Fobservable+risk%3Ahas_observable_modifiable_status+%3Fmodifiable+%7D+OPTIONAL+%7B%3Frisk_evidence+risk%3Ahas_risk_evidence_observable+%3Fobservable+%7D+FILTER+%28lang%28%3Fname%29%3D%27en%27%29%7D%7D&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on");
    
    
    console.log(observables);
}


// var getJSON = function(url, callback) {

//     var xhr = new XMLHttpRequest();
//     xhr.open('GET', url, true);
//     xhr.responseType = 'json';
    
//     xhr.onload = function() {
    
//         var status = xhr.status;
        
//         if (status == 200) {
//             callback(null, xhr.response);
//         } else {
//             callback(status);
//         }
//     };
    
//     xhr.send();
// };

// getJSON("https://devices.duth.carre-project.eu/sparql?default-graph-uri=http%3A%2F%2Fcarre.kmi.open.ac.uk%2Fcarreriskdata&query=PREFIX+xsd%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3EPREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3EPREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3EPREFIX+%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fontology%2Fsensors.owl%23%3EPREFIX+risk%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fontology%2Frisk.owl%23%3EPREFIX+carreManufacturer%3A+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fmanufacturers%2F%3EPREFIX+carreUsers%3A+%3Chttps%3A%2F%2Fcarre.kmi.open.ac.uk%2Fusers%2F%3E%0D%0ASELECT+%3Fobservable%2C+%3Fname%2C+%3Fmeasurement%2C+%3Fmodifiable%2C+%28COUNT%28%3Frisk_evidence%29+AS+%3FcountRV%29+FROM+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fcarreriskdata%3E+%0D%0AWHERE+%7B++%0D%0A++%7B++++%3Fobservable+a+risk%3Aobservable%3Brisk%3Ahas_observable_name+%3Fname%3B%0D%0Arisk%3Ahas_observable_measurement_type+%3Fmeasurement.+OPTIONAL+%7B+%3Fobservable+risk%3Ahas_observable_modifiable_status+%3Fmodifiable+%7D+OPTIONAL+%7B%3Frisk_evidence+risk%3Ahas_risk_evidence_observable+%3Fobservable+%7D+FILTER+%28lang%28%3Fname%29%3D%27en%27%29%7D%7D&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on"
//         ,  function(err, data) {
    
//     if (err != null) {
//         console.error(err);
//     } else {
        
//         var text = `Date: ${data.date}
//         Time: ${data.time}
//         Unix time: ${data.milliseconds_since_epoch}`
    
//         console.log(text);
//     }
// });




