export type Call = {
    id: string;
    text: string;
    feedback: Feedback;
    receivedAt: number; // Simulation time in milliseconds when the call was received
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
