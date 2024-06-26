const fs = require("fs");
const path = require("path");

const localesDir = path.resolve(__dirname, "../src/locales");
const outputDir = path.resolve(__dirname, "../src/_locales");

const createMessagesJson = (locale, data) => {
  const messages = {};
  for (const key in data) {
    messages[key] = { message: data[key] };
  }
  return messages;
};

const convertLocales = () => {
  const locales = fs.readdirSync(localesDir);

  locales.forEach((locale) => {
    const localePath = path.join(localesDir, locale, "translation.json");
    if (fs.existsSync(localePath)) {
      const data = JSON.parse(fs.readFileSync(localePath, "utf8"));
      const messages = createMessagesJson(locale, data);

      const outputLocaleDir = path.join(outputDir, locale.replace("_", "-"));
      if (!fs.existsSync(outputLocaleDir)) {
        fs.mkdirSync(outputLocaleDir, { recursive: true });
      }

      fs.writeFileSync(
        path.join(outputLocaleDir, "messages.json"),
        JSON.stringify(messages, null, 2)
      );
    }
  });
};

convertLocales();
