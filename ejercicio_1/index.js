//1. Construya un objeto que reciba un arreglo o una matriz de dimensión N el cual contiene números de tipo entero. //
const a = [[1,2]] 
const b = [[1,2],[2,4]]
const c = [[1,2],[2,4],[2,4]] 
const d = [[3,4],[6,5]] 
const e = [[1,2,3], [5,6,7],[5,4,3],[3, 5, 6], [4, 8, 3], [2, 3]]    
const f = [[1, 2, 3], [2, 3, 4], [5, 6, 7], [5, 4, 3], [3,5, 6], [4, 8, 3]]
const g = [[5,9,8,4], [4,6,3], [9,1,5,3,7]]

//Aqui pasamos el array que querramos verifiar
const numEnteros = g
//a.	o.dimension -> Devuelve el número entero que define la dimensión del arreglo o matriz en su mayor profundidad.//

const dimension = () => {
    const diArray = numEnteros.length
    console.log(`La dimensión del arreglo es: ${diArray}`)
}

dimension()

//b.	o.straight -> Devuelve true o false según el siguiente criterio: -True: Si el arreglo o matriz contiene la misma cantidad de elementos en cada una de sus dimensiones (Matriz uniforme). -False: Caso contrario.//
const straight = () => {
    //Recorro el array para conocer cuantas posiciones tiene cada uno y luego comparar.
    const numLength = []
    for(num of numEnteros){
        numLength.push(num.length) 
    }

    //Comparo si los arrays tienen la misma dimension
    const comparar = numLength.every(elemento => elemento === numLength[0])
    if(comparar){
        return console.log(`El arreglo contiene la misma cantidad de elementos en cada una de sus dimensiones. [${true}]`)        
    }else{
        return console.log(`El arreglo no contiene la misma cantidad de elementos en cada una de sus dimensiones. [${false}]`)
    }
}
straight()

//c.	o.compute -> Devuelve el número entero resultado de la suma de todos los números incluídos en la matriz sin importar el tamaño o dimensión.//

const compute = () =>{
    //Convertimos el array de dimensiones N en un solo array
    const nuevoArray = numEnteros.reduce((lastVal, newVal) => {
        return [...lastVal,...newVal]
    }, [])

    let suma = 0
    for(num of nuevoArray){
        suma += num      
    } 
    console.log(`La suma de todos los numeros enteros es: ${suma}`)
}

compute()

//miarray.reduce((lastVal, newVal) => {return [...lastVal,...newVal]}, [])

