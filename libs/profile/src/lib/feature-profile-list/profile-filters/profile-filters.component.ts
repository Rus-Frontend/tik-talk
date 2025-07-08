import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, startWith, Subscription } from 'rxjs';
import {
	profileActions,
	selectProfileFilters
} from '@tt/data-access'
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-profile-filters',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './profile-filters.component.html',
  styleUrl: './profile-filters.component.scss',
})
export class ProfileFiltersComponent implements OnDestroy {
  fb = inject(FormBuilder);
  store = inject(Store);

	filters = this.store.selectSignal(selectProfileFilters)


  searchForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    stack: [''],
  });

  searchFormSub!: Subscription;

  constructor() {
		this.searchForm.patchValue(this.filters())
		this.searchFormSub = this.searchForm.valueChanges
      .pipe(
        startWith(this.filters()),
        debounceTime(1000),
      )
      .subscribe(formValue => {
				this.store.dispatch(profileActions.filterEvents({filters: formValue}))
      });
  }

  ngOnDestroy() {
    this.searchFormSub.unsubscribe();
  }
}
