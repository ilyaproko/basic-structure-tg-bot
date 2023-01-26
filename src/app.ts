import TelegramBot, { ChatId, SendMessageOptions } from "node-telegram-bot-api";
import { Telegraf } from "telegraf";
import LocalSession from "telegraf-session-local";
import { Command } from "./commands/command.class";
import { StartCommand } from "./commands/start.command";
import { IConfigService } from "./config/config.interface";
import { ConfigService } from "./config/config.service";
import { IBotContext } from "./context/context.interface";
import logger from "./logger";
import { gameOptions, againOptions } from "./options/option.module";


class Bot {
    bot: Telegraf<IBotContext>;
    commands: Command[] = [];

    constructor(private readonly configService: IConfigService) {
        this.bot = new Telegraf<IBotContext>(this.configService.get("TOKEN"));
        
        // sesssion
        this.bot.use(
            new LocalSession({ database: "session.json" }).middleware()
        );

    }


    init() {

        this.commands = [
            new StartCommand(this.bot),
        ];

        for (const command of this.commands) {
            command.handle(); // call every command in commands
        }

        this.bot.launch(); // run bot

        // log that bot has been started
        logger.info("Bot is running successfully");
    }
}

// const bot = new Bot(new ConfigService());
// bot.init();


// ! --------------------------------------------------------------------------------------------- ! //


class BotApi {

    bot: TelegramBot;
    chats: any = {};

    constructor(private readonly configService: IConfigService) {
        this.bot = new TelegramBot(configService.get("TOKEN"), { polling: true });
    }

    async startGame(chatId: ChatId) {
        await this.bot.sendMessage(chatId, "Сейчас загадаю цифру от 0 до 9, а ты должен ее угадать!")
        const randomNumber = Math.floor(Math.random() * 10);
        this.chats[chatId] = randomNumber;
        await this.bot.sendMessage(chatId, "Отгадывай", gameOptions as any);
    }

    init() {

        this.bot.setMyCommands([
            {command: "/start", description: "Начальное привествие"},
            {command: "/info", description: "Получить информацию о пользователе"},
            {command: "/game", description: "игра в телеграм боте!"}
        ])
        
        this.bot.on("message", async (msg) => {

            console.log(this.chats);

            const text = msg.text;
            const chatId = msg.chat.id;

            if (text === "/start") {
                await this.bot.sendSticker(chatId, "https://tlgrm.eu/_/stickers/735/cf8/735cf8f3-42ef-4d8b-a2dc-388c93457c24/4.webp");
                return this.bot.sendMessage(chatId, "Добро пожаловать в телеграм бот автора утюб канала")
            }

            if (text === "/info") {
                return this.bot.sendMessage(chatId, `Тебя зовут ${msg.from?.first_name} ${msg.from?.last_name}`)
            }

            if (text === "/game") {
                await this.bot.sendMessage(chatId, "Сейчас я загадаю цифру от 0 до 9 а ты должен ее угадать!");
                const randomNumber = Math.floor(Math.random() * 10);
                this.chats[chatId] = randomNumber;
                return this.bot.sendMessage(chatId, "Отгадывай", gameOptions as any);
            }

            return this.bot.sendMessage(chatId, "Я тебя не понимаю");
        })

        this.bot.on("callback_query", async (msg) => {
            const data = msg.data;
            const chatId = msg.message!.chat.id;

            if (data === "/again") {
                return this.startGame(chatId);
            }

            logger.info(`choosen ${data}, actually ${this.chats[chatId]}`);

            if (parseInt(data as string) === this.chats[chatId]) this.bot.sendMessage(chatId, "Ты отгадал!!")
            else this.bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${this.chats[chatId]}`, againOptions as any)
        })



        // log that bot is running
        logger.info("The bot is running!");
        logger.info('the test line string');
    }

}


const botApi = new BotApi(new ConfigService);

botApi.init(); // run bot