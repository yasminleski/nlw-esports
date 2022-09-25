import * as Checkbox from '@radix-ui/react-checkbox';
import * as Dialog from '@radix-ui/react-dialog';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import axios from 'axios';
import { Check, GameController } from 'phosphor-react';
import { FormEvent, useEffect, useState } from 'react';
import { ButtonWeekDays } from './Form/ButtonWeekDays';
import { Input } from "./Form/Input";

interface Game {
   id: string
   title: string
}

export function CreateAdModal(){   
   const [games, setGames] = useState<Game[]>([])
   const [weekDays, setWeekDays] = useState<string[]>([])
   const [useVoiceChannel, setuUeVoiceChannel] = useState(false)

   useEffect(() => {
      axios('http://localhost:3030/games')
      .then(response => { setGames(response.data) })
   }, [])

   function handleCreateAd(event: FormEvent){
      event.preventDefault()

      const formData = new FormData(event.target as HTMLFormElement)
      const data = Object.fromEntries(formData)

      axios.post(`http://localhost:3030/games/${data.game}/ads`, {
         name: data.name,
         yearsPlaying:  Number(data.yearsPlaying),
         discord: data.discord,
         weekDays: weekDays.map(Number),
         hourStart: data.hourStart,
         hourEnd: data.hourEnd,
         useVoiceChannel: useVoiceChannel,
      })
      return true
   }

   return (
      <Dialog.Portal>
      <Dialog.Overlay className='bg-black/60 inset-0 fixed'/>
      <Dialog.Content className='fixed bg-[#2A2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] shadow-lg shadow-black/25'>
      <Dialog.Title className='text-3xl font-black'>Publique um anúncio</Dialog.Title>    
                              
      <form onSubmit={handleCreateAd} className='mt-8 flex flex-col gap-4'>
         <div className='flex flex-col gap-2'>
            <label htmlFor="game" className='font-semibold'>Qual o game?</label>
            <select
               name='game'
               id='game'
               className='bg-zinc-900 py-3 px-4 rounded text-lg placeholder:text-zinc-500 appearance-none'
               defaultValue=''
               >
               <option disabled  value="">Selecione o game que deseja jogar</option>

               {
                  games.map(game =>{
                     return <option key={game.id} value={game.id}>{game.title}</option>                       
                  })
               }
            </select>
         </div>
         <div className='flex flex-col gap-2'>
            <label htmlFor="game" className='font-semibold'>Seu nome (ou nickname)</label>
            <Input name='name' id='name' placeholder='Como te chamam dentro do game?'/>
         </div>
         <div className='grid grid-cols-2 gap-6'>
            <div className='flex flex-col gap-2'>
               <label htmlFor="yearsPlaying" className='font-semibold'>Joga há quantos anos?</label>
               <Input name='yearsPlaying' id='yearsPlaying' type='numer' placeholder='Tudo bem ser ZERO'/>
            </div>
            <div className='flex flex-col gap-2'>
               <label htmlFor="discord" className='font-semibold'>Qual seu Discord?</label>
               <Input name='discord' id='discord' type='text' placeholder='Usuario#0000'/>
            </div>
         </div>
         <div className='flex gap-6'>
            <div className='flex flex-col gap-2'>
               <label htmlFor="weekDays">Quando costuma jogar?</label>

               <ToggleGroup.Root 
                  type='multiple'
                  value={weekDays}
                  onValueChange={setWeekDays}
               >
                  <ButtonWeekDays value='0' weekDay='D' weekDays={weekDays} />
                  <ButtonWeekDays value='1' weekDay='S' weekDays={weekDays} />
                  <ButtonWeekDays value='2' weekDay='T' weekDays={weekDays} />
                  <ButtonWeekDays value='3' weekDay='Q' weekDays={weekDays} />
                  <ButtonWeekDays value='4' weekDay='Q' weekDays={weekDays} />
                  <ButtonWeekDays value='5' weekDay='S' weekDays={weekDays} />
                  <ButtonWeekDays value='6' weekDay='S' weekDays={weekDays} />
               </ToggleGroup.Root>
            </div>
            <div className='flex flex-col gap-2 flex-1'>
               <label htmlFor="hourStart">Qual horário do dia?</label>
               <div className='grid grid-cols-2 gap-2'>
                  <Input name='hourStart' id='hourStart' type='time' placeholder='De'/>
                  <Input name='hourEnd' id='hourEnd' type='time' placeholder='Até'/>
               </div>
            </div>
         </div>

         <label>
            <Checkbox.Root 
            checked={useVoiceChannel}
            onCheckedChange={(checked) => {
               checked === true ? setuUeVoiceChannel(true) : setuUeVoiceChannel(false)
            }

            } 
            className='w-6 h-6 p-1 rounded bg-zinc-900'>
            <Checkbox.Indicator>
               <Check className='w-4 h-4 text-emerald-400'/>               
            </Checkbox.Indicator>
            </Checkbox.Root>
            Costumo me conectar ao chat de voz
         </label>

         <footer className='mt-4 flex justify-end gap-4'>
            <Dialog.Close className='bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600' type='button'>
               Cancelar
            </Dialog.Close>
            <button  type='submit' className='bg-violet-500 px-5 h-12 rounded-md font-semibold flex items-center gap-3 hover:bg-violet-600'>
               <GameController size={24} />
               Encontrar duo
            </button>
         </footer>
      </form>            
      </Dialog.Content>
      </Dialog.Portal>
   )
}
