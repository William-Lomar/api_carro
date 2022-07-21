const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mysql2 = require('mysql2');

const connection = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'veiculos',
    password : ''
})

connection.connect();

var corsOptions = {
  orgim: '/',
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.listen(3100, () => {
  console.log('Server Started!');
});

app.route('/api/veiculos').get((request, response) => {
    connection.query(
    'SELECT * FROM carros',
    function(erro, results, fields) {
        if(erro){
            console.log("Ocorreu um erro durante inserção no banco de dados")
        }else{
            response.send(results);
        }
    }
    );
});

app.route('/api/veiculo/:id').get((request, response) => {
    id = request.params.id;
    connection.query(
        'SELECT * FROM carros WHERE id = '+id,
        function(erro, results, fields) {
            if(erro){
                console.log("Ocorreu um erro durante inserção no banco de dados")
            }else{
                response.send(results);
            }
        }
    );
});

app.route('/api/log/:id').get((request, response) => {
    id = request.params.id;
    connection.query(
    'SELECT * FROM log WHERE carro_id = '+id+' LIMIT 5',
    function(erro, results, fields) {
        if(erro){
            console.log("Ocorreu um erro durante pesquisa no banco de dados")
        }else{
            response.send(results);
        }
    }
    );
});

app.route('/api/logCompleto/:id').get((request, response) => {
    id = request.params.id;
    connection.query(
    'SELECT * FROM log WHERE carro_id = '+id,
    function(erro, results, fields) {
        if(erro){
            console.log("Ocorreu um erro durante inserção no banco de dados")
        }else{
            response.send(results);
        }
    }
    );
});

app.route('/api/deletarCarro/:id').delete((request, response) => {
    id = request.params.id;
    connection.query(`DELETE FROM carros WHERE id = '${id}'`,
    function(erro, results, fields) {
        if(erro){
            console.log(erro)
        }else{
            connection.query(`DELETE FROM log WHERE carro_id = '${id}'`,(erro,results,fields)=>{
                if(erro){
                    console.log(erro);
                    response.send({results:erro});
                }else{
                    response.send({results:'Tudo ok'});
                }
            })
        }
    }
    );
});

app.route('/api/cadastrarVeiculo').post((request, response) => {
    carro = request.body;

    query = `INSERT INTO carros VALUES('','${carro.placa}','${carro.marca}')`

    connection.query(query, 
        function(erro, results, fields) {
            if(erro){
                console.log(erro);
            }else{
                response.send({results:"Carro cadastrado com sucesso"});
            }
        }
    );
});

app.route('/api/atualizar').post((request, response) => {
    carro = request.body;

    query = `UPDATE carros SET placa = '${carro.placa}', marca = '${carro.marca}' WHERE id = ${carro.id}`;

    connection.query(query, 
        function(erro, results, fields) {
            if(erro){
                console.log(erro);
            }else{
                response.send({results:"Carro atualizado com sucesso"});
            }
        }
    );

});

app.route('/api/cadastrarLog').post((request, response) => {
    log = request.body;

    query = `INSERT INTO log VALUES('','${log.data}','${log.km_inicial}','${log.km_final}','${log.motorista}','${log.objetivo}','${log.obs}','${log.carro_id}')`;

    connection.query(query, 
        function(erro, results, fields) {
            if(erro){
                console.log(erro);
            }else{
                response.send({results:"Log cadastrado com sucesso"});
            }
        }
    );

});
