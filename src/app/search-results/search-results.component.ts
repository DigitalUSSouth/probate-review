import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APIService, ListProbateRecordsQuery, ListLineItemsQuery, ModelLineItemFilterInput, ModelProbateRecordFilterInput, ProbateRecord, ModelIDInput } from '../API.service';
import { PageEvent } from '@angular/material/paginator';
import { LineItem } from 'src/models';
import { urlSafeDecode } from '@aws-amplify/core';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.sass']
})
export class SearchResultsComponent implements OnInit {
  records?: ProbateRecord[];
  documents?: Document[];
  // MatPaginator Inputs
  length = 50;
  pageSize = 100;
  pageSizeOptions: number[] = [1, 5, 10, 25, 100];
  pageIndex = 0;
  // MatPaginator Output
  pageEvent?: PageEvent;
  displayedColumns: string[] = ['thumbnail', 'title', 'description'];
  recordNextToken: string | undefined;
  lineItemNextToken: string | undefined;
  recordIdsToFetch = new Set<string>();
  constructor(private route: ActivatedRoute, private probateRecordService: APIService) { }

  ngOnInit(): void {
    this.fetchRcords();
  }

  getIdFilterFromArray(ids: string[]): ModelProbateRecordFilterInput {
    let filter: ModelProbateRecordFilterInput = {}
    filter.or = ids.map(i => ({id: {eq: i}}));
    return filter;
  }

  async fetchRcords(): Promise<void> {
    const q = decodeURIComponent(String(this.route.snapshot.paramMap.get('q')));
    console.log(q);
    // let filter: ModelProbateRecordFilterInput;
    let probateFilter: ModelProbateRecordFilterInput = {
      or: [
        {
          title: {
            contains: q
          }
        },
        {
          appraiser: {
            contains: q
          }
        },
        {
          witness: {
            contains: q
          }
        }

      ]
    };


    let recordsQuery: ListProbateRecordsQuery = await this.probateRecordService.ListProbateRecords(undefined, probateFilter, this.pageSize, this.recordNextToken);
    console.log(recordsQuery);
    console.log(recordsQuery!.items);
    this.records = recordsQuery!.items!.map(x => x as ProbateRecord);
    this.length = this.records.length;

    this.recordNextToken = (recordsQuery.nextToken) ? recordsQuery.nextToken : undefined;

    await this.fetchLineItems(q, this.pageSize - this.records.length);

    // fetch probate ids 
    let ids = Array.from(this.recordIdsToFetch.values());
    console.log('ids to fetch');
    console.log(ids);
    if (ids.length) {
      probateFilter = (ids.length > 1) ? 
          this.getIdFilterFromArray(ids)
         :
      {
        id: {
          eq: ids[0]
        }
      }
      console.log('filter');
      console.log(probateFilter);
      recordsQuery = await this.probateRecordService.ListProbateRecords(undefined, probateFilter, this.pageSize, this.recordNextToken);
      console.log(recordsQuery);
      console.log(recordsQuery!.items);
      this.records = this.records.concat(recordsQuery!.items.map(x => x as ProbateRecord));
      this.recordIdsToFetch.clear();
    }
  }

  async fetchLineItems(q: string, maxCount: number): Promise<void> {
    // filter our line items
    let lineItemFilter: ModelLineItemFilterInput = {
      or: [
        {
          title: {
            contains: q
          }
        },
        {
          category: {
            contains: q
          }
        },
        {
          subcategory: {
            contains: q
          }
        }
      ]
    };  
    
    lineItemFilter = {
      title: {
        contains: q
      }
    }

    console.log('line item filter');
    console.log(lineItemFilter);

    let lineItemQuery: ListLineItemsQuery = await this.probateRecordService.ListLineItems(lineItemFilter, maxCount, this.lineItemNextToken);
    for (const lineItem of lineItemQuery.items) {
      this.recordIdsToFetch.add(lineItem!.probateId);
    }
    console.log('line item query');
    console.log(lineItemQuery);
    console.log(lineItemQuery!.items);
    this.lineItemNextToken = (lineItemQuery.nextToken) ? lineItemQuery.nextToken : undefined;
    console.log('next token: ' + this.lineItemNextToken);

  }

  handlePageEvent(event: PageEvent) {
    this.length = event.length;
    if (this.pageSize != event.pageSize) {
      this.pageSize = event.pageSize;
      this.recordNextToken = undefined;
    }
    this.pageIndex = event.pageIndex;
    this.fetchRcords();
  }
}
