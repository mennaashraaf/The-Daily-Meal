import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function setupDatabase() {
  console.log('Setting up database...');
  
  try {
    // Run migration
    console.log('Running migration...');
    await execAsync('tsx server/migrate.ts');
    
    // Run seeding
    console.log('Running seed...');
    await execAsync('tsx server/seed.ts');
    
    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase(); 