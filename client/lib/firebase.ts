// Import Firebase config from the JavaScript file
import { auth, db } from "./firebase.js";
import { getStorage } from "firebase/storage";

// Get the app instance from auth
const app = (auth as any).app;

// Initialize storage
export const storage = getStorage(app);

// Re-export Firebase services
export { auth, db };
export default app;
