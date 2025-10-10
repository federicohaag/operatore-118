export type Call = {
    id: string;
    text: string;
    feedback: Feedback;
}

export type Feedback = {
    msb: string;
    msa1: string;
    msa2: string;
}

export type CallTemplate = {
    text: string;
    stableCaseFeedback: Feedback;
    mediumCaseFeedback: Feedback;
    criticalCaseFeedback: Feedback;
}
