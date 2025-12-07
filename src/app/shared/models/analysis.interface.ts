export interface IAnalysis {
  userId: string;
  titleFile: string;
  originalFile: string;
  processedFile: string;
  responseTime?: number;
  wordCount?: number;
  readTime?: number;
}
