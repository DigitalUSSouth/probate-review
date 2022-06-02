import { TextBoundingBlock } from './text-bounding-block';

export interface ProbateRecord {
    id?: string;
    lines: TextBoundingBlock[];
}