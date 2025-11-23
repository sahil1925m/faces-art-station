import { DbMatch } from '../types';

// This is a mock database of criminals based on the images provided by the user.
// In a real application, this data would come from a secure, indexed backend.
const criminalDatabase: Omit<DbMatch, 'score'>[] = [
    {
        subjectId: '49B-K1',
        imageUrl: '/criminals/mini (1).webp'
    },
    {
        subjectId: '88G-P4',
        imageUrl: '/criminals/mini (2).webp'
    },
    {
        subjectId: '72H-L9',
        imageUrl: '/criminals/mini (3).webp'
    },
    {
        subjectId: '33C-L5',
        imageUrl: '/criminals/mini (4).webp'
    },
    {
        subjectId: '91F-T2',
        imageUrl: '/criminals/mini (5).webp'
    },
    {
        subjectId: '71E-V2',
        imageUrl: '/criminals/mini (6).webp'
    },
    {
        subjectId: '55K-M3',
        imageUrl: '/criminals/mini (7).webp'
    },
    {
        subjectId: '48J-B6',
        imageUrl: '/criminals/mini (8).webp'
    },
    {
        subjectId: '12A-Z9',
        imageUrl: '/criminals/mini (9).webp'
    },
    {
        subjectId: '63A-K7',
        imageUrl: '/criminals/mini (10).webp'
    },
    {
        subjectId: '29M-T1',
        imageUrl: '/criminals/mini.webp'
    },
    {
        subjectId: '84B-B2',
        imageUrl: '/criminals/mini.jpeg'
    },
    {
        subjectId: '19C-C8',
        imageUrl: '/criminals/large.jpeg'
    },
];

// This function simulates searching the database and returning a random number of matches
// with varying similarity scores.
export const searchCriminalDatabase = (): DbMatch[] => {
    // Shuffle the database to get a random order
    const shuffled = [...criminalDatabase].sort(() => 0.5 - Math.random());

    // Take a random number of results (e.g., between 3 and 6)
    const numResults = Math.floor(Math.random() * 4) + 3;
    const selected = shuffled.slice(0, numResults);

    // Assign a mock similarity score to each result
    const resultsWithScores: DbMatch[] = selected.map((criminal, index) => {
        // Make the scores decrease to seem more realistic
        const baseScore = 95 - (index * (Math.random() * 5 + 5));
        const score = Math.max(60, Math.floor(baseScore - Math.random() * 5));
        return {
            ...criminal,
            score,
        };
    });

    return resultsWithScores.sort((a, b) => b.score - a.score);
};
