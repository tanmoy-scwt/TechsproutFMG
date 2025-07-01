"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TimePickerProps {
  time: string
  setTime: (time: string) => void
}

export default function TimePicker({ time, setTime }: TimePickerProps) {
  const [hour, minute, period] = React.useMemo(() => {
    const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/)
    if (match) {
      const [_, h, m, p] = match
      return [parseInt(h), parseInt(m), p]
    }
    return [12, 0, "AM"]
  }, [time])
  

  const handleHourChange = (value: string) => {
    const newHour = parseInt(value).toString().padStart(2, '0')
    setTime(`${newHour}:${minute.toString().padStart(2, '0')} ${period}`)
  }

  const handleMinuteChange = (value: string) => {
    const newMinute = value.padStart(2, '0')
    setTime(`${hour.toString().padStart(2, '0')}:${newMinute} ${period}`)
  }

  const handlePeriodChange = (newPeriod: string) => {
    setTime(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${newPeriod}`)
  }


  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="flex items-center gap-2">
        <Select value={hour.toString()} onValueChange={handleHourChange}>
          <SelectTrigger className="w-[4.5rem] rounded-none h-[45px]">
            <SelectValue placeholder="HH" />
          </SelectTrigger>
          <SelectContent className="h-[200px]">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
              <SelectItem key={h} value={h.toString()}>
                {h.toString().padStart(2, '0')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={minute.toString()} onValueChange={handleMinuteChange}>
          <SelectTrigger className="w-[4.5rem] rounded-none h-[45px]">
            <SelectValue placeholder="MM" />
          </SelectTrigger>
          <SelectContent className="h-[200px]">
            {Array.from({ length: 60 }, (_, i) => i).map((m) => (
              <SelectItem key={m} value={m.toString()}>
                {m.toString().padStart(2, '0')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={period} onValueChange={handlePeriodChange}>
          <SelectTrigger className="w-[4.5rem] rounded-none h-[45px]">
            <SelectValue placeholder="AM/PM" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AM">AM</SelectItem>
            <SelectItem value="PM">PM</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

