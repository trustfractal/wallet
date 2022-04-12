import { QueryFilter} from "./types";
import { getDataHost } from "@services/Factory";

export default class FactsService{
    //TODO(melatron): Start filtering the facts using the provided query.
    raw(facts: QueryFilter[]) {
        return getDataHost().iterBack();
    }
    //TODO: implement SINE logic
    smpcUpdate(currentState: QueryFilter, factsFilter: QueryFilter[], sineData: any) {
        return getDataHost().iterBack();
    }
}
