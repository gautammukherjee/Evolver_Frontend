import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalTrialsDataAssociatedDiseaseComponent } from './clinical-trials-data-associated-disease.component';

describe('ClinicalTrialsDataAssociatedDiseaseComponent', () => {
  let component: ClinicalTrialsDataAssociatedDiseaseComponent;
  let fixture: ComponentFixture<ClinicalTrialsDataAssociatedDiseaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClinicalTrialsDataAssociatedDiseaseComponent]
    });
    fixture = TestBed.createComponent(ClinicalTrialsDataAssociatedDiseaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
