const express = require('express');
const senha_banco = require('./intermediarios');
const rotas = require('./rotas');

const app = express();

app.use(express.json(), senha_banco, rotas);

app.listen(3000,()=>{
    console.log('Servidor inicializado na porta 3000');
});