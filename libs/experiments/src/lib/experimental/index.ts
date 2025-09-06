import { FormsExperimentComponent } from './forms-experiment/forms-experiment.component';
import { Feature, MockService } from './forms-experiment/mock.service';
import { NameValidator } from './forms-experiment/name.validator';
import { CompaniesInputComponent } from './my-forms-experiment/companies-input/companies-input.component'
import { CompanyData } from './my-forms-experiment/companies-input/interface/company-data'
import { MyFormsExperimentComponent } from './my-forms-experiment/my-forms-experiment.component';
import { MyMockService, Receiver } from './my-forms-experiment/my-mock.service';

export {
  MyMockService,
  NameValidator,
  MockService,
  FormsExperimentComponent,
  MyFormsExperimentComponent,
	CompaniesInputComponent
};

export type { Receiver, Feature, CompanyData };
