import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { ptBR } from 'date-fns/locale/pt-BR'
import { parseISO } from 'date-fns'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import InputMask from 'react-input-mask'
import { feedbackWait, feedbackNotify, feedbackConfirm } from '../../ui/Feedback'
import { useNavigate, useParams } from 'react-router-dom'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

import Car from '../../models/cars'
import { ZodError } from 'zod'

import fetchAuth from '../../lib/fetchAuth'

export default function CarsForm() {

  // Lista de cores dos carros em ordem alfabética disponíveis para o usúario escolher
  const colors = [
    { value: 'AMARELO', label: 'AMARELO' },
    { value: 'AZUL', label: 'AZUL' },
    { value: 'BRANCO', label: 'BRANCO' },
    { value: 'CINZA', label: 'CINZA' },
    { value: 'DOURADO', label: 'DOURADO' },
    { value: 'LARANJA', label: 'LARANJA' },
    { value: 'MARROM', label: 'MARROM' },
    { value: 'PRATA', label: 'PRATA' },
    { value: 'PRETO', label: 'PRETO' },
    { value: 'ROSA', label: 'ROSA' },
    { value: 'ROXO', label: 'ROXO' },
    { value: 'VERDE', label: 'VERDE' },
    { value: 'VERMELHO', label: 'VERMELHO' },
  ]

  // Máscara para o formato da placa do carro
  const platesMaskFormatChars = {
    '9': '[0-9]',    // somente dígitos
    '$': '[0-9A-J]',  // dígito de 0 a 9 ou uma letra de A a J.
    'A': '[A-Z]',
  }

  // Cria um vetor com os anos disponíveis, do ano atual até 1951
  const years = [] 
  // Date() pega a data atual. ex: 8 de novembro de 2024. O getFullYear() pega só o ano, ex: 2024
  for (let year = new Date().getFullYear(); year >= 1951; year--) {   
    years.push(year) // add no vetor years
  }

  /* Defini os valores padrão do formulário que são uma string vazia. selling_price e selling_date 
  são null, porque são campos não obrigatórios. e imported é false porque é um bolleano */
  const formDefaults = {
    brand: '',
    model: '',
    color: '',
    year_manufacture: '',
    imported: false,
    plates: '',
    selling_price: '',
    selling_date: null
  }

  const navigate = useNavigate()
  const params = useParams()

  const [state, setState] = React.useState({
    car: { ...formDefaults },
    formModified: false
  })
  const {
    car,
    formModified
  } = state
  

  /*Se estivermos editando um carro, precisamos carregar seus dados assim que o componente for carregado */
  React.useEffect(() => {
    /*Sabemos que estamos editando (e não cadastrando um novo) carro quando a rota ativa contiver um parâmetro id */
    if (params.id) loadData()
  }, [])

  // Função para carregar os dados de um carro existente da API
  async function loadData() {
    feedbackWait(true)
    try {
      const result = await fetchAuth.get('/cars/' + params.id)
  
      if (result.selling_date) {
        result.selling_date = parseISO(result.selling_date)
      }
  
      setState({ ...state, car: result, formModified: false })
    }
    catch(error) {
      console.log(error)
      feedbackNotify('ERRO: ' + error.message, 'error')
    }
    finally {
      feedbackWait(false)
    }
  }
  

  /* Preenche o campo do objeto car conforme o campo correspondente do formulário for modificado */
  function handleFieldChange(event) {
    // Tira uma cópia da variável de estado car
    const carsCopy = { ...car }
    // Altera em carsCopy apenas o campo da vez
    carsCopy[event.target.name] = event.target.value
    // Atualiza a variável de estado, substituindo o objeto car por sua cópia atualizada
    setState({ ...state, car: carsCopy, formModified: true })
  }

  // Função para salvar os dados do formulário
  async function handleFormSubmit(event) {
    event.preventDefault()      // Impede o recarregamento da página
    feedbackWait(true)

    try {
      // 🔍 Conversão dos tipos antes da validação
      const carData = {
        ...car,
        selling_price: car.selling_price ? Number(car.selling_price) : undefined,
        year_manufacture: Number(car.year_manufacture),
        selling_date: car.selling_date ? new Date(car.selling_date) : undefined
      }

      // ⚠️ Limpa valores opcionais se estiverem vazios (evita erro de string)
      if (carData.selling_price === '') carData.selling_price = undefined
      if (carData.selling_date === '') carData.selling_date = undefined
    
      console.log('🔎 Tipos antes do parse:')
      console.log('Tipo de selling_price:', typeof carData.selling_price, '| Valor:', carData.selling_price)
      console.log('Tipo de year_manufacture:', typeof carData.year_manufacture, '| Valor:', carData.year_manufacture)
      console.log('Tipo de selling_date:', typeof carData.selling_date, '| Valor:', carData.selling_date)
    
      // ✅ Validação com Zod
      Car.parse(carData)
    
      // 💾 Envio ao back-end
      if (params.id) {
        await fetchAuth.put('/cars/' + params.id, carData)
      } else {
        await fetchAuth.post('/cars', carData)
      }
    
      feedbackNotify('Item salvo com sucesso.', 'success', 4000, () => {
        navigate('..', { relative: 'path', replace: true })
      })
    }
    catch(error) {
      console.log(error)
    
      if (error instanceof ZodError) {
        feedbackNotify('Erro de validação. Verifique os campos.', 'error')
        for (let issue of error.errors) {
          console.warn(`[${issue.path}] ${issue.message}`)
        }
        return  // ⚠️ Impede que o código continue após erro de validação
      }
    
      feedbackNotify('ERRO: ' + error.message, 'error')
    }
    finally {
      feedbackWait(false)
    }
    
    




  }

  // Função para voltar para a página anterior
  async function handleBackButtonClick() {
    if(
      formModified && 
      ! await feedbackConfirm('Há informações não salvas. Deseja realmente voltar?')
    ) return // Sai da função sem fazer nada

    // Aqui o usuário respondeu que quer voltar e perder os dados
    navigate('..', { relative: 'path', 'replace': true })
  }

  return (
    <>
      { /* gutterBottom coloca um espaçamento extra abaixo do componente */ }
      <Typography variant="h1" gutterBottom>
        {params.id ? `Editar veículo #${params.id}` : 'Cadastrar novo veículo'}
      </Typography>

      <Box className="form-fields">
        <form onSubmit={handleFormSubmit}>

          {/* autoFocus = foco do teclado no primeiro campo */}
          <TextField
            variant="outlined" 
            name="brand"
            label="Marca do carro"
            fullWidth
            required
            autoFocus
            value={car.brand}
            onChange={handleFieldChange}
          />
          <TextField
            variant="outlined" 
            name="model"
            label="Modelo do carro"
            fullWidth
            required
            value={car.model}
            onChange={handleFieldChange}
          />
          <TextField
            select
            variant="outlined" 
            name="color"
            label="Cor"
            fullWidth
            required
            value={car.color}
            onChange={handleFieldChange}
          > 
          {/* Lista de cores para selecionar */}
          {colors.map(s => 
                <MenuItem key={s.value} value={s.value}>
                  {s.label}
                </MenuItem>
              )}
          </TextField>
          <TextField
            select
            variant="outlined" 
            name="year_manufacture"
            label="Ano de fabricação"
            fullWidth
            required
            value={car.year_manufacture}
            onChange={handleFieldChange}
          >
            {/* Lista de anos para selecionar */}
            {years.map(y => 
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              )}
          </TextField>

          {/* Checkbox para marcar se o carro é importado */}
          <div className="MuiFormControl-root">
            <FormControlLabel
              control={
                <Checkbox
                  name='imported'
                  checked={car.imported}
                  onChange={(event)=> 
                    setState({ ...state, car: { ...car, imported: event.target.checked}, formModified: true})
                  }
                />
              }
              label='É importado?'
            />
          </div>    
          {/* Campo para placa do carro com a máscara*/}
          <InputMask
            mask='AAA-9$99'
            value={car.plates}
            onChange={handleFieldChange}
            formatChars={platesMaskFormatChars}
          >
            { () => 
                <TextField
                  variant="outlined" 
                  name="plates"
                  label="Placa" 
                  fullWidth
                  required
                />
            }
          </InputMask>
          <TextField
            variant="outlined" 
            name="selling_price"
            label="Preço de venda"
            fullWidth
            required
            type='number'
            value={car.selling_price}
            onChange={handleFieldChange}
          />

          {/*
            O evento onChange do componente DatePicker não passa
            o parâmetro event, como no TextField, e sim a própria
            data que foi modificada. Por isso, ao chamar a função
            handleFieldChange no DatePicker, precisamos criar um
            parâmetro event "fake" com as informações necessárias
          */}
          <LocalizationProvider 
            dateAdapter={AdapterDateFns}
            adapterLocale={ptBR}
          >
            <DatePicker
              label="Data de venda"
              value={car.selling_date || null}
              slotProps={{
                textField: {
                  variant: 'outlined',
                  fullWidth: true
                }
              }}
              onChange={ date => {
                const event = { target: { name: 'selling_date', value: date } }
                handleFieldChange(event)
              }}
            />
          </LocalizationProvider>

          <Box sx={{ 
            display: 'flex',
            justifyContent: 'space-around',
            width: '100%'
          }}>
            <Button
              variant="contained"
              color="secondary"
              type="submit"
            >
              Salvar
            </Button>

            <Button
              variant="outlined"
              onClick={handleBackButtonClick}
            >
              Voltar
            </Button>
          </Box>

          <Box sx={{
            fontFamily: 'monospace',
            display: 'flex',
            flexDirection: 'column',
            width: '100%'
          }}>
            {JSON.stringify(car, null, 2)}
          </Box>

        </form>
      </Box>
      
    </>
  )
}