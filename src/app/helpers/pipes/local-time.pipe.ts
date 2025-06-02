import { Pipe, PipeTransform } from '@angular/core';
import {DateTime} from "luxon";

@Pipe({
  name: 'localTime'
})
export class LocalTimePipe implements PipeTransform {

  transform(value: string | null): string | null {
    if (!value) return null

    const now = DateTime.now()
    const offset = now.offset
    return DateTime.fromISO(value!).plus({minutes: offset}).toFormat('HH:mm dd.MM.yyyy').toString()
  }
}
