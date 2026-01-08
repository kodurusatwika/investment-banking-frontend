import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpParams } from '@angular/common/http';

import { DealService } from './deal.service';
import { Deal, DealType, DealStage, CreateDeal, AddNote } from '../models/deal.model';

describe('DealService', () => {
  let service: DealService;
  let httpMock: HttpTestingController;

  const mockDeal: Deal = {
    id: 1,
    clientName: 'Acme Corp',
    dealType: DealType.M_A,
    sector: 'Technology',
    dealValue: 50000000,
    currentStage: DealStage.PROSPECT,
    summary: 'Test deal',
    notes: [],
    createdBy: {
      id: 1,
      username: 'admin',
      email: 'admin@bank.com',
      role: 'ADMIN' as any,
      active: true,
      createdAt: '2024-01-01T00:00:00Z'
    },
    assignedTo: {
      id: 2,
      username: 'john',
      email: 'john@bank.com',
      role: 'USER' as any,
      active: true,
      createdAt: '2024-01-01T00:00:00Z'
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DealService]
    });

    service = TestBed.inject(DealService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('createDeal', () => {
    it('should create a new deal', () => {
      const newDeal: CreateDeal = {
        clientName: 'New Corp',
        dealType: DealType.M_A,
        sector: 'Finance',
        currentStage: DealStage.PROSPECT,
        summary: 'New deal',
        assignedToId: 1
      };

      service.createDeal(newDeal).subscribe(deal => {
        expect(deal).toEqual(mockDeal);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/deals');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newDeal);
      req.flush(mockDeal);
    });
  });

  describe('getDeals', () => {
    it('should get all deals without filters', () => {
      const mockDeals: Deal[] = [mockDeal];

      service.getDeals().subscribe(deals => {
        expect(deals).toEqual(mockDeals);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/deals');
      expect(req.request.method).toBe('GET');
      expect(req.request.params.toString()).toBe('');
      req.flush(mockDeals);
    });

    it('should get deals with filters', () => {
      const mockDeals: Deal[] = [mockDeal];
      const filters = {
        clientName: 'Acme',
        dealType: 'M_A',
        sector: 'Tech',
        stage: 'PROSPECT'
      };

      service.getDeals(filters).subscribe(deals => {
        expect(deals).toEqual(mockDeals);
      });

      const req = httpMock.expectOne(req => {
        return req.url === 'http://localhost:8080/api/deals' &&
               req.method === 'GET' &&
               req.params.get('clientName') === 'Acme' &&
               req.params.get('dealType') === 'M_A' &&
               req.params.get('sector') === 'Tech' &&
               req.params.get('stage') === 'PROSPECT';
      });
      req.flush(mockDeals);
    });
  });

  describe('getDealById', () => {
    it('should get deal by id', () => {
      const dealId = 1;

      service.getDealById(dealId).subscribe(deal => {
        expect(deal).toEqual(mockDeal);
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/deals/${dealId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockDeal);
    });
  });

  describe('updateDeal', () => {
    it('should update deal', () => {
      const dealId = 1;
      const updateData: CreateDeal = {
        clientName: 'Updated Corp',
        dealType: DealType.EQUITY_FINANCING,
        sector: 'Updated Sector',
        currentStage: DealStage.UNDER_EVALUATION,
        summary: 'Updated summary',
        assignedToId: 2
      };

      service.updateDeal(dealId, updateData).subscribe(deal => {
        expect(deal).toEqual(mockDeal);
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/deals/${dealId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush(mockDeal);
    });
  });

  describe('addNote', () => {
    it('should add note to deal', () => {
      const dealId = 1;
      const note: AddNote = { note: 'Test note' };

      service.addNote(dealId, note).subscribe(deal => {
        expect(deal).toEqual(mockDeal);
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/deals/${dealId}/notes`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(note);
      req.flush(mockDeal);
    });
  });

  describe('deleteDeal', () => {
    it('should delete deal', () => {
      const dealId = 1;

      service.deleteDeal(dealId).subscribe();

      const req = httpMock.expectOne(`http://localhost:8080/api/deals/${dealId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});