import { FormsExperimentComponent } from './forms-experiment/forms-experiment.component';
import { Feature, MockService } from './forms-experiment/mock.service';
import { NameValidator } from './forms-experiment/name.validator';
import { MyFormsExperimentComponent } from './my-forms-experiment/my-forms-experiment.component';
import { MyMockService, Receiver } from './my-forms-experiment/my-mock.service';

export {
  MyMockService,
  NameValidator,
  MockService,
  FormsExperimentComponent,
  MyFormsExperimentComponent,
};

export type { Receiver, Feature };
