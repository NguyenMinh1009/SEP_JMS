import { CorrelationJobType } from "../enums/correlationJobType";
import { VisibleType } from "../enums/visibleType";

export const getLinkForJobType = (visibleType?: VisibleType): string => {
  if (visibleType === VisibleType.Public) return "file/job/";
  return "file/internal/job/";
};
