import { useState } from 'react'
import { CalendarStep } from './ScheduleForm/CalendarStep'
import { ConfirmStep } from './ScheduleForm/ConfirmStep'

export function ScheduleForm() {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>()

  function handleClearSelectedDateTime() {
    setSelectedDateTime(null)
  }

  if (selectedDateTime)
    return (
      <ConfirmStep
        schedulingDate={selectedDateTime}
        onRedirectToCalendar={handleClearSelectedDateTime}
      />
    )

  return <CalendarStep onSelectDateTime={setSelectedDateTime} />
}
