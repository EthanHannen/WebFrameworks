import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCurrentComponent } from './post-current.component';

describe('PostCurrentComponent', () => {
  let component: PostCurrentComponent;
  let fixture: ComponentFixture<PostCurrentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostCurrentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostCurrentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
