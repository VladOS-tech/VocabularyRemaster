import TagObject from "./TagObject";
import MeaningObject from "./MeaningObject";

interface PhraseObject extends MeaningObject, TagObject{
    id: number,
    date: Date,
    content: string,
    tags: TagObject[],
    meanings: string,
    contexts: {
        id: number,
        content: string
    }[],
    status: string
}

export default PhraseObject;