export const Priority = {
    Red: 1,
    Yellow: 2,
    Green: 3,
    White: 4
} as const;

export type Priority = typeof Priority[keyof typeof Priority];