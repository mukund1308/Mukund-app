import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const target = join(process.cwd(), 'backend', 'src', 'seed-user.txt');
const user = {
  username: process.argv[2] || 'jdoe',
  name: process.argv[3] || 'Jane Doe',
  role: process.argv[4] || 'QA'
};

writeFileSync(target, JSON.stringify(user, null, 2));
console.log(`Seed user prepared: ${user.username} (${user.role})`);
