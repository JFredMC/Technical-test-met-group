//2.	Construya un objeto que reciba como parámetro un string y reconozca mediante expresiones regulares los siguientes criterios./

const objeto = {
    a: "Hello world",
    b: "2 + 10 / 2 - 20",
    c: "(2 + 10) / 2 - 20",
    d: "(2 + 10 / 2 - 20",
    e: "Esto es un string",
    f: "(13 + 2 / 2 -4)",
    g: "(15 + 10 * 5 / 13 - 9)"
}

//Aqui pasamos el string a procesar
const process = (objeto.g)


const operation = () => {
    const regEx = /([+]|[-]|[/]|[*])[,]*/gm
        if(regEx.test(process)){
            console.log(true)
            return true            
        }else{
            console.log(false)
            return  false      
        }
}

const compute = () => {  
    if(operation() === false){
        console.log(false)
        return false      
    }else{
        const opeArit = eval(process)
        console.log(opeArit)
        //return opeArit
        
    }

         
            
   
}

//Aqui llamamos a compute que procesa ambas funciones
compute()