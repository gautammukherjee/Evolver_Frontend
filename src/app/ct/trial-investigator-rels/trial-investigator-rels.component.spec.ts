import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialInvestigatorRelsComponent } from './trial-investigator-rels.component';

describe('TrialInvestigatorRelsComponent', () => {
  let component: TrialInvestigatorRelsComponent;
  let fixture: ComponentFixture<TrialInvestigatorRelsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrialInvestigatorRelsComponent]
    });
    fixture = TestBed.createComponent(TrialInvestigatorRelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
