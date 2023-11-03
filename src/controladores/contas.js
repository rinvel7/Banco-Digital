let { contas, depositos, saques, transferencias } = require("../bancodedados");

let numeroConta = 3;

const listarContas = (req, res) => {
  return res.status(200).json(contas);
};

const criarContas = (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

  if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
    return res
      .status(400)
      .json({ mensagem: "Todos os campos são obrigatórios." });
  }

  const contaExistente = contas.find(
    (conta) => conta.usuario.cpf === cpf || conta.usuario.email === email
  );

  if (contaExistente) {
    return res
      .status(400)
      .json({ mensagem: "Já existe uma conta com o mesmo CPF ou e-mail." });
  }

  const novaConta = {
    numero: numeroConta,
    saldo: 0,
    usuario: {
      nome,
      cpf,
      data_nascimento,
      telefone,
      email,
      senha,
    },
  };

  contas.push(novaConta);

  numeroConta++;

  return res.status(201).json(novaConta);
};

const atualizarUsuario = (req, res) => {
  let numeroConta = req.params;
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

  if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
    return res
      .status(400)
      .json({ mensagem: "Todos os campos são obrigatórios." });
  }

  const contaExistente = contas.find(
    (conta) => conta.usuario.cpf === cpf || conta.usuario.email === email
  );

  if (contaExistente) {
    return res
      .status(400)
      .json({ mensagem: "Já existe uma conta com o mesmo CPF ou e-mail." });
  }

  const conta = contas.find((conta) => {
    return conta.numero === numeroConta;
  });

  if (!conta) {
    return res.status(404).json({ mensagem: "Conta bancária não encontrada." });
  }

  if (
    cpf &&
    contas.some((conta) => conta.cpf === cpf && conta.numero !== numeroConta)
  ) {
    return res
      .status(400)
      .json({ mensagem: "O CPF informado já existe cadastrado." });
  }

  if (
    email &&
    contas.some(
      (conta) => conta.email === email && conta.numero !== numeroConta
    )
  ) {
    return res
      .status(400)
      .json({ mensagem: "O E-mail informado já existe cadastrado." });
  }

  conta.nome = nome;
  conta.cpf = cpf;
  conta.data_nascimento = data_nascimento;
  conta.telefone = telefone;
  conta.email = email;
  conta.senha = senha;

  return res.status(204).send();
};

const excluirConta = (req, res) => {
  let { numeroConta } = req.params;

  const conta = contas.find((conta) => {
    return conta.numero === numeroConta;
  });

  if (!conta) {
    return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
  }

  if (conta.saldo !== 0) {
    return res
      .status(400)
      .json({ mensagem: "A conta só pode ser removida se o saldo for zero!" });
  }

  contas = contas.filter((conta) => {
    return conta.numero !== numeroConta;
  });

  return res.status(204).send();
};

const consultarSaldo = (req, res) => {
  const { numero_conta, senha } = req.query;

  if (!numero_conta || !senha) {
    return res
      .status(400)
      .json({ mensagem: "O número da conta e a senha são obrigatórios!" });
  }

  const conta = contas.find((conta) => {
    return conta.numero === numero_conta;
  });

  if (!conta) {
    return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
  }

  if (senha !== conta.usuario.senha) {
    return res.status(401).json({ mensagem: "Senha inválida!" });
  }

  return res.status(200).json({ saldo: conta.saldo });
};

const emitirExtrato = (req, res) => {
  const { numero_conta, senha } = req.query;

  if (!numero_conta || !senha) {
    return res.status(400).json({ mensagem: "O número da conta e a senha são obrigatórios!" });
  }
  const conta = contas.find((conta) => {
    return conta.numero === numero_conta;
  });

  if (!conta) {
    return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
  }

  if (senha !== conta.usuario.senha) {
    return res.status(401).json({ mensagem: "Senha inválida!!" });
  }

  const deposito = depositos.filter((transacao) =>{ 
    return transacao.numero_conta === numero_conta 
});

  const saque = saques.filter((transacao) =>{ 
    return transacao.numero_conta === numero_conta 
       
});

  const transferenciasEnviadas = transferencias.filter((transacao) =>{ 
    return transacao.numero_conta_origem === numero_conta 
       
});

  const transferenciasRecebidas = transferencias.filter((transacao) =>{ 
    return transacao.numero_conta_destino === numero_conta
      
});

  const extrato = {
    deposito,
    saque,
    transferenciasEnviadas,
    transferenciasRecebidas,
  };
  
  return res.status(200).json(extrato);
};

module.exports = {
  listarContas,
  criarContas,
  atualizarUsuario,
  excluirConta,
  consultarSaldo,
  emitirExtrato,
};
