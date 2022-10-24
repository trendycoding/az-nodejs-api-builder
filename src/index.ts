#!/usr/bin/env node
import {program } from 'commander';
import { option } from 'yargs';
import { readFileSync, writeFileSync } from 'fs';
import { ApiMetadata } from './config';
import { generateAndSaveModels, ModelGenerator } from './code-generation/ModelGenerator';

program
    .option('--model', 'A model file to scaffold the API endpoints')
    .option('-m', 'A model file to scaffold the API endpoints')
    .option('--output', 'Output folder to generate API endpoints')
    .option('-o', 'Output folder to generate API endpoints');

const config = readFileSync('api-builder.config.json', 'ascii');

const configuration = (JSON.parse(config) as ApiMetadata);

generateAndSaveModels(configuration, __dirname).then(models => {
    console.log(models)
}).catch(error => {
    console.log(error)
});