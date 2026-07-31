import { neon, NeonQueryFunction } from '@neondatabase/serverless';

let sqlInstance: NeonQueryFunction<false, false> | null = null;

export function getDb(): NeonQueryFunction<false, false> {
    if (!sqlInstance) {
        const databaseUrl = process.env.DATABASE_URL;
        if (!databaseUrl) {
            throw new Error(
                'DATABASE_URL is not set. Please provision Neon Postgres and run `vercel env pull`.'
            );
        }
        sqlInstance = neon(databaseUrl);
    }
    return sqlInstance;
}

export async function testConnection(): Promise<boolean> {
    try {
        const sql = getDb();
        await sql`SELECT 1`;
        return true;
    } catch {
        return false;
    }
}
