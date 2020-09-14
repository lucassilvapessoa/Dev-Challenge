
    const csv = require('csv-parser');
    const fs = require('fs');
    const _ = require("lodash");
    const { prototype } = require('module');
    const { keys } = require('lodash');
    const { cpus } = require('os');
    let dataR = []

    fs.createReadStream('./input.csv')
        .pipe(csv())
        .on('data', (row) => {
            dataR.push(row)
        })
        .on('end', () => {

            function guardarChavePrincipalDeArrayObjeto(array,chave){
                        let principal = []
                        array.forEach(element => {
                        principal.push(element[chave])
                        }); 
                        return principal
            }

            // RETONAR O VALOR DA CHAVE PRINCIPAl DE UM OBJETO //
            let chaves = guardarChavePrincipalDeArrayObjeto(dataR,'eid')



            // RETORNA A QUANTIDADE DE OCORRENCIAS DE UMA MESMA CHAVE EM UM ARRAY DE OBJETOS//
            const ocorrencias = chaves.reduce(function(obj, item) {
                obj[item] = (obj[item] || 0) + 1;
                return obj;
              }, {});

              
              // RETONAR SOMENTE OS OBJETOS REPETIDOS DE UM ARRAY OU SEJA QUE CONTEM O MESMO RESULTADO DE CHAVE //
              function retornaObjetosRepetidos(array,chave){
                return array.map(elemento=>{
                    let oc = ocorrencias[elemento[chave]]
                    if(oc > 1){
                        return elemento
                    }
                }).filter(x=>{
                    return x != undefined
                })
              } 



              const objetosRepetidos = retornaObjetosRepetidos(dataR,'eid')
              //FAZ O MERGE ENTRE 2 OU MAIS OBJETOS OU SEJA JUNTA INFORMAÇÕOES E RETORNA APENAS UM OBJETO//
              function reduzirObjetoRepetidos(arrayRept){
                let reduzido = arrayRept.reduce((pre,curr,indice)=>{
                     let keys = Object.keys(curr)
                     keys.forEach(x=>{
                         if (!(x in pre)){
                            pre[x] = curr[x]
                         }else{
                             if(!(pre[x] == curr[x])){
                                 pre[x] = pre[x].concat(',',curr[x])
                             }
                         }
                     })
                     return pre                   
                  },{})
                  return reduzido
              }

              
              let obj = reduzirObjetoRepetidos(objetosRepetidos)
              //JUNTA O OBJETO EM QUE FOI FEITO O MERGE DAS INFORMAÇÕES JUNTO COM OS OUTROS OBJETOS DO ARRAY //
              let resultadoFinal = dataR.filter(o=>{
                  if(o.eid != objetosRepetidos[0].eid){
                      return o
                  }                  
              }).concat(obj)

              fs.writeFile('output.json',JSON.stringify(resultadoFinal),()=>{
                  console.log("Arquvio Json gravado com sucesso")
              })
        })
        
        
        


    