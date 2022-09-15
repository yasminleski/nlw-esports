import { PrismaClient } from '@prisma/client'
import cors from 'cors'
import express from 'express'

import { convertHourStringToMinutes } from './utils/convertHourStringToMinutes'
import { convertMinutesToHour } from './utils/convertMinutesToHour'

const prisma = new PrismaClient()
const app = express()

app.use(express.json())
app.use(cors())

app.get('/games', async (req, res) => {
  const games = await prisma.game.findMany({
    include:{
      _count:{
        select:{
          ads: true
        }
      }
    }
  })

  return res.json(games)
})

app.get('/games/:id/ads', async (req, res) => {
  const gameId = req.params.id

  const ads = await prisma.ad.findMany({
    select:{
      name: true,
      yearsPlaying: true,
      discord: true,
      weekDays: true,
      hourStart: true,
      hourEnd: true,
      useVoiceChannel: true,
    },
    where:{
      gameId
    },
    orderBy:{
      createdAt: 'desc'
    }
  })

  return res.json(ads.map(ad => {
    return {
      ...ad,
      weekDays: ad.weekDays.split(','),
      hourStart: convertMinutesToHour(ad.hourStart),
      hourEnd: convertMinutesToHour(ad.hourEnd)
    }
  }))
})

app.post('/games/:id/ads', async (req, res) => {
  const gameId = req.params.id
  const body = req.body

  const ad =  await prisma.ad.create({
   data: {
    gameId,
    name: body.name,
    yearsPlaying: body.yearsPlaying,
    discord: body.discord,
    weekDays: body.weekDays.join(','),
    hourStart: convertHourStringToMinutes(body.hourStart),
    hourEnd: convertHourStringToMinutes(body.hourEnd),
    useVoiceChannel: body.useVoiceChannel,
   }
  })

  return res.status(201).json(ad)
})

app.get('/ads/:id/discord', async (req, res) => {
  const adId = req.params.id

  const ad = await prisma.ad.findUniqueOrThrow({
    select:{
      discord: true
    },
    where:{
      id: adId
    }
  })

  return res.json(ad)
})

app.listen(3030, () => console.log('Navegando'))