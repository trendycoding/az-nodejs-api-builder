import { readFileSync, writeFileSync, existsSync } from 'fs';
import { compile, compileFromFile, Options } from 'json-schema-to-typescript'; 
import { ApiMetadata } from '../config';
import {Logger} from 'tslog';
import { logAndThrow } from './LogAndThrow';

/**
 * Builds a set of default options including the schema resolution path
 * @param schemaResolvingFolder A path to resolve schema references
 * @returns A set of options as per https://github.com/bcherny/json-schema-to-typescript
 */
const getDefaultOptions = (schemaResolvingFolder: string) : Partial<Options> => {
    return {
        additionalProperties: false,
        unknownAny: false,
        cwd: schemaResolvingFolder,
        declareExternallyReferenced: true
    }
}

/**
 * A class that represents a wrapper on top of json-schema-to-typescript model generator, see the following resources:
 * https://github.com/bcherny/json-schema-to-typescript
 * https://transform.tools/json-schema-to-typescript 
 */
export class ModelGenerator {
    /**
     * 
     * @param modelName Constructor that sets the model generation information from the configuration file
     * @param schemaPath Path to the schema file from which generate the model
     * @param modelFileName Name of the file that will contain the model 
     * @param schemaEncoding Encoding of the schema file deaults to ASCII
     */
    constructor(protected modelName: string, protected schemaPath: string, protected modelFileName: string, protected schemaEncoding: BufferEncoding = 'ascii'){

    }

    /**
     * Generates code based on a schema provided and type generation options
     * @param options Code generation options, for details please check 
     * @returns A string representing the generated code
     */
    public async generateModelClass(options?: Partial<Options>): Promise<string> {
        const generationOptions = options ? options : getDefaultOptions(this.schemaPath);
        if(!existsSync(`${this.schemaPath}${this.modelFileName}`)){
            throw `Unable to find file ${this.schemaPath}${this.modelFileName}`;
        }
        const schema = readFileSync(`${this.schemaPath}${this.modelFileName}`, {encoding: this.schemaEncoding});
        const schemaObj = JSON.parse(schema);
        return await compile(schemaObj, this.modelName, options)
    }

    /**
     * Generates code based on schema provided and type generation optios. It stores the code as a TS file in the models' folder
     * @param modelFolder Model folder that contains all models for the API being scafolded
     * @param options Generation options as per https://github.com/bcherny/json-schema-to-typescript
     * @param withForce If set to true it will override an existing file
     * @returns A GeneratedModel structure with information about the file generated, the model name and the code associated with it
     */
    public async writeModelClassToFile(modelFolder: string, options?: Partial<Options>, withForce = false): Promise<GeneratedModel> {
        const modelDefinition = await this.generateModelClass(options);
        const fullFileName = `${modelFolder}${this.modelName}.ts`;
        if(withForce || !(existsSync(fullFileName))){
            writeFileSync(fullFileName, modelDefinition);            
        }

        return {
            code: modelDefinition,
            path: fullFileName,
            name: this.modelName
        };
    }
}

/**
 * A structure containing information on the model generated
 */
export type GeneratedModel = {
    /**
     * Name of the genrated model 
     */
    name: string;

    /**
     * Path to the generated model
     */
    path: string;

    /**
     * Code of the model generated
     */
    code: string;
}

/**
 * Generates all models and stores them in the models folder
 * @param configuration The configuration settings from a configuration file
 * @param baseFolder The base folder for the path where the models will be generated
 * @returns A promise with a list of generated models
 */
export const generateAndSaveModels = async (configuration: ApiMetadata, baseFolder = __dirname) : Promise<GeneratedModel[]> => {
    const generatedModels : GeneratedModel[] = [];
    if(configuration.models){
        const log: Logger = new Logger({ name: "Code Generation logger" });
        for(const model of configuration.models) {
            if(!configuration.folders?.models){
                logAndThrow(log.fatal, `Model folder was not set in configuration files`);
            }

            if(!configuration.folders?.schemas){
                logAndThrow(log.fatal, `Schema folder was not set in configuration files`);
            }

            log.info(`Generating model ${model.modelName}`)
            const gen = new ModelGenerator(model.modelName, `${baseFolder}${configuration.folders?.schemas}`, model.modelSchemaFile); 
        
            const modelInfo = await gen.writeModelClassToFile(`${baseFolder}${configuration.folders?.models}`, undefined, true);            
            generatedModels.push(modelInfo);

            log.info(`Generated model for ${model.modelName} under '${baseFolder}${configuration.folders?.models}'`)
        };
    }    
    return generatedModels;
}