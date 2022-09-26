#!/usr/bin/env node
import {program } from 'commander';
import { option } from 'yargs';

program
    .option('--model', 'A model file to scaffold the API endpoints')
    .option('-m', 'A model file to scaffold the API endpoints')
    .option('--output', 'Output folder to generate API endpoints')
    .option('-o', 'Output folder to generate API endpoints');

