import { GameState, SavedGame } from '../types';
import { v4 as uuidv4 } from 'uuid';

const SAVE_KEY = 'capitalist_simulator_saves';

export const saveGame = (state: GameState, name: string): SavedGame => {
    const savedGame: SavedGame = {
        id: uuidv4(),
        name,
        date: Date.now(),
        state
    };

    const existingSaves = loadAllSaves();
    const updatedSaves = [...existingSaves, savedGame];
    localStorage.setItem(SAVE_KEY, JSON.stringify(updatedSaves));

    return savedGame;
};

export const loadGame = (id: string): GameState | null => {
    const saves = loadAllSaves();
    const save = saves.find(s => s.id === id);
    return save ? save.state : null;
};

export const loadAllSaves = (): SavedGame[] => {
    const savesJson = localStorage.getItem(SAVE_KEY);
    return savesJson ? JSON.parse(savesJson) : [];
};

export const deleteSave = (id: string): void => {
    const saves = loadAllSaves();
    const updatedSaves = saves.filter(save => save.id !== id);
    localStorage.setItem(SAVE_KEY, JSON.stringify(updatedSaves));
}; 