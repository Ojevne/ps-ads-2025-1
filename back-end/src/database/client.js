import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query'
      }
    ]
  })

// Exibe no console as instruções SQL enviadas ao BD
prisma.$on('query', event => {
  console.log('-'.repeat(60))
  console.log(event.query)
  if (event.params) console.log('PARAMS:', event.params)
})

// Previne múltiplas instâncias no ambiente dev/hot reload
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
