import { z } from 'zod'

// Cores em caixa alta, como no front-end
const coresValidas = [
  'AMARELO', 'AZUL', 'BRANCO', 'CINZA', 'DOURADO',
  'LARANJA', 'MARROM', 'PRATA', 'PRETO', 'ROSA',
  'ROXO', 'VERDE', 'VERMELHO'
]

const anoAtual = new Date().getFullYear()
const dataMinimaVenda = new Date('2020-01-01')
const dataMaximaVenda = new Date()

const Cars = z.object({
  brand: z.string()
    .trim()
    .min(1, { message: 'A marca deve ter pelo menos 1 caractere.' })
    .max(25, { message: 'A marca pode ter no máximo 25 caracteres.' }),

  model: z.string()
    .trim()
    .min(1, { message: 'O modelo deve ter pelo menos 1 caractere.' })
    .max(25, { message: 'O modelo pode ter no máximo 25 caracteres.' }),

  color: z.enum(coresValidas, {
    message: 'Cor inválida. Escolha uma das cores disponíveis.'
  }),

  year_manufacture: z.number()
    .int({ message: 'Ano deve ser um número inteiro.' })
    .min(1960, { message: 'Ano mínimo é 1960.' })
    .max(anoAtual, { message: `Ano não pode ser maior que ${anoAtual}.` }),

  imported: z.boolean({
    required_error: 'Campo "importado" deve ser true ou false.'
  }),

  plates: z.string()
    .trim()
    .length(8, { message: 'A placa deve ter exatamente 8 caracteres (ex: ABC-1A23).' }),

  selling_date: z.coerce.date()
    .min(dataMinimaVenda, { message: 'Data mínima de venda é 01/01/2020.' })
    .max(dataMaximaVenda, { message: 'Data de venda não pode estar no futuro.' })
    .optional(),

  selling_price: z.number()
    .min(1000, { message: 'Preço mínimo é R$ 1.000,00.' })
    .max(5000000, { message: 'Preço máximo é R$ 5.000.000,00.' })
    .optional()
})

export default Cars
