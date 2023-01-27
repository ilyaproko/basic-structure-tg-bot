import { Composer } from "telegraf";

const composer = new Composer();

composer.command("newie", async ctx => {
    try {
        await ctx.replyWithHTML(`
        Привет, <b>${ctx.from.first_name}</b>!
        Введите /help чтобы узнать доступные команды!
        `)
    } catch (e) {
        console.error("cant handle newie command");
    }
})

export default composer;