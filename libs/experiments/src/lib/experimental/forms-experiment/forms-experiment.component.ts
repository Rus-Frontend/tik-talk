import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  FormRecord,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Feature, MockService } from './mock.service';
import { KeyValuePipe } from '@angular/common';
import { NameValidator } from './name.validator';

enum ReceiverType {
  PERSON = 'PERSON',
  LEGAL = 'LEGAL',
}

interface Address {
  city?: string;
  street?: string;
  building?: number;
  apartment?: number;
}

function getAddressForm(initialValue: Address = {}) {
  return new FormGroup({
    city: new FormControl<string>(initialValue.city ?? ''),
    street: new FormControl<string>(initialValue.street ?? ''),
    building: new FormControl<number | null>(initialValue.building ?? null),
    apartment: new FormControl<number | null>(initialValue.apartment ?? null),
  });
}

function validateStartWith(forbiddenLetter: string): ValidatorFn {
  return (control: AbstractControl) => {
    return control.value.startsWith(forbiddenLetter)
      ? {
          startsWith: {
            message: `${forbiddenLetter} - последняя буква алфавита!`,
          },
        }
      : null;
  };
}

function validateDateRange({
  fromControlName,
  toControlName,
}: {
  fromControlName: string;
  toControlName: string;
}) {
  return (control: AbstractControl) => {
    const fromControl = control.get(fromControlName);
    const toControl = control.get(toControlName);

    if (!fromControl || !toControl) return null;

    const fromDate = new Date(fromControl.value);
    const toDate = new Date(toControl.value);

    if (fromDate && toDate && fromDate > toDate) {
      toControl.setErrors({
        dateRange: { message: 'Дата начала не может быть позднее даты конца' },
      });
      return {
        dateRange: { message: 'Дата начала не может быть позднее даты конца' },
      };
    }

    return null;
  };
}

@Component({
  selector: 'app-forms-experiment',
  imports: [ReactiveFormsModule, KeyValuePipe],
  templateUrl: './forms-experiment.component.html',
  styleUrl: './forms-experiment.component.scss',
})
export class FormsExperimentComponent {
  ReceiverType = ReceiverType;

  mockService = inject(MockService);
  nameValidator = inject(NameValidator);

  features: Feature[] = [];

  form = new FormGroup({
    type: new FormControl<ReceiverType>(ReceiverType.PERSON),
    // name: new FormControl<string>('', [Validators.required, validateStartWith('м')]),
    // name: new FormControl<string>('', [Validators.required], [this.nameValidator.validate.bind(this.nameValidator)]),
    name: new FormControl<string>('', {
      validators: [Validators.required],
      asyncValidators: [this.nameValidator.validate.bind(this.nameValidator)],
      updateOn: 'blur',
    }),
    inn: new FormControl<number | null>(null),
    lastName: new FormControl<string>({ value: 'ЗНАЧЕНИЕ', disabled: true }),
    // address: getAddressForm()
    address: new FormArray([getAddressForm()]),
    feature: new FormRecord({}),
    dateRange: new FormGroup(
      {
        from: new FormControl<string>(''),
        to: new FormControl<string>(''),
      },
      validateDateRange({ fromControlName: 'from', toControlName: 'to' })
    ),

    // form = new FormGroup({
    //   type: new FormControl<ReceiverType>(ReceiverType.PERSON),
    //   name: new FormControl<string>('', Validators.required),
    //   inn: new FormControl<number | null>(null),
    //   lastName: new FormControl<string>({value: 'ЗНАЧЕНИЕ', disabled: true}),
    //   address: new FormGroup({
    //     city: new FormControl<string>(''),
    //     street: new FormControl<string>(''),
    //     building: new FormControl<number | null>(null),
    //     apartment: new FormControl<number | null>(null),
    //   }),
  });

  constructor() {
    this.mockService
      .getAddress()
      .pipe(takeUntilDestroyed())
      .subscribe((addrs) => {
        // while (this.form.controls.address.controls.length > 0) {
        //   this.form.controls.address.removeAt(0)
        // }

        this.form.controls.address.clear(); // - альтернатива while выше

        for (const addr of addrs) {
          this.form.controls.address.push(getAddressForm(addr));
        }

        // this.form.controls.address.setControl(1, getAddressForm(addrs[0]))  // - так можно задать значение по указанному индексу 1
        // console.log(this.form.controls.address.at(0))
        // this.form.controls.address.disable() // - можно заблокировать ввод в поля формы
      });

    this.mockService
      .getFeatures()
      .pipe(takeUntilDestroyed())
      .subscribe((features) => {
        this.features = features;

        for (const feature of features) {
          this.form.controls.feature.addControl(
            feature.code,
            new FormControl(feature.value)
          );
        }
      });

    this.form.controls.type.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((val) => {
        this.form.controls.inn.clearValidators();

        if (val === ReceiverType.LEGAL) {
          this.form.controls.inn.setValidators([
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
          ]);
        }
      });
  }

  // const formPatch = {
  //   name: 'Алёша',
  //   lastName: 'Попович'

  //
  // this.form.patchValue(formPatch)
  // this.form.setValue({
  //   type: ReceiverType.PERSON,
  //   name: 'Алёша',
  //   inn: 89,
  //   lastName: 'Попович',
  //   address: {
  //     city: 'ddd',
  //     street: 'fff',
  //     building: 4,
  //     apartment: 7
  //   }
  // })

  // this.form.valueChanges.subscribe(val => console.log(val))

  onSubmit(event: SubmitEvent): void {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) return;

    console.log('this.form.value', this.form.value);
    console.log('getRawValue', this.form.getRawValue());

    // this.form.reset({
    //   type: ReceiverType.PERSON,
    //   name: 'LUCAS'
    // }, {
    //   emitEvent: false,
    //   onlySelf: true
    // })

    // const formPatch = {
    //   name: 'Алёша',
    //   lastName: 'Попович'
    // }

    // this.form.patchValue(formPatch, {
    //   // emitEvent: true
    //   emitEvent: false
    // })

    // this.form.controls.type.patchValue(ReceiverType.LEGAL, {
    //   // onlySelf: true,
    // })
  }

  addAddress() {
    this.form.controls.address.push(getAddressForm());
  }

  deleteAddress(index: number) {
    this.form.controls.address.removeAt(index, { emitEvent: false });
  }

  sort = () => 0;
}
