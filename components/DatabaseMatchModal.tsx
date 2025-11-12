import * as React from 'react';
import { DbMatch } from '../types';

interface DatabaseMatchModalProps {
    matches: DbMatch[];
    onClose: () => void;
    isSearching: boolean;
}

const DatabaseMatchModal: React.FC<DatabaseMatchModalProps> = ({ matches, onClose, isSearching }) => {
    const renderContent = () => {
        if (isSearching) {
            return (
                <div className="flex flex-col items-center justify-center h-96">
                    <svg className="animate-spin h-10 w-10 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-4 text-lg text-slate-300 font-semibold">Searching 1,250,000 records...</p>
                </div>
            );
        }

        if (matches.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-96">
                    <p className="text-lg text-slate-400">No potential matches found.</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches.map((match) => (
                    <div key={match.subjectId} className="bg-slate-700/50 rounded-lg overflow-hidden border border-slate-600">
                        <img src={match.imageUrl} alt={`Mugshot for ${match.subjectId}`} className="w-full h-64 object-cover object-center bg-slate-800" />
                        <div className="p-4">
                            <h3 className="font-bold text-lg text-slate-100">Subject ID: {match.subjectId}</h3>
                            <p className="text-cyan-400 font-semibold text-md">Similarity Score: {match.score}%</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-700">
                    <h2 className="text-2xl font-bold text-cyan-400">Database Search Results</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="overflow-y-auto pr-2">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default DatabaseMatchModal;
