const { 
    contas, 
    depositos, 
    saques,
    transferencias
} = require('../bancodedados')    
    
const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;

    if (!numero_conta || !valor) {
        return res.status(400).json({ mensagem: 'O número da conta e o valor são obrigatórios!' });
    }

    const conta = contas.find((conta) => {
        return conta.numero === numero_conta
    });
   
    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontrada!' });
    }
    
    if (valor <= 0) {
        return res.status(400).json({ mensagem: 'O valor do depósito deve ser maior que zero!' });
    }

    conta.saldo += valor;

    const transacao = {
        data: new Date().toLocaleString(),
        numero_conta,
        valor
    };

    depositos.push(transacao);

    return res.status(204).send();
};

const sacar = (req, res) =>{
    const { numero_conta, valor, senha } = req.body;

    if (!numero_conta || !valor || !senha) {
        return res.status(400).json({ mensagem: 'O número da conta, o valor e senha são obrigatórios!' });
    }

    const conta = contas.find((conta) => {
        return conta.numero === numero_conta
    });
   
    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontrada!' });
    }

    if (senha !== conta.usuario.senha) {
        return res.status(401).json({ mensagem: 'Senha bancária não e valida!' });
    }

    if (valor <= 0) {
        return res.status(400).json({ mensagem: 'O valor não pode ser menor que zero!' });
    }

    if (valor > conta.saldo) {
        return res.status(400).json({ mensagem: 'Saldo insuficiente para o saque!' });
    }

    conta.saldo -= valor;

    const transacao = {
        data: new Date().toLocaleString(),
        numero_conta,
        valor: -valor
    };

    saques.push(transacao);

    return res.status(204).send();
};

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!numero_conta_origem || !numero_conta_destino || !valor) {
        return res.status(400).json({ mensagem: 'O número da conta de origem, número da conta de destino, o valor da transferência e a senha são obrigatórios!' });
    }

    const contaOrigem = contas.find((conta) => {
        return conta.numero === numero_conta_origem
    });

    if (!contaOrigem) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontrada!' });
    }

    const contaDestino = contas.find((conta) => {
        return conta.numero === numero_conta_destino
    });

    if (!contaDestino) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontrada!' });
    }


    if (valor <= 0) {
        return res.status(400).json({ mensagem: 'O valor não pode ser menor que zero!' });
    }

    if (valor > contaOrigem.saldo) {
        return res.status(400).json({ mensagem: 'Saldo insuficiente!' });
    }

    if (senha !== contaOrigem.usuario.senha) {
        
        return res.status(401).json({ mensagem: 'Senha bancária não e valida!' });
    }
    
    contaOrigem.saldo -= valor;
    contaDestino.saldo += valor;

    const transacao = {
        data: new Date().toLocaleString(),
        numero_conta_origem,
        numero_conta_destino,
        valor
    };

    transferencias.push(transacao);

    return res.status(204).send();
}

module.exports = {
    depositar, 
    sacar, 
    transferir
}

