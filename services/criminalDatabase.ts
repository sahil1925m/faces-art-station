import { DbMatch } from '../types';

// This is a mock database of criminals based on the images provided by the user.
// In a real application, this data would come from a secure, indexed backend.
const criminalDatabase: Omit<DbMatch, 'score'>[] = [
    {
        subjectId: '49B-K1',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/William_Raymond_Nesbit_mugshot.jpg/800px-William_Raymond_Nesbit_mugshot.jpg'
    },
    {
        subjectId: '88G-P4',
        imageUrl: 'https://www.alcatrazhistory.com/grwright.jpg'
    },
    {
        subjectId: '72H-L9',
        imageUrl: 'https://www.alcatrazhistory.com/guralnick.jpg'
    },
    {
        subjectId: '33C-L5',
        imageUrl: 'https://www.alcatrazhistory.com/shelton.jpg'
    },
    {
        subjectId: '91F-T2',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Frederick_J._Tenuto.jpg'
    },
    {
        subjectId: '71E-V2',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Courtney_Townsend_Taylor.jpg'
    },
    {
        subjectId: '55K-M3',
        imageUrl: 'https://www.alcatrazhistory.com/kling.jpg'
    },
    {
        subjectId: '48J-B6',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Joseph_James_Brletic.jpg/800px-Joseph_James_Brletic.jpg'
    },
    {
        subjectId: '12A-Z9',
        imageUrl: 'https://www.alcatrazhistory.com/pinson.jpg'
    },
    {
        subjectId: '63A-K7',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Alvin_Karpis_mug_shot.jpg/800px-Alvin_Karpis_mug_shot.jpg'
    },
    {
        subjectId: '29M-T1',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/c/cb/Miran_Edgar_Thompson_Alcatraz.jpg'
    },
    {
        subjectId: '84B-B2',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e6/Basil_Banghart_Alcatraz.jpg'
    },
     {
        subjectId: '19C-C8',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/0/03/Clarence_Carnes_Alcatraz.jpg'
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
