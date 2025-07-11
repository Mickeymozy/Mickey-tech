

const Ownermiddleware = async (context, next) => {
    const { m, Owner } = context;

    if (!Owner) {
        return m.reply("You not authories to use this command.");
    }

    await next();
};

module.exports = Ownermiddleware;
