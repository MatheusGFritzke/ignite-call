/* eslint-disable camelcase */
import { prisma } from '@/src/lib/prisma'
import dayjs from 'dayjs'
import { NextApiRequest, NextApiResponse } from 'next'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') return res.status(405).end()

  const username = String(req.query.username)
  const { date, timezoneOffSet } = req.query

  if (!date || !timezoneOffSet) {
    return res
      .status(400)
      .json({ message: 'Date or timezoneOffSet not provided.' })
  }

  const user = await prisma.user.findUnique({
    where: { username },
  })

  if (!user) return res.status(404).json({ message: 'User not found.' })

  const referenceDate = dayjs(String(date))
  const isPastDate = referenceDate.endOf('day').isBefore(new Date())

  const timezoneOffSetInHours =
    typeof timezoneOffSet === 'string'
      ? Number(timezoneOffSet) / 60
      : Number(timezoneOffSet[0]) / 60

  const referenceDateTimeZoneOffsetInHours =
    referenceDate.toDate().getTimezoneOffset() / 60

  if (isPastDate) return res.json({ possibleTimes: [], availableTimes: [] })

  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.get('day'),
    },
  })

  if (!userAvailability)
    return res.json({ possibleTimes: [], availableTimes: [] })

  const { time_start_in_minutes, time_end_in_minutes } = userAvailability

  const startHour = time_start_in_minutes / 60
  const endHour = time_end_in_minutes / 60

  const possibleTimes = Array.from({ length: endHour - startHour }).map(
    (_, i) => {
      return startHour + i
    },
  )
  const blockedTimes = await prisma.scheduling.findMany({
    select: {
      date: true,
    },
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate
          .set('hour', startHour)
          .add(timezoneOffSetInHours, 'hours')
          .toDate(),
        lte: referenceDate
          .set('hour', endHour)
          .add(timezoneOffSetInHours, 'hours')
          .toDate(),
      },
    },
  })

  const availableTimes = possibleTimes.filter((time) => {
    const isTimeBlocked = blockedTimes.some(
      (blockedTime) =>
        blockedTime.date.getUTCHours() - timezoneOffSetInHours === time,
    )

    const isTimeInPast = referenceDate
      .set('hour', time)
      .subtract(referenceDateTimeZoneOffsetInHours, 'hours')
      .isBefore(dayjs().utc().subtract(timezoneOffSetInHours, 'hours'))

    return !isTimeBlocked && !isTimeInPast
  })

  return res.json({ availableTimes, possibleTimes })
}
