import prisma from '../database/client.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const controller = {}   // Objeto vazio

controller.create = async function (req, res) {
  try {
    console.log('📥 Dados recebidos no cadastro:', req.body)

    delete req.body.id

    if(req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 12)
    }

    const userCriado = await prisma.user.create({ data: req.body })

    console.log('✅ Usuário criado com sucesso:', userCriado)
    res.status(201).end()
  }
  catch(error) {
    console.error('❌ Erro ao criar usuário:', error.stack || error)
    res.status(500).json({ erro: 'Erro interno ao criar usuário' })
  }
}


controller.retrieveAll = async function (req, res) {
  try {
    // Recupera todos os registros de usuários do banco de dados,
    // ordenados pelo campo "model"
    const result = await prisma.user.findMany({
      omit: { password: true },         // Não retorna o campo 'password'
      orderBy: [ { fullname: 'asc' } ]
    })

    // HTTP 200: OK (implícito)
    res.send(result)
  }
  catch(error) {
    // Se algo de errado acontecer, cairemos aqui
    // Nesse caso, vamos exibir o erro no console e enviar
    // o código HTTP correspondente a erro do servidor
    // HTTP 500: Internal Server Error
    console.error(error)
    res.status(500).end()
  }
}

controller.retrieveOne = async function (req, res) {
  try {
    // Busca no banco de dados apenas o usuário indicado
    // pelo parâmetro "id"
    const result = await prisma.user.findUnique({
      omit: { password: true },         // Não retorna o campo 'password'
      where: { id: Number(req.params.id) }
    })

    // Encontrou ~> HTTP 200: OK (implícito)
    if(result) res.send(result)

    // Não encontrou ~> HTTP 404: Not found
    else res.status(404).end()
  }
  catch(error) {
    // Se algo de errado acontecer, cairemos aqui
    // Nesse caso, vamos exibir o erro no console e enviar
    // o código HTTP correspondente a erro do servidor
    // HTTP 500: Internal Server Error
    console.error(error)
    res.status(500).end()
  }
}

controller.update = async function(req, res) {
  console.log('****', req.body, req.params.id)
  try {
    // Se existe o campo 'password' em req.body,
    // é necessário gerar o hash da senha antes
    // de armazená-lo no BD
    if(req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 12)
    }

    // Busca o registro no banco de dados pelo seu id
    // e atualiza as informações com o conteúdo de req.body
    await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: req.body
    })

    // Encontrou e atualizou ~> HTTP 204: No content
    res.status(204).end()
  }
  catch(error) {
    console.error(error)
    
    // Não encontrou e não atualizou ~> HTTP 404: Not found
    if(error?.code === 'P2025') res.status(404).end()
    // Outros tipos de erro ~> HTTP 500: Internal server error
    else res.status(500).end()
  }
}

controller.delete = async function(req, res) {
  try {
    await prisma.user.delete({
      where: { id: Number(req.params.id) }
    })

    // Encontrou e excluiu ~> HTTP 204: No content
    res.status(204).end()
  }
  catch(error) {
    console.error(error)
    
    // Não encontrou e não excluiu ~> HTTP 404: Not found
    if(error?.code === 'P2025') res.status(404).end()
    // Outros tipos de erro ~> HTTP 500: Internal server error
    else res.status(500).end()
  }
}

controller.login = async function (req, res) {
  try {
    // Busca o usuário no BD usando o valor dos campos
    // "username" OU "email"
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: req.body?.username },
          { email: req.body?.email }
        ]
      }
    })

    // Se o usuário não for encontrado, retorna
    // HTTP 401: Unauthorized
    if(! user) {
      console.error('ERRO DE LOGIN: usuário não encontrado')
      return res.status(401).end()
    }

    // Usuário encontrado, vamos conferir a senha
    const passwordIsValid = await bcrypt.compare(req.body?.password, user.password)

    // Se a senha estiver errada, retorna
    // HTTP 401: Unauthorized
    if(! passwordIsValid) {
      console.error('ERRO DE LOGIN: senha inválida')
      return res.status(401).end()
    }

    // Deleta o campo "password" do objeto "user" antes de usá-lo
    // no token e no valor de retorno
    if(user.password) delete user.password

    // Usuário/email e senha OK, passamos ao procedimento de gerar o token
    const token = jwt.sign(
      user,                       // Dados do usuário
      process.env.TOKEN_SECRET,   // Senha para criptografar o token
      { expiresIn: '24h' }        // Prazo de validade do token
    )

    // Formamos o cookie para enviar ao front-end
    res.cookie(process.env.AUTH_COOKIE_NAME, token, {
      httpOnly: true,     // Torna o cookie inacessível para JavaScript
      secure: true,       // O cookie só trafegará em HTTPS ou localhost
      sameSite: 'None',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000   // 24h
    })

    // Retorna o token e o usuário autenticado, com o status
    // HTTP 200: OK (implícito)
    res.send({ user })
  }
  catch(error) {
    // Se algo de errado acontecer, cairemos aqui
    // Nesse caso, vamos exibir o erro no console e enviar
    // o código HTTP correspondente a erro do servidor
    // HTTP 500: Internal Server Error
    console.error(error)
    res.status(500).end()
  }
}

controller.me = function(req, res) {
  /*
    Retorna o usuário autenticado (caso haja) que foi armazenado na
    variável req.authUser pelo middleware de autorização logo após
    o token ter sido decodificado
  */
  return res.send(req?.authUser)
}

controller.logout = function(req, res) {
  // Apaga no front-end o cookie que armazena o token de autorização
  res.clearCookie(process.env.AUTH_COOKIE_NAME)
  // HTTP 204: No Content
  res.status(204).end()
}

export default controller
