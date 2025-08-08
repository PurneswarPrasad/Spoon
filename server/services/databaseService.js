const sqlite3 = require('sqlite3').verbose()
const path = require('path')

class DatabaseService {
  constructor() {
    this.dbPath = path.join(__dirname, '..', 'spoon.db')
    this.db = null
    this.init()
  }

  init() {
    this.db = new sqlite3.Database(this.dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err.message)
      } else {
        console.log('Connected to SQLite database')
        this.createTables()
      }
    })
  }

  createTables() {
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        google_id TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT,
        picture TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `

    const createSpoonHistoryTable = `
      CREATE TABLE IF NOT EXISTS spoon_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        repo_url TEXT NOT NULL,
        repo_name TEXT NOT NULL,
        repo_owner TEXT NOT NULL,
        summary TEXT,
        technologies TEXT,
        insights TEXT,
        stars INTEGER,
        forks INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `

    this.db.serialize(() => {
      this.db.run(createUsersTable)
      this.db.run(createSpoonHistoryTable)
    })
  }

  // User management
  async createUser(userData) {
    return new Promise((resolve, reject) => {
      const { google_id, name, email, picture } = userData
      
      // First check if user exists
      const checkSql = 'SELECT * FROM users WHERE google_id = ?'
      this.db.get(checkSql, [google_id], (err, existingUser) => {
        if (err) {
          reject(err)
          return
        }

        if (existingUser) {
          // User exists, update their info and return
          const updateSql = `
            UPDATE users SET name = ?, email = ?, picture = ?
            WHERE google_id = ?
          `
          this.db.run(updateSql, [name, email, picture, google_id], function(err) {
            if (err) {
              reject(err)
            } else {
              resolve(existingUser)
            }
          })
        } else {
          // User doesn't exist, create new user
          const insertSql = `
            INSERT INTO users (google_id, name, email, picture)
            VALUES (?, ?, ?, ?)
          `
          this.db.run(insertSql, [google_id, name, email, picture], function(err) {
            if (err) {
              reject(err)
            } else {
              resolve({ id: this.lastID, google_id, name, email, picture })
            }
          })
        }
      })
    })
  }

  async getUserByGoogleId(googleId) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE google_id = ?'
      this.db.get(sql, [googleId], (err, row) => {
        if (err) {
          reject(err)
        } else {
          resolve(row)
        }
      })
    })
  }

  async getUserById(userId) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE id = ?'
      this.db.get(sql, [userId], (err, row) => {
        if (err) {
          reject(err)
        } else {
          resolve(row)
        }
      })
    })
  }

  // Spoon history management
  async saveSpoonHistory(userId, spoonData) {
    return new Promise((resolve, reject) => {
      const {
        repo_url,
        repo_name,
        repo_owner,
        summary,
        technologies,
        insights,
        stars,
        forks
      } = spoonData

      const sql = `
        INSERT INTO spoon_history 
        (user_id, repo_url, repo_name, repo_owner, summary, technologies, insights, stars, forks)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `

      this.db.run(sql, [
        userId,
        repo_url,
        repo_name,
        repo_owner,
        summary,
        JSON.stringify(technologies),
        JSON.stringify(insights),
        stars || 0,
        forks || 0
      ], function(err) {
        if (err) {
          reject(err)
        } else {
          resolve({ id: this.lastID, ...spoonData })
        }
      })
    })
  }

  async getSpoonHistory(userId, page = 1, limit = 5) {
    return new Promise((resolve, reject) => {
      const offset = (page - 1) * limit
      
      // Get total count
      const countSql = 'SELECT COUNT(*) as total FROM spoon_history WHERE user_id = ?'
      this.db.get(countSql, [userId], (err, countRow) => {
        if (err) {
          reject(err)
          return
        }

        const total = countRow.total
        const totalPages = Math.ceil(total / limit)

        // Get paginated results
        const sql = `
          SELECT * FROM spoon_history 
          WHERE user_id = ? 
          ORDER BY created_at DESC 
          LIMIT ? OFFSET ?
        `

        this.db.all(sql, [userId, limit, offset], (err, rows) => {
          if (err) {
            reject(err)
          } else {
            // Parse JSON fields
            const history = rows.map(row => ({
              ...row,
              technologies: row.technologies ? JSON.parse(row.technologies) : [],
              insights: row.insights ? JSON.parse(row.insights) : {}
            }))

            resolve({
              history,
              pagination: {
                currentPage: page,
                totalPages,
                totalItems: total,
                itemsPerPage: limit,
                hasNext: page < totalPages,
                hasPrev: page > 1
              }
            })
          }
        })
      })
    })
  }

  async getSpoonById(spoonId, userId) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM spoon_history WHERE id = ? AND user_id = ?'
      this.db.get(sql, [spoonId, userId], (err, row) => {
        if (err) {
          reject(err)
        } else if (row) {
          resolve({
            ...row,
            technologies: row.technologies ? JSON.parse(row.technologies) : [],
            insights: row.insights ? JSON.parse(row.insights) : {}
          })
        } else {
          resolve(null)
        }
      })
    })
  }

  async deleteSpoon(spoonId, userId) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM spoon_history WHERE id = ? AND user_id = ?'
      this.db.run(sql, [spoonId, userId], function(err) {
        if (err) {
          reject(err)
        } else {
          resolve({ deleted: this.changes > 0 })
        }
      })
    })
  }

  close() {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message)
        } else {
          console.log('Database connection closed')
        }
      })
    }
  }
}

module.exports = new DatabaseService()
