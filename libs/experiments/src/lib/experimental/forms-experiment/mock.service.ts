import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Feature {
  code: string;
  label: string;
  value: boolean;
}

@Injectable({ providedIn: 'root' })
export class MockService {
  constructor() {}

  getAddress() {
    return of([
      {
        city: 'Москва',
        street: 'Тверская',
        building: 12,
        apartment: 3,
      },
      {
        city: 'Санкт-Петербург',
        street: 'Полевая',
        building: 23,
        apartment: 36,
      },
    ]);
  }

  getFeatures(): Observable<Feature[]> {
    return of([
      {
        code: 'lift',
        label: 'Подъем на этаж',
        value: true,
      },
      {
        code: 'strong-package',
        label: 'Усиленная упаковка',
        value: true,
      },
      {
        code: 'fast',
        label: 'Ускоренная доставка',
        value: false,
      },
    ]);
  }
}
