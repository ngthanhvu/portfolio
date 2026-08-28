import { drizzle } from 'drizzle-orm/mysql2'
import { createPool } from 'mysql2/promise'
import * as schema from '../db/schema'

const pool = createPool(process.env.DATABASE_URL)

export const db = drizzle({ client: pool, schema, mode: 'default' })
