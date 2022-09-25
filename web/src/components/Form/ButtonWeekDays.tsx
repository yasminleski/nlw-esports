import * as ToggleGroup from '@radix-ui/react-toggle-group';

interface ButtonWeekDaysProps{
    value: string
    weekDay: string
    weekDays: string[]
}

export function ButtonWeekDays(props: ButtonWeekDaysProps) {
    return (
        <ToggleGroup.Item
            value={props.value}
            className={`w-8 h-8 rounded ${props.weekDays.includes(props.value) ? 'bg-violet-500' : 'bg-zinc-900'}`}
          >
          {props.weekDay}
        </ToggleGroup.Item>
    )
}