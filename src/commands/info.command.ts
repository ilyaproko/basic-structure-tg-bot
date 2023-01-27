import { Markup, Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { Command } from "./command.class";


export class InfoCommand extends Command {

    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }
    
    handle(): void {
        this.bot.command("/info", async ctx => {
            ctx.replyWithHTML(
                "Essensial iformation about the <i>Bot</i>", 
                Markup.inlineKeyboard([
                    Markup.button.callback("About the author", "authorInfo"),
                    Markup.button.callback("About the concept", "conceptInfo")
                ])
            )
        })

        this.bot.action("authorInfo", async ctx => {
            ctx.editMessageText("It's a secret") // заменит предыдущее сооющение в чате
        })

        // or first delete previous message and than add new Message -> below
        this.bot.action("conceptInfo", async ctx => {
            ctx.deleteMessage(); 
            ctx.replyWithHTML("It's a new bot for testing programmers.\n<b>But YOU</b> not programmer 😉")
        })
    }

}

