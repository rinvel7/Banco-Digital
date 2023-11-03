const express = require('express');

const { 
    listarContas,    
    criarContas,
    atualizarUsuario,
    excluirConta,
    consultarSaldo,
    emitirExtrato
    } 
    = require('./controladores/contas');

const { 
    depositar,
    sacar,
    transferir
} = require('./controladores/transacoes'); 


const rotas = express();

rotas.get('/contas', listarContas)
rotas.post('/contas', criarContas);
rotas.put('/contas/:numeroConta/usuario', atualizarUsuario);
rotas.delete('/contas/:numeroConta', excluirConta);

rotas.post('/transacoes/depositar', depositar);
rotas.post('/transacoes/sacar', sacar);
rotas.post('/transacoes/transferir', transferir);

rotas.get('/contas/saldo', consultarSaldo);
rotas.get('/contas/extrato', emitirExtrato);

module.exports = rotas