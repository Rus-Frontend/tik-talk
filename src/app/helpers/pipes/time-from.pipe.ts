import {Pipe, PipeTransform} from '@angular/core';
import { DateTime } from "luxon";

@Pipe({
  name: 'timeFrom'
})
export class TimeFromPipe implements PipeTransform {

  transform(value: string | null, format?: string | null): string | null{
    if (!value) return null

    const now = DateTime.now()
    const offset = now.offset
    const postTime = DateTime.fromISO(value!).plus({minutes: offset})

    if (now.toFormat('dd.MM.yyyy').toString() === postTime.toFormat('dd.MM.yyyy').toString() && format === 'Today') {
      return ('Сегодня')
    } else {
      if (Number(now.diff(postTime).toFormat('dd')) < 1 && format === 'Today') {
        return ('Вчера')
      }
      return (`${postTime.toRelative()}`).toString()
      }
    }
}


