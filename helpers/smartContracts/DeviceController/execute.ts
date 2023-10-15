// cli.ts
import { Command } from 'commander';
import { buyer } from './buyer';
import { seller } from './seller';


const program = new Command();

program
  .command('buyer <arg1> ')
  .description('Call Function 1')
  .action(buyer);

program
  .command('seller')
  .description('Call Function 2')
  .action(seller);

program.parse(process.argv);
