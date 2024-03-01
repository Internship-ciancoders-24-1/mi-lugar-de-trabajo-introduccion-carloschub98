

function calcular(cadena) {
    let validaciones = validadores(cadena);
    if (validaciones[0].fallo==true) {
        return validaciones;
    }

    let resultado = operarDivisiones(cadena);
    resultado = operarMultiplicacion(resultado);
    resultado = operarRestaYSuma(resultado);
    resultado = parseFloat(resultado);
    return {
        'Resultado': resultado
    };

}


function operarDivisiones(cadena) {
    const regex = /(\d+\.?\d*)\/(\d+\.?\d*)/g;
    let coincidencia;

    while ((coincidencia = regex.exec(cadena)) !== null) {
        const dividendo = parseFloat(coincidencia[1]);
        const divisor = parseFloat(coincidencia[2]);
        const resultadoDivision = dividendo / divisor;
        cadena = cadena.replace(coincidencia[0], resultadoDivision);
        regex.lastIndex = 0;
    }
    
    return cadena;
}

function operarMultiplicacion(cadena) {
    const regex = /(\d+\.?\d*)\*(\d+\.?\d*)/g;
    let coincidencia;
    while ((coincidencia = regex.exec(cadena)) !== null) {
        const multiplicando = parseFloat(coincidencia[1]);
        const multiplicador = parseFloat(coincidencia[2]);
        const resultadoMultiplicacion = multiplicando * multiplicador;
        cadena = cadena.replace(coincidencia[0], resultadoMultiplicacion);
        regex.lastIndex = 0;
    }
    return cadena;
}

function operarRestaYSuma(cadena) {
    const regex = /(-?\d+\.?\d*)([+-])(\d+\.?\d*)/g;
    let coincidencia;

    while ((coincidencia = regex.exec(cadena)) !== null) {
        const operando1 = parseFloat(coincidencia[1]);
        const operador = coincidencia[2];
        const operando2 = parseFloat(coincidencia[3]);

        let resultadoOperacion;

        if (operador === '+') {
            resultadoOperacion = operando1 + operando2;
        } else if (operador === '-') {
            resultadoOperacion = operando1 - operando2;
        }
        cadena = cadena.replace(coincidencia[0], resultadoOperacion);
        regex.lastIndex = 0;
    }

    return cadena;
}

function validadores(cadena) {
    let validaciones=[];
    let bandera=false;
    if (cadena=="") {
        validaciones.push({
            "fallo": true,
            "error": "Debe enviar al menos una expresion matematica"
        });
        bandera=true;
    }
    if (cadena.length>20) {
        validaciones.push({
            "fallo": true,
            "error": "No pueden ser más de 20 caracteres"
        });
        bandera=true;
    }

    //Respuesta
    if (bandera==false) {
        return [{
            "fallo": false,
            "Mensaje": "La cadena es válida"
        }]
    }
    else{
        return validaciones;
    }
}


const string1 = 'sssssssssssssssssssssssssssssssssssssssssssssssss';
const resultado = calcular(string1);
console.log(resultado);
