enum FactType {
    PageView,
  }


export interface QueryFilter {
    ofType?: FactType;
    captured?: {
      after?: Date;
      before?: Date;
    }
  }

