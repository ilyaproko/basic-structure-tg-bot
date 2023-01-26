import { config, DotenvParseOutput } from "dotenv";
import { IConfigService } from "./config.interface";

export class ConfigService implements IConfigService {

    // * get all keys and values from file .env
    private config: DotenvParseOutput;

    constructor() {
        const { error, parsed } = config(); // * return object with values from file .env

        // * if in file .env has an error
        if (error) {
            throw new Error("Not found file .env")
        }

        // * if the file .env is empty
        if (!parsed) {
            throw new Error("File .env is empty")
        }

        this.config = parsed; // * pass parsed data from .env to private field config

    }

    get(key: string): string {
        const res = this.config[key]; // read value by key in .env

        if (!res) {
            throw new Error(`Not found key :-> ${key} in .env`);
        }
        return res;
    }
    
}