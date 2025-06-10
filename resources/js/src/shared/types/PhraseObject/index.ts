import TagObject from "./TagObject";

type PhraseObject = {
    id: string,
    date: Date,
    content: string,
    tags: TagObject[],
    meaning: string,
    contexts: {
        id: number,
        content: string
    }[],
    status: string,
    reason: string
}

export default PhraseObject;