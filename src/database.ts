// src/database.ts
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('user.db');

export const setupDatabase = () => {
  try {
    // 1. Remembers WHO is currently logged in (always id = 1)
    db.execSync('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT);');
    
    // 2. NEW: Remembers the MISSION PROGRESS for every specific user
    db.execSync('CREATE TABLE IF NOT EXISTS game_saves (username TEXT PRIMARY KEY, game_data TEXT);');
    
    console.log("Database tables 'users' and 'game_saves' are ready.");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};

setupDatabase();

// --- 1. CURRENT SESSION MANAGEMENT (Used for Login) ---
export const saveUser = (username: string, password: string) => {
  db.runSync(
    'INSERT OR REPLACE INTO users (id, username, password) VALUES (1, ?, ?)', 
    [username, password]
  );
};

export const getUser = () => {
  try {
    return db.getFirstSync<{username: string, password: string}>(
      'SELECT username, password FROM users WHERE id = 1'
    );
  } catch (error) {
    return null;
  }
};

// --- 2. MULTI-USER SYNC MANAGEMENT (New Feature!) ---

// Save a specific user's game progress
export const syncProgressToDB = (username: string, gameState: any) => {
  try {
    const dataString = JSON.stringify(gameState);
    db.runSync(
      'INSERT OR REPLACE INTO game_saves (username, game_data) VALUES (?, ?)',
      [username, dataString]
    );
    console.log(`[Database] Successfully synced progress for: ${username}`);
  } catch (error) {
    console.error("Error syncing progress:", error);
  }
};

// Load a specific user's game progress when they log in
export const loadProgressFromDB = (username: string) => {
  try {
    const result = db.getFirstSync<{game_data: string}>(
      'SELECT game_data FROM game_saves WHERE username = ?',
      [username]
    );
    if (result && result.game_data) {
      return JSON.parse(result.game_data);
    }
    return null; // Return null if they are a brand new user
  } catch (error) {
    return null;
  }
};