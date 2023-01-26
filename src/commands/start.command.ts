import { Markup, Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { Command } from "./command.class";

export class StartCommand extends Command {

    constructor(bot: Telegraf<IBotContext>) {
        super(bot); // create field bot in parent abstract class 
    }

    handle(): void {
        this.bot.start(ctx => {

            console.log(ctx.session);
            

            ctx.reply(
                "Do you like this course?", 
                Markup.inlineKeyboard([
                    Markup.button.callback("Like", "course_like"),
                    Markup.button.callback("Dislike", "course_dislike"),
                    Markup.button.callback("menu", "course_menu"),
                ]),
            );

            this.bot.action("course_like", ctx => {
                ctx.session.courseLike = true;
                ctx.editMessageText("Cool!");
            });

            this.bot.action("course_dislike", ctx => {
                ctx.session.courseLike = false;
                ctx.editMessageText("Not cool!");
            });

        });
    }

}