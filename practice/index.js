class Validador {
    validarExpresionMatematica(cadena) {
        const regex = /^-?(\d+(\.\d+)?|q\d+(\.\d+)?|\((?:-?\d+(\.\d+)?|q\d+(\.\d+)?|[+\-*/^])+\))(?:[+\-*/^](-?\d+(\.\d+)?|q\d+(\.\d+)?|\((?:-?\d+(\.\d+)?|q\d+(\.\d+)?|[+\-*/^])+\)))*$/;
        return regex.test(cadena);
    }

    validar(cadena) {
        let validaciones = [];
        let bandera = false;

        if (cadena === "") {
            validaciones.push({
                "fallo": true,
                "error": "Debe enviar al menos una expresión matemática"
            });
            bandera = true;
        }

        if (cadena.length > 20) {
            validaciones.push({
                "fallo": true,
                "error": "No pueden ser más de 20 caracteres"
            });
            bandera = true;
        }

        let expresionMatematica = this.validarExpresionMatematica(cadena);
        if (!expresionMatematica) {
            validaciones.push({
                "fallo": true,
                "error": "Debe enviar al menos una expresión matemática válida, revise su expresión"
            });
            bandera = true;
        }

        if (bandera === false) {
            return [{
                "fallo": false,
                "Mensaje": "La cadena es válida"
            }];
        } else {
            return validaciones;
        }
    }
}

class Operaciones{
    operarRaizCuadrada(cadena) {
        const regex = /q(-?\d+\.?\d*)/g; // Expresión regular para encontrar la raíz cuadrada
        let coincidencia;
        while ((coincidencia = regex.exec(cadena)) !== null) {
            const valor = parseFloat(coincidencia[1]);
            if (valor < 0) {
                return [{
                    "fallo": true,
                    "error": "No se puede calcular la raíz cuadrada de un número negativo"
                }]
            }
            const resultadoRaizCuadrada = Math.sqrt(valor);
            cadena = cadena.replace(coincidencia[0], resultadoRaizCuadrada);
            regex.lastIndex = 0;
        }
        return cadena;
    }
    
    
    operarPotencia(cadena) {
        const regex = /(\d+\.?\d*)([\^])(\d+\.?\d*)/g;
        let coincidencia;
        while ((coincidencia = regex.exec(cadena)) !== null) {
            const base = parseFloat(coincidencia[1]);
            const exponente = parseFloat(coincidencia[3]);
            const resultadoPotencia = Math.pow(base, exponente);
            cadena = cadena.replace(coincidencia[0], resultadoPotencia);
            regex.lastIndex = 0;
        }
        return cadena;
    }
    
    operarDivisiones(cadena) {
        const regex = /(\d+\.?\d*)\/(\d+\.?\d*)/g;
        let coincidencia;
        while ((coincidencia = regex.exec(cadena)) !== null) {
            const dividendo = parseFloat(coincidencia[1]);
            const divisor = parseFloat(coincidencia[2]);
            if (divisor < 1) {
                return [{
                    "fallo": true,
                    "error": "No se puede calcular la division por cero"
                }]
            }
            const resultadoDivision = dividendo / divisor;
            cadena = cadena.replace(coincidencia[0], resultadoDivision);
            regex.lastIndex = 0;
        }
        return cadena;
    }
    
    operarMultiplicacion(cadena) {
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
    
    operarRestaYSuma(cadena) {
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

    calcular(cadena) {
        let resultado = this.operarRaizCuadrada(cadena);
        if (resultado[0].fallo!== undefined) {
            delete resultado[0].fallo;
            return resultado;
        }
        resultado = this.operarPotencia(resultado);
        resultado = this.operarDivisiones(resultado);
        if (resultado[0].fallo!== undefined) {
            delete resultado[0].fallo;
            return resultado;
        }
        resultado = this.operarMultiplicacion(resultado);
        resultado = this.operarRestaYSuma(resultado);
        resultado = parseFloat(resultado);
        return resultado;
    }

    resolverParentesis(cadena) {
        let regex = /\(([^()]+)\)/g;
        let coincidencia;
        while ((coincidencia = regex.exec(cadena)) !== null) {
            const expresion = coincidencia[1]; 
            let resultadoExpresion = this.calcular(expresion); 
            if (resultadoExpresion[0] && resultadoExpresion[0].error!==undefined) {
                return resultadoExpresion;
            }
            cadena = cadena.replace(coincidencia[0], resultadoExpresion); 
            regex.lastIndex = 0; 
        }
        return cadena;
    }

    calculadora(cadena) {
        const validador = new Validador();
        let validaciones = validador.validar(cadena);
        if (validaciones[0].fallo==true) {
            for (let i = 0; i < validaciones.length; i++) {
                delete validaciones[i].fallo;
            }
            return {
                'Resultado': validaciones
            };
        }
    
        let resultado = this.resolverParentesis(cadena);
        if (resultado[0].error!==undefined) {
            return {
                'Resultado': resultado
            };
        }
        resultado = this.calcular(resultado);
        return {
            'Resultado': resultado
        };
    }
}

//LLAMANDO LA FUNCION
const operaciones = new Operaciones();
let string1 = '4-7+8+9/2*3';
const resultado1 = operaciones.calculadora(string1);
console.log(resultado1);

let string2 = '2+3*(4+2)-q4+1+(2^2)';
const resultado2 = operaciones.calculadora(string2);
console.log(resultado2);

let string3 = '2+3*(4+2)';
const resultado3 = operaciones.calculadora(string3);
console.log(resultado3);

let string4 = '8-6+9+15/5*8';
const resultado4 = operaciones.calculadora(string4);
console.log(resultado4);