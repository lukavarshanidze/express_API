import { create} from 'zustand';
import axios, { AxiosResponse } from 'axios';

function generateRandomNumber() {
  const min = Math.pow(10, 9);
  const max = Math.pow(10, 10) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export interface Entry {
  id: number;
  name: string;
  email?: string;
  gender?: string;
  street?: string;
  city?: string;
  phone?: string;
  address?: any;
}

interface EntryStore {
  entries: Entry[];
  fetchEntries: () => Promise<void>;
  createEntry: (newEntry: NewEntry) => Promise<void>;
  updateEntry: (id: number, updatedEntry: Partial<Entry>) => Promise<void>;
  deleteEntry: (id: number) => Promise<void>;
}

interface NewEntry {
  name: string;
}

const useEntryStore = create<EntryStore>((set) => ({
  entries: [],
  fetchEntries: async () => {
    try {
      const response: AxiosResponse<Entry[]> = await axios.get('/entries');
      set(state => ({ entries: response.data }));
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  },
  createEntry: async newEntry => {
    try {
      const id = generateRandomNumber();
      const entryWithId: Entry = { id, ...newEntry };
      await axios.post('/entries', entryWithId);
      set(state => ({ entries: [entryWithId, ...state.entries] }));
      console.log('es',entryWithId);
    } catch (error) {
      console.error('Error creating entry:', error);
    }
  },
  updateEntry: async (id, updatedEntry) => {
    try {
      await axios.put(`/entries/${id}`, updatedEntry);
      set(state => ({
        entries: state.entries.map(entry =>
          entry.id === id ? { ...entry, ...updatedEntry } : entry
        ),
      }));
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  },
  deleteEntry: async id => {
    try {
      await axios.delete(`/entries/${id}`);
      set(state => ({
        entries: state.entries.filter(entry => entry.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  },
}));

export default useEntryStore;