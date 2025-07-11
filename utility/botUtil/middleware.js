

const middleware = async (context, next) => {
    const { m, isBotAdmin, isAdmin } = context;

    if (!m.isGroup) {
        return m.reply("This command is special for groups");
    }
    if (!isAdmin) {
        return m.reply("You need admin promote you");
    }
    if (!isBotAdmin) {
        return m.reply("I need admin promote you");
    }

    await next(); // Proceed to the next function (main handler)
};

module.exports = middleware;
