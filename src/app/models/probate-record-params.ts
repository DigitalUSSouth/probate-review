import { ModelProbateRecordFilterInput, ModelSortDirection } from "../API.service";

export interface ProbateRecordParams {
  id?: string,
  filter?: ModelProbateRecordFilterInput,
  limit?: number,
  nextToken?: string,
  sortDirection?: ModelSortDirection
}