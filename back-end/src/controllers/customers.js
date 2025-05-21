import prisma from '../database/client.js'
import Customer from '../models/Customer.js'
import { ZodError } from 'zod'

const controller = {}   // Objeto vazio

controller.create = async function (req, res) {
  try {

    // Garante que a data de nascimento esteja no formato correto
    // antes da validação
    if(req.body.birth_date) req.body.birth_date = new Date(req.body.birth_date)

    // Executa a validação do modelo do Zod para os
    // dados que vieram em req.body
    Customer.parse(req.body)

    console.log('DADOS:', req.body)

    // Dentro do parâmetro req (requisição), haverá
    // um objeto chamado "body" que contém as informações
    // que queremos armazenar do BD. Então, invocamos o
    // Prisma para fazer a interface com o BD, repassando
    // o req.body
    await prisma.customer.create({ data: req.body })

    // Se der tudo certo, enviamos como resposta o 
    // código HTTP apropriado, no caso
    // HTTP 201: Created
    res.status(201).end()
  }
  catch(error) {
    // Se algo de errado acontecer, cairemos aqui
    console.error(error)

    // Se for erro de validação do Zod, retorna
    // HTTP 422: Unprocessable entity
    if(error instanceof ZodError) res.status(422).send(error.issues)

    // Senão, retorna o habitual HTTP 500: Internal Server Error
    else res.status(500).end()
  }
}

controller.retrieveAll = async function (req, res) {
  try {
    // Recupera todos os registros de clientes do banco de dados,
    // ordenados pelo campo "name"
    const result = await prisma.customer.findMany({
      orderBy: [ { name: 'asc' } ]
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
    // Busca no banco de dados apenas o cliente indicado
    // pelo parâmetro "id"
    const result = await prisma.customer.findUnique({
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
  try {

    // Garante que a data de nascimento esteja no formato correto
    // antes da validação
    if(req.body.birth_date) req.body.birth_date = new Date(req.body.birth_date)
      
    // Executa a validação do modelo do Zod para os
    // dados que vieram em req.body
    Customer.parse(req.body)

    // Busca o registro no banco de dados pelo seu id
    // e atualiza as informações com o conteúdo de req.body
    await prisma.customer.update({
      where: { id: Number(req.params.id) },
      data: req.body
    })

    // Encontrou e atualizou ~> HTTP 204: No content
    res.status(204).end()
  }
  catch(error) {
    // Se algo de errado acontecer, cairemos aqui
    console.error(error)

    // Não encontrou e não atualizou ~> HTTP 404: Not found
    if(error?.code === 'P2025') res.status(404).end()

    // Se for erro de validação do Zod, retorna
    // HTTP 422: Unprocessable entity
    else if(error instanceof ZodError) res.status(422).send(error.issues)

    // Senão, retorna o habitual HTTP 500: Internal Server Error
    else res.status(500).end()

    console.error(error)
  }
}

controller.delete = async function(req, res) {
  try {
    await prisma.customer.delete({
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

export default controller