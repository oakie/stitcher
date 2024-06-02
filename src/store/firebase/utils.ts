import { DocumentData, Timestamp } from 'firebase/firestore';

export const convertTimestamps = (data: DocumentData | null | undefined) => {
  if (!data) return null;

  for (const [key, value] of Object.entries(data)) {
    // covert items inside array
    if (value && Array.isArray(value)) {
      data[key] = value.map((item) => convertTimestamps(item));
    }

    // convert inner objects
    if (value && typeof value === 'object') {
      data[key] = convertTimestamps(value);
    }

    // convert timestamp properties
    if (value && value instanceof Timestamp) {
      data[key] = (value as Timestamp).toDate();
    }
  }
  return data;
};
