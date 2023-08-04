import { openDatabase } from 'react-native-sqlite-storage';

var db = openDatabase({ name: 'UserDatabase.db' });
const createTables = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uri TEXT NOT NULL,
        location TEXT,
        address TEXT
      );`,
      [],
      () => {
        console.log('Tables created successfully');
      },
      (_, error) => {
        console.log('Error creating tables:', error);
      }
    );
  });
};

export const setupDatabase = () => {
  createTables();
};

export const saveImageToDatabase = async (uri, location, address) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO images (uri, location, address) VALUES (?, ?, ?)',
        [uri, location ? JSON.stringify(location) : null, address],
        (_, result) => {
          resolve(result.insertId);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

export const getImagesFromDatabase = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM images',
        [],
        (_, result) => {
          const images = result.rows.raw();
          resolve(images);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

export const deleteImageFromDatabase = async (imageId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM images WHERE id = ?',
        [imageId],
        (_, result) => {
          resolve(result.rowsAffected);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};
