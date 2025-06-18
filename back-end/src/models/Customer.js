import { z } from 'zod'
import { cpf } from 'cpf-cnpj-validator'

/*
  O cliente deve ser maior de 18 anos.
  Por isso, para validar a data de nascimento, calculamos a data
  máxima que o cliente pode ter nascido (no passado) para ter
  pelo menos 18 anos na data atual
*/
const maxDateOfBirth = new Date()  // Hoje
maxDateOfBirth.setFullYear(maxDateOfBirth.getFullYear() - 18)

// O cliente pode ter nascido, no máximo, há 120 anos
const minDateOfBirth = new Date()
minDateOfBirth.setFullYear(minDateOfBirth.getFullYear() - 120)

// Unidades da Federação
const unidadesFederacao = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
]

const Customer = z.object({
  name: z.string()
    .trim()   // Retira espaços em branco do início e do fim
    .min(5, { message: 'O nome deve ter, no mínimo, 5 caracteres.'})
    .max(100, { message: 'O nome pode ter, no máximo, 100 caracteres.'})
    .includes(' ', { message: 'O nome deve ter um espaço em branco separando nome e sobrenome.'}),
  
  ident_document: z.string()
    // Remove eventuais sublinhados se o usuário não preencheu
    // totalmente o CPF
    .transform(val => val.replace('_', ''))
    .refine(val => val.length === 14, {
      message: 'O CPF deve ter exatamente 14 dígitos.'
    })
    .refine(val => cpf.isValid(val), {
      message: 'CPF inválido.'
    }),

  birth_date:
    // Força a conversão para o tipo Date, caso string seja recebido
    z.coerce.date()
    .min(minDateOfBirth, {
      message: 'Data de nascimento está muito no passado.'
    })
    .max(maxDateOfBirth, {
      message: 'O cliente deve ser maior de 18 anos.'
    })
    .nullish(),    // O campo é opcional   

  street_name: z.string()
    .trim()   // Retira espaços em branco do início e do fim
    .min(1, { message: 'Logradouro deve ter, no mínimo, 1 caractere. ' })
    .max(40, { message: 'Logradouro pode ter, no máximo, 40 caracteres.' }),

  house_number: z.string()
    .trim()   // Retira espaços em branco do início e do fim
    .min(1, { message: 'Número do imóvel deve ter, no mínimo, 1 caractere. ' })
    .max(10, { message: 'Número do imóvel pode ter, no máximo, 10 caracteres.' }),

  complements: z.string()
    .max(20, { message: 'Complemento pode ter, no máximo, 20 caracteres.' })
    .nullish(),

  district: z.string()
    .trim()   // Retira espaços em branco do início e do fim
    .min(1, { message: 'Bairro deve ter, no mínimo, 1 caractere. ' })
    .max(25, { message: 'Bairro pode ter, no máximo, 25 caracteres.' }),

  municipality: z.string()
    .trim()   // Retira espaços em branco do início e do fim
    .min(1, { message: 'Município deve ter, no mínimo, 1 caractere. ' })
    .max(40, { message: 'Município pode ter, no máximo, 40 caracteres.' }),

  state: z.enum(unidadesFederacao, { 
      message: 'Unidade da Federação inválida ou não informada'
    }),

  phone: z.string()
    .transform(val => val.replace('_', ''))
    // Depois de um transform(), o Zod não permite usar length(). Por isso,
    // devemos usar uma função personalizada com refine() para validar o
    // comprimento do valor
    .refine(val => val.length === 15, {
      message: 'O número do telefone/celular deve ter 15 posições.'
    }),

  email: z.string()
    .email({ message: 'E-mail inválido.' })
  
})
export default Customer