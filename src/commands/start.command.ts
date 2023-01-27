import { Markup, Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { Command } from "./command.class";

export class StartCommand extends Command {

    constructor(bot: Telegraf<IBotContext>) {
        super(bot); // create field bot in parent abstract class 
    }

    handle(): void {
        this.bot.start(ctx => {

            
            ctx.reply(
                "Что ты хочешь сделать?", 
                Markup.keyboard([
                    "что-то", "удалить клавиатуру"
                ],
                {
                    columns: 3
                }
                ).resize().oneTime()
            );

            this.bot.hears("удалить клавиатуру", async ctx => {
                console.log('working');
                this.bot.telegram.sendMessage(ctx.chat!.id, "remove keyboard", {
                    reply_markup: {
                        remove_keyboard: true
                    }
                })

            });

        });
    }

}