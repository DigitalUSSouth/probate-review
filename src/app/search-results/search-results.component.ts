import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APIService, ListProbateRecordsQuery, ListLineItemsQuery, ModelLineItemFilterInput, ModelProbateRecordFilterInput, ProbateRecord, ModelIDInput } from '../API.service';
import { PageEvent } from '@angular/material/paginator';
import { LineItem } from 'src/models';


@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.sass']
})
export class SearchResultsComponent implements OnInit {
  records?: ProbateRecord[];
  documents?: Document[];
  loading = false;
  warning: string | null = null;
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
  readonly MAX_RESULTS = 2000;
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
    this.loading = true;
    this.warning = null;
    try {
      const q = decodeURIComponent(String(this.route.snapshot.paramMap.get('q')));
      console.log(q);
      let probateFilter: ModelProbateRecordFilterInput = {
        or: [
          {
            title: {
              contains: q
            }
          }
        ]
      };

      let allRecords: ProbateRecord[] = [];
      let nextToken: string | undefined = undefined;
      let totalFetched = 0;
      do {
        let recordsQuery: ListProbateRecordsQuery = await this.probateRecordService.ListProbateRecords(undefined, probateFilter, this.pageSize, nextToken);
        const items = (recordsQuery!.items || []).map(x => x as ProbateRecord);
        allRecords = allRecords.concat(items);
        totalFetched += items.length;
        nextToken = recordsQuery.nextToken ? recordsQuery.nextToken : undefined;
        if (totalFetched >= this.MAX_RESULTS) {
          this.warning = `Showing first ${this.MAX_RESULTS} results. Please refine your search.`;
          break;
        }
      } while (nextToken);
      this.records = allRecords.slice(0, this.MAX_RESULTS);
      this.length = this.records.length;

      
      let ids = await this.fetchLineItems(q, this.MAX_RESULTS - this.records.length);
      ids = ids.filter(r => !(this.records!.map(id => id.id)).includes(r));
      if (ids.length) {
        probateFilter = (ids.length > 1) ?
            this.getIdFilterFromArray(ids)
           :
        {
          id: {
            eq: ids[0]
          }
        }
        let allExtraRecords: ProbateRecord[] = [];
        let extraNextToken: string | undefined = undefined;
        let extraFetched = 0;
        do {
          let recordsQuery: ListProbateRecordsQuery = await this.probateRecordService.ListProbateRecords(undefined, probateFilter, this.pageSize, extraNextToken);
          const items = (recordsQuery!.items || []).map(x => x as ProbateRecord);
          allExtraRecords = allExtraRecords.concat(items);
          extraFetched += items.length;
          extraNextToken = recordsQuery.nextToken ? recordsQuery.nextToken : undefined;
          if (this.records!.length + allExtraRecords.length >= this.MAX_RESULTS) {
            this.warning = `Showing first ${this.MAX_RESULTS} results. Please refine your search.`;
            break;
          }
        } while (extraNextToken);
        this.records = this.records.concat(allExtraRecords).slice(0, this.MAX_RESULTS);
        this.recordIdsToFetch.clear();
      }
      this.loading = false;
    } catch (e) {
      this.loading = false;
      console.log(e);
    }
  }

  async fetchLineItems(q: string, maxCount: number): Promise<string[]> {
    let recordIdsToFetch = new Set<string>();
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
    let lineItemQuery: ListLineItemsQuery;
    let itemCount = 0;
    let nextToken: string | undefined = undefined;
    let totalFetched = 0;
    do {
      try {
        lineItemQuery = await this.probateRecordService.ListLineItems(lineItemFilter, this.pageSize, nextToken);
        itemCount = lineItemQuery.items.length;
        for (const lineItem of lineItemQuery.items) {
          recordIdsToFetch.add(lineItem!.probateId);
        }
        nextToken = lineItemQuery.nextToken ? lineItemQuery.nextToken : undefined;
        totalFetched += itemCount;
        if (totalFetched >= this.MAX_RESULTS) {
          break;
        }
      } catch(e) {
        console.log(e);
        break;
      }
    } while(itemCount > 0 && nextToken);
    return Array.from(recordIdsToFetch.values()).slice(0, this.MAX_RESULTS);
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
