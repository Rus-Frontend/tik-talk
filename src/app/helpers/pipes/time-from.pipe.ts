import {Pipe, PipeTransform, signal} from '@angular/core';
import { DateTime } from "luxon";

@Pipe({
  name: 'timeFrom'
})
export class TimeFromPipe implements PipeTransform {

  transform(value: string | null): string | null {
    if (!value) return null

    const now = DateTime.now()
    const offset = now.offset
    const postTime = DateTime.fromISO(value!).plus({minutes: offset})
    // const diffTime = now.diff(postTime, 'minutes')
    // let timeFrom = ''

    // if (diffTime.minutes < 60) {
    //   if (diffTime.minutes.toFixed()[diffTime.minutes.toFixed().length-1] === '1') {
    //     timeFrom = `(${diffTime.minutes.toFixed().toString()} минуту назад)`
    //   }
    //
    //   if (diffTime.minutes.toFixed()[diffTime.minutes.toFixed().length-1] === '2' || '3' || '4') {
    //     timeFrom = `(${diffTime.minutes.toFixed().toString()} минуты назад)`
    //   }
    //
    //   if (diffTime.minutes.toFixed()[diffTime.minutes.toFixed().length-1] === '0' || '5' || '6' || '7' || '8' || '9') {
    //     timeFrom = `(${diffTime.minutes.toFixed().toString()} минут назад)`
    //   }
    // }
    //
    // if (diffTime.minutes >= 60 && diffTime.minutes < 1440) {
    //
    //   if ((diffTime.minutes / 60).toFixed()[diffTime.minutes.toFixed().length-1] === '1') {
    //
    //     timeFrom = `(${(diffTime.minutes / 60).toFixed().toString()} час назад)`
    //   }
    //
    //   if ((diffTime.minutes / 60).toFixed()[diffTime.minutes.toFixed().length-1] === '2' || '3' || '4') {
    //     timeFrom = `(${(diffTime.minutes / 60).toFixed().toString()} часа назад)`
    //   }
    //
    //   if ((diffTime.minutes / 60).toFixed()[diffTime.minutes.toFixed().length-1] === '0' || '5' || '6' || '7' || '8' || '9') {
    //     timeFrom = `(${(diffTime.minutes / 60).toFixed().toString()} часов назад)`
    //   }
    // }
    //
    // if (diffTime.minutes >= 1440) {
    //   console.log (`Длина: ${(diffTime.minutes.toFixed())}`)
    //   console.log (diffTime.minutes.toFixed()[(diffTime.minutes.toFixed()).length-1])
    //
    //   if ((diffTime.minutes / 1440).toFixed()[diffTime.minutes.toFixed().length-1] === '1') {
    //     timeFrom = `(${(diffTime.minutes / 1440).toFixed().toString()} день назад)`
    //   }
    //
    //   if ((diffTime.minutes / 1440).toFixed()[diffTime.minutes.toFixed().length-1] === '2') {
    //     timeFrom = `(${(diffTime.minutes / 1440).toFixed().toString()} дня назад)`
    //   }
    //
    //   if ((diffTime.minutes / 1440).toFixed()[diffTime.minutes.toFixed().length-1] === '0' || '5' || '6' || '7' || '8' || '9') {
    //     timeFrom = `(${(diffTime.minutes / 1440).toFixed().toString()} дней назад)`
    //   }
    // }
    // return timeFrom

    return (`(${postTime.toRelative()})`).toString()
    }

}


