import prisma from '../database/client.js'
import Cars from '../models/cars.js'
import { ZodError } from 'zod'

const controller = {}

// Função auxiliar para tratar e limpar os dados antes da validação
function prepararDadosParaValidacao(body) {
  const dados = { ...body }

  // Remove ou converte selling_price
  if (dados.selling_price === '' || dados.selling_price === null)
    delete dados.selling_price
  else if (typeof dados.selling_price === 'string' || typeof dados.selling_price === 'number')
    dados.selling_price = parseFloat(dados.selling_price)

  // Remove ou converte selling_date
  if (!dados.selling_date || dados.selling_date === 'null')
    delete dados.selling_date
  else
    dados.selling_date = new Date(dados.selling_date)

  // Converte year_manufacture
  if (dados.year_manufacture)
    dados.year_manufacture = Number(dados.year_manufacture)

  // Converte imported
  if (typeof dados.imported === 'string')
    dados.imported = dados.imported === 'true'

  return dados
}

//===================================================
// Criação de novo carro
//===================================================
controller.create = async function (req, res) {
  try {
    const dados = prepararDadosParaValidacao(req.body)

    // Validação com Zod
    console.log('📦 Dados recebidos para criação:', dados)
    Cars.parse(dados)

    await prisma.car.create({ data: dados })
    res.status(201).end()
  }
  catch (error) {
    console.error(error)
    if (error instanceof ZodError) res.status(422).send(error.issues)
    else res.status(500).end()
  }
}

//===================================================
// Listagem de todos os carros
//===================================================
controller.retrieveAll = async function (req, res) {
  try {
    const result = await prisma.car.findMany({
      orderBy: [{ model: 'asc' }]
    })
    res.send(result)
  }
  catch (error) {
    console.error(error)
    res.status(500).end()
  }
}

//===================================================
// Consulta de um carro por ID
//===================================================
controller.retrieveOne = async function (req, res) {
  try {
    const result = await prisma.car.findUnique({
      where: { id: Number(req.params.id) }
    })

    if (result) res.send(result)
    else res.status(404).end()
  }
  catch (error) {
    console.error(error)
    res.status(500).end()
  }
}

//===================================================
// Atualização de carro por ID
//===================================================
controller.update = async function (req, res) {
  try {
    const dados = prepararDadosParaValidacao(req.body)

    // Validação com Zod
    Cars.parse(dados)

    await prisma.car.update({
      where: { id: Number(req.params.id) },
      data: dados
    })

    res.status(204).end()
  }
  catch (error) {
    console.error(error)

    if (error?.code === 'P2025') res.status(404).end()
    else if (error instanceof ZodError) res.status(422).send(error.issues)
    else res.status(500).end()
  }
}

//===================================================
// Exclusão de carro por ID
//===================================================
controller.delete = async function (req, res) {
  try {
    await prisma.car.delete({
      where: { id: Number(req.params.id) }
    })
    res.status(204).end()
  }
  catch (error) {
    console.error(error)

    if (error?.code === 'P2025') res.status(404).end()
    else res.status(500).end()
  }
}

export default controller
