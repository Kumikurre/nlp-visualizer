import { TestBed } from '@angular/core/testing';

import { AudioapiService } from './audioapi.service';

describe('AudioapiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AudioapiService = TestBed.get(AudioapiService);
    expect(service).toBeTruthy();
  });
});
