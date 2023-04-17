#! /usr/bin/env node

console.log(
  "This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb 'mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority'"
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const mongoose = require("mongoose");
const Genre = require("./models/genre");
const Developer = require("./models/developer");
const Console = require("./models/console");
const VideoGame = require("./models/videoGame");

const genres = [];
const developers = [];
const consoles = [];
const videoGames = [];

mongoose.set("strictQuery", false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createGenres();
  await createDevelopers();
  await createConsoles();
  await createVideoGames();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function genreCreate(name, description) {
  const genre = new Console({ name, description });
  await genre.save();
  genres.push(genre);
  console.log(`Added genre: ${name}`);
}

async function developerCreate(name, founded, headquarters, description) {
  const developerDetails = { name, description };
  if (founded !== undefined) {
    developerDetails.founded = founded;
  }
  if (headquarters !== undefined) {
    developerDetails.headquarters = headquarters;
  }

  const developer = new Developer(developerDetails);

  await developer.save();
  developers.push(developer);
  console.log(`Added developer: ${name} `);
}

async function consoleCreate(name, releaseDate, creator, description) {
  const consoleDetails = {
    name,
    creator,
    description,
  };
  if (releaseDate !== undefined) {
    consoleDetails.releaseDate = releaseDate;
  }

  const console = new Genre(consoleDetails);
  await console.save();
  consoles.push(console);
  console.log(`Added console: ${name}`);
}

async function bookInstanceCreate(book, imprint, due_back, status) {
  bookinstancedetail = {
    book,
    imprint,
  };
  if (due_back != false) bookinstancedetail.due_back = due_back;
  if (status != false) bookinstancedetail.status = status;

  const bookinstance = new VideoGame(bookinstancedetail);
  await bookinstance.save();
  videoGames.push(bookinstance);
  console.log(`Added bookinstance: ${imprint}`);
}

async function createGenres() {
  console.log("Adding genres");
  await Promise.all([
    genreCreate(
      "Action",
      "An action game is a video game genre that emphasizes physical challenges, including hand–eye coordination and reaction time. The genre includes a large variety of sub-genres, such as fighting games, beat 'em ups, shooter games, and platform games. Multiplayer online battle arena and some real-time strategy games are also considered action games."
    ),
    genreCreate(
      "RPG",
      "A role-playing video game, commonly referred to as a role-playing game (RPG) or computer role-playing game (CRPG), is a video game genre where the player controls the actions of a character (or several party members) immersed in some well-defined world, usually involving some form of character development by way of recording statistics"
    ),
    genreCreate(
      "Puzzle",
      "Puzzle video games make up a broad genre of video games that emphasize puzzle solving. The types of puzzles can test problem-solving skills, including logic, pattern recognition, sequence solving, spatial recognition, and word completion."
    ),
  ]);
}

async function createDevelopers() {
  console.log("Adding developers");
  await Promise.all([
    developerCreate(
      "Santa Monica Studio",
      1999,
      { city: "Los Angeles", state: "California", country: "USA" },
      "Santa Monica Studio is an American video game developer based in Los Angeles. A first-party studio for Sony Interactive Entertainment, it is best known for developing the God of War series. The studio was founded in 1999 by Allan Becker and was located in Santa Monica, California, until relocating to Playa Vista in 2014."
    ),
    developerCreate(
      "Naughty Dog",
      1984,
      { city: "McLean", state: "Virginia", country: "USA" },
      "Naughty Dog, LLC (formerly JAM Software, Inc.[1][2]) is an American first-party video game developer based in Santa Monica, California.[3] Founded by Andy Gavin and Jason Rubin in 1984,[1] the studio was acquired by Sony Computer Entertainment in 2001. Gavin and Rubin produced a sequence of progressively more successful games, including Rings of Power and Way of the Warrior in the early 1990s. The latter game prompted Universal Interactive Studios to sign the duo to a three-title contract and fund the expansion of the company."
    ),
    developerCreate(
      "FromSoftware",
      1986,
      { city: "Tokyo", country: "Japan" },
      "FromSoftware, Inc. is a Japanese video game development and publishing company based in Tokyo. Founded by Naotoshi Zin in November 1986, the company developed business software before releasing their first video game, King's Field, for the PlayStation in 1994. Its success shifted FromSoftware to focus fully on video games, with them producing two more King's Field games before creating the mecha combat series Armored Core (1997), one of their flagship franchises."
    ),
    developerCreate(
      "Game Freak",
      1989,
      { city: "Tokyo", country: "Japan" },
      "Game Freak Co., Ltd.[a] is a Japanese video game developer, best known as the primary developer of the mainline Pokémon series of role-playing video games published by Nintendo and The Pokémon Company."
    ),
    developerCreate(
      "Square",
      1986,
      { country: "Japan" },
      "Square Co., Ltd.[b] (also known as SquareSoft) was a Japanese video game development studio and publisher. It was founded in 1986 by Masafumi Miyamoto, who spun off part of his father's electronics company Den-Yu-Sha. Among its early employees were Hironobu Sakaguchi, Hiromichi Tanaka, Akitoshi Kawazu, Koichi Ishii, Kazuko Shibuya, Nasir Gebelli and Nobuo Uematsu. After several other projects, all of these employees would work on Final Fantasy, a 1987 game for the Nintendo Entertainment System which would bring commercial and critical success and launch a franchise of the same name. Later notable staff included Yoshinori Kitase, Takashi Tokita, Tetsuya Nomura, Yoko Shimomura and Yasumi Matsuno."
    ),
    developerCreate(
      "Atlus",
      1986,
      { city: "Tokyo", country: "Japan" },
      "Atlus Co., Ltd. (株式会社アトラス, Kabushikigaisha Atorasu) is a Japanese video game developer, publisher, arcade manufacturer and distribution company based in Tokyo. A subsidiary of Sega, the company is known for video game series such as Megami Tensei, Persona, Etrian Odyssey, and Trauma Center, as well as Print Club (Purikura) arcade machines. Its corporate mascot is Jack Frost, a snowman-like character from their Shin Megami Tensei series. Outside of video games, the company is known for their Purikura arcade machines, which are selfie photo sticker booths popular in East Asia."
    ),
    developerCreate(
      "Capcom",
      1979,
      { city: "Osaka", country: "Japan" },
      "Capcom Co., Ltd. (Japanese: 株式会社カプコン, Hepburn: Kabushiki-gaisha Kapukon) is a Japanese video game company.[5] It has created a number of multi-million-selling game franchises, with its most commercially successful being Resident Evil, Monster Hunter, Street Fighter, Mega Man, Devil May Cry, Dead Rising, Marvel vs. Capcom, and Ace Attorney. Mega Man himself serves as the official mascot of the company. Established in 1979,[6] it has become an international enterprise with subsidiaries in East Asia (Hong Kong), Europe (London, England), and North America (San Francisco, California).[7]"
    ),
    developerCreate("Valve", 1996, {
      city: "Kirkland",
      state: "Washington",
      country: "USA",
    }),
    developerCreate(
      "Chunsoft",
      1984,
      { city: "Tokyo", country: "Japan" },
      "Spike Chunsoft Co., Ltd. (Japanese: 株式会社スパイク・チュンソフト, Hepburn: Kabushikigaisha Supaiku Chunsofuto) is a Japanese video game development and localization company specializing in role-playing video games, visual novels and adventure games. The company was founded in 1984 as Chunsoft Co., Ltd. and merged with Spike in 2012. It is owned by Dwango.[4]"
    ),
  ]);
}

async function createConsoles() {
  console.log("Adding consoles");
  await Promise.all([
    consoleCreate(
      "PlayStation 4",
      new Date(2013, 11, 15),
      "Sony Interactive Entertainment",
      "The PlayStation 4 (PS4) is a home video game console developed by Sony Interactive Entertainment. Announced as the successor to the PlayStation 3 in February 2013, it was launched on November 15, 2013, in North America, November 29, 2013 in Europe, South America and Australia, and on February 22, 2014 in Japan. A console of the eighth generation, it competes with Microsoft's Xbox One and Nintendo's Wii U and Switch."
    ),
    consoleCreate(
      "PC",
      "Computer Scientists",
      "A personal computer (PC) is a multi-purpose microcomputer whose size, capabilities, and price make it feasible for individual use.[1] Personal computers are intended to be operated directly by an end user, rather than by a computer expert or technician. Unlike large, costly minicomputers and mainframes, time-sharing by many people at the same time is not used with personal computers. Primarily in the late 1970s and 1980s, the term home computer was also used."
    ),
    consoleCreate(
      "PlayStation 3",
      new Date(2006, 11, 17),
      "Sony Interactive Entertainment",
      "The PlayStation 3 (PS3) is a home video game console developed by Sony Interactive Entertainment. The successor to the PlayStation 2, it is part of the PlayStation brand of consoles. It was first released on November 11, 2006, in Japan,[9] November 17, 2006, in North America, and March 23, 2007, in Europe and Australia.[10][11][12] The PlayStation 3 competed primarily against Microsoft's Xbox 360 and Nintendo's Wii as part of the seventh generation of video game consoles."
    ),
    consoleCreate(
      "PlayStation 5",
      new Date(2020, 11, 12),
      "Sony Interactive Entertainment",
      "The PlayStation 5 (PS5) is a home video game console developed by Sony Interactive Entertainment. It was announced as the successor to the PlayStation 4 in April 2019, was launched on November 12, 2020, in Australia, Japan, New Zealand, North America, and South Korea, and was released worldwide one week later. The PS5 is part of the ninth generation of video game consoles, along with Microsoft's Xbox Series X/S consoles, which were released in the same month."
    ),
    consoleCreate(
      "Xbox One",
      new Date(2013, 11, 22),
      "Microsoft",
      // eslint-disable-next-line quotes
      'The Xbox One is a home video game console developed by Microsoft. Announced in May 2013, it is the successor to Xbox 360 and the third console in the Xbox series. It was first released in North America, parts of Europe, Australia, and South America in November 2013 and in Japan, China, and other European countries in September 2014. It is the first Xbox game console to be released in China, specifically in the Shanghai Free-Trade Zone. Microsoft marketed the device as an "all-in-one entertainment system", hence the name "Xbox One".[17][18] An eighth-generation console, it mainly competed against Sony\'s PlayStation 4 and Nintendo\'s Wii U and later the Switch.'
    ),
    consoleCreate(
      "Xbox Series X/S",
      new Date(2020, 11, 10),
      "Microsoft",
      "The Xbox Series X and Series S are the fourth generation of the Xbox series of home video game consoles developed and sold by Microsoft. Released on November 10, 2020, the higher-end Xbox Series X and lower-end Xbox Series S are part of the ninth generation of video game consoles, which also includes Sony's PlayStation 5, released the same month.[4] They superseded the Xbox One."
    ),
    consoleCreate(
      "Nintendo DS",
      new Date(2004, 11, 21),
      "Nintendo",
      // eslint-disable-next-line quotes
      'The Nintendo DS[a] is a handheld game console produced by Nintendo, released globally across 2004 and 2005. The DS, an initialism for "Developers\' System" or "Dual Screen",[7] introduced distinctive new features to handheld games: two LCD screens working in tandem (the bottom one being a touchscreen), a built-in microphone and support for wireless connectivity.[8] Both screens are encompassed within a clamshell design similar to the Game Boy Advance SP. The Nintendo DS also features the ability for multiple DS consoles to directly interact with each other over Wi-Fi within a short range without the need to connect to an existing wireless network. Alternatively, they could interact online using the now-defunct Nintendo Wi-Fi Connection service. Its main competitor was Sony\'s PlayStation Portable during the seventh generation of video game consoles.'
    ),
    consoleCreate(
      "SNES",
      new Date(1991, 8, 23),
      "Nintendo",
      "The Super Nintendo Entertainment System (SNES),[b] commonly shortened to Super NES or Super Nintendo,[c] is a 16-bit home video game console developed by Nintendo that was released in 1990 in Japan and South Korea,[16] 1991 in North America, 1992 in Europe and Oceania, and 1993 in South America. In Japan, it is called the Super Famicom (SFC).[d] In South Korea, it is called the Super Comboy[e] and was distributed by Hyundai Electronics.[17] The system was released in Brazil on August 30, 1993,[16][18] by Playtronic. Although each version is essentially the same, several forms of regional lockout prevent cartridges for one version from being used in other versions."
    ),
    consoleCreate(
      "PlayStation",
      new Date(1995, 9, 9),
      "Sony Computer Entertainment",
      "The PlayStation[a] (abbreviated as PS, commonly known as the PS1/PS one or its codename PSX) is a home video game console developed and marketed by Sony Computer Entertainment. It was released in Japan on 3 December 1994, in North America on 9 September 1995, in Europe on 29 September 1995, and in Australia on 15 November 1995. As a fifth-generation console, the PlayStation primarily competed with the Nintendo 64 and the Sega Saturn."
    ),
    consoleCreate(
      "PlayStation Vita",
      new Date(2012, 2, 15),
      "Sony Interactive Entertainment",
      "The PlayStation Vita (PS Vita, or Vita) is a handheld game console developed and marketed by Sony Interactive Entertainment. It was first released in Japan on December 17, 2011, and in North America, Europe, and other international territories beginning on February 22, 2012. The console is the successor to the PlayStation Portable, and a part of the PlayStation brand of gaming devices; as part of the eighth generation of video game consoles, it primarily competed with the Nintendo 3DS."
    ),
    consoleCreate(
      "Nintendo Switch",
      new Date(2017, 3, 3),
      "Nintendo",
      "The Nintendo Switch[l] is a hybrid video game console developed by Nintendo and released worldwide in most regions on March 3, 2017. The console itself is a tablet that can either be docked for home console use or used as a portable device, making it a hybrid console. Its wireless Joy-Con controllers, with standard buttons and directional analog sticks for user input, motion sensing, and tactile feedback, can attach to both sides of the console to support handheld-style play. They can also connect to a grip accessory to provide a traditional home console gamepad form, or be used individually in the hand like the Wii Remote and Nunchuk, supporting local multiplayer modes. The Nintendo Switch's software supports online gaming through Internet connectivity, as well as local wireless ad hoc connectivity with other consoles. Nintendo Switch games and software are available on both physical flash-based ROM cartridges and digital distribution via Nintendo eShop; the system has no region lockout.[m] A handheld-focused revision of the system, called the Nintendo Switch Lite, was released on September 20, 2019. A revised higher-end version of the original system, featuring an OLED screen, was released on October 8, 2021."
    ),
  ]);
}

async function createVideoGames() {
  console.log("Adding authors");
  await Promise.all([
    bookInstanceCreate(
      consoles[0],
      "London Gollancz, 2014.",
      false,
      "Available"
    ),
    bookInstanceCreate(consoles[1], " Gollancz, 2011.", false, "Loaned"),
    bookInstanceCreate(consoles[2], " Gollancz, 2015.", false, false),
    bookInstanceCreate(
      consoles[3],
      "New York Tom Doherty Associates, 2016.",
      false,
      "Available"
    ),
    bookInstanceCreate(
      consoles[3],
      "New York Tom Doherty Associates, 2016.",
      false,
      "Available"
    ),
    bookInstanceCreate(
      consoles[3],
      "New York Tom Doherty Associates, 2016.",
      false,
      "Available"
    ),
    bookInstanceCreate(
      consoles[4],
      "New York, NY Tom Doherty Associates, LLC, 2015.",
      false,
      "Available"
    ),
    bookInstanceCreate(
      consoles[4],
      "New York, NY Tom Doherty Associates, LLC, 2015.",
      false,
      "Maintenance"
    ),
    bookInstanceCreate(
      consoles[4],
      "New York, NY Tom Doherty Associates, LLC, 2015.",
      false,
      "Loaned"
    ),
    bookInstanceCreate(consoles[0], "Imprint XXX2", false, false),
    bookInstanceCreate(consoles[1], "Imprint XXX3", false, false),
  ]);
}
