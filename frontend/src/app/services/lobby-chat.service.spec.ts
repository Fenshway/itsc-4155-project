import { TestBed } from '@angular/core/testing';

import { LobbyChatService } from './lobby-chat.service';

describe('LobbyChatService', () => {
  let service: LobbyChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LobbyChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
