import TagObject from "./TagObject";

interface PhraseObject {
    id: string,
    date: Date,
    content: string,
    tags: TagObject[],
    meaning: string,
    contexts: {
        id: number,
        content: string
    }[],
    status: string
}

export default PhraseObject;