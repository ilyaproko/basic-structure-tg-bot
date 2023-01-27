import { Telegraf } from "telegraf";
import LocalSession from "telegraf-session-local";

import { Command } from "./commands/command.class";
import { InfoCommand } from "./commands/info.command";
import { StartCommand } from "./commands/start.command";

import { IConfigService } from "./config/config.interface";
import { ConfigService } from "./config/config.service";

import { IBotContext } from "./context/context.interface";
import logger from "./logger";

class Bot {
    bot: Telegraf<IBotContext>;
    commands: Command[] = [];

    constructor(private readonly configService: IConfigService) {
        this.bot = new Telegraf<IBotContext>(this.configService.get("TOKEN")); // create telegraf bot with pass token from .env
        
        // sesssion, setup sesstion for telegraf bot
        this.bot.use(
            new LocalSession({ database: "session.json" }).middleware()
        );

    }


    init() {

        // left menu of available commands
        this.bot.telegram.setMyCommands([
            {command: "/start", description: "запуск бота"},
            {command: "/info", description: "информация по боту"}
        ]);

        this.commands = [
            new StartCommand(this.bot),
            new InfoCommand(this.bot)
        ];

        for (const command of this.commands) {
            command.handle(); // call every command in commands
        }

        this.bot.launch(); // run bot
        // log that bot has been started
        logger.info("Bot is running successfully");


    }
}

const bot = new Bot(new ConfigService());
bot.init();


// https://stackoverflow.com/questions/61189728/node-telegraf-callback-button

// You shouldn't be using Markup.callbackButton (which is InlineKeyboardButton on the Bot API) inside Markup.keyboard(ReplyKeyboardMarkup).

// According to Telegram Bot API docs, Markup.keyboard(ReplyKeyboardMarkup) should contain Array of 
// Arrays (not just an array BTW, fix that as well) of KeyboardButton. 

// And Markup.callbackButton(which is Inlinekeyboardbutton on the API) should be used for InlineKeyboard (not reply keyboard).