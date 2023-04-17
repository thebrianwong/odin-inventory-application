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

async function videoGameCreate(
  name,
  description,
  price,
  copies,
  releaseDate,
  developer,
  console,
  genre
) {
  const videoGameDetails = {
    name,
    description,
    releaseDate,
    developer,
    console,
  };
  if (price !== undefined) {
    videoGameDetails.price = price;
  }
  if (copies !== undefined) {
    videoGameDetails.copies = copies;
  }
  if (genre !== undefined) {
    videoGameDetails.genre = genre;
  }

  const videoGame = new VideoGame(videoGameDetails);
  await videoGame.save();
  videoGames.push(videoGame);
  console.log(`Added video game: ${name}`);
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
    genreCreate(
      "Adventure",
      "An adventure game is a video game genre in which the player assumes the role of a protagonist in an interactive story, driven by exploration and/or puzzle-solving.[1] The genre's focus on story allows it to draw heavily from other narrative-based media, such as literature and film, encompassing a wide variety of genres. Most adventure games (text and graphic) are designed for a single player, since the emphasis on story and character makes multiplayer design difficult.[2] Colossal Cave Adventure is identified[3] as the first such adventure game, first released in 1976, while other notable adventure game series include Zork, King's Quest, Monkey Island, Syberia, and Myst."
    ),
    genreCreate(
      "Visual Novel",
      "A visual novel (Japanese: ビジュアルノベル, Hepburn: bijuaru noberu), often abbreviated as VN, is a form of digital semi-interactive fiction. Visual novels are often associated with and used in the medium of video games, but are not always labeled as such themselves.[1][2] They combine a textual narrative with static or animated illustrations and a varying degree of interactivity. The format is more rarely referred to as novel game, a retranscription of the wasei-eigo term noberu gēmu (ノベルゲーム), which is more often used in Japanese.[3]"
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
  console.log("Adding video games");
  await Promise.all([
    videoGameCreate(
      "God of War",
      "God of War[b] is an action-adventure game developed by Santa Monica Studio and published by Sony Interactive Entertainment. It was released for the PlayStation 4 in April 2018, with a Windows port in January 2022. The game is the eighth installment in the God of War series, the eighth chronologically, and the sequel to 2010's God of War III. Unlike previous games, which were loosely based on Greek mythology, this installment is loosely inspired by Norse mythology, with the majority of it set in ancient Scandinavia in the realm of Midgard. For the first time in the series, there are two protagonists: Kratos, the former Greek God of War who remains the only playable character, and his young son, Atreus. Following the death of Kratos' second wife, Faye (Atreus' mother), the two embark on a journey to fulfill her request that her ashes be spread at the highest peak of the nine realms. Kratos keeps his troubled past a secret from Atreus, who is unaware of his divine nature. Along their journey, they come into conflict with monsters and gods of the Norse world.",
      59.99,
      6000,
      new Date(2018, 4, 20),
      developers[0],
      [consoles[0], consoles[1]],
      [genres[0], genres[3]]
    ),
    videoGameCreate(
      "The Last of Us",
      "The Last of Us is a 2013 action-adventure game developed by Naughty Dog and published by Sony Computer Entertainment. Players control Joel, a smuggler tasked with escorting a teenage girl, Ellie, across a post-apocalyptic United States. The Last of Us is played from a third-person perspective. Players use firearms and improvised weapons and can use stealth to defend against hostile humans and cannibalistic creatures infected by a mutated fungus. In the online multiplayer mode, up to eight players engage in cooperative and competitive gameplay.",
      59.99,
      1023,
      new Date(2013, 6, 14),
      developers[1],
      [consoles[2], consoles[0]],
      [genres[0], genres[3]]
    ),
    videoGameCreate(
      "Uncharted: Drake's Fortune",
      "Uncharted: Drake's Fortune is a 2007 action-adventure game developed by Naughty Dog and published by Sony Computer Entertainment. It is the first game in the Uncharted series and was released in November 2007 for PlayStation 3. The game follows Nathan Drake, the supposed descendant of explorer Sir Francis Drake, as he searches for the lost treasure of El Dorado with journalist Elena Fisher and mentor Victor Sullivan.",
      39.99,
      843,
      new Date(2007, 11, 19),
      developers[1],
      [consoles[2]],
      [genres[0], genres[3]]
    ),
    videoGameCreate(
      "Elden Ring",
      "Elden Ring[a] is a 2022 action role-playing game developed by FromSoftware and published by Bandai Namco Entertainment. Directed by Hidetaka Miyazaki with worldbuilding provided by fantasy writer George R. R. Martin, it was released for PlayStation 4, PlayStation 5, Windows, Xbox One, and Xbox Series X/S on February 25. In the game, players control a customizable player character on a journey to repair the titular Elden Ring and become the new Elden Lord.",
      59.99,
      20,
      new Date(2022, 2, 25),
      developers[2],
      [consoles[0], consoles[1], consoles[3], consoles[4], consoles[5]],
      [genres[0], genres[1]]
    ),
    videoGameCreate(
      "Pokemon HeartGold",
      "Pokémon HeartGold Version[b] and Pokémon SoulSilver Version[c] are 2009 remakes of the 1999 Game Boy Color role-playing video games Pokémon Gold and Silver, also including features from Pokémon Crystal. The games are part of the fourth generation of the Pokémon video game series and were developed by Game Freak, published by The Pokémon Company and Nintendo for the Nintendo DS. In commemoration of the 10th anniversary of Gold and Silver, the games were released in Japan on September 12, 2009, and were later released in other regions during March 2010.",
      39.99,
      2,
      new Date(2010, 3, 14),
      developers[3],
      [consoles[6]],
      [genres[1]]
    ),
    videoGameCreate(
      "Chrono Trigger",
      "Chrono Trigger[b] is a 1995 role-playing video game developed and published by Square. It was originally released for the Super Nintendo Entertainment System as the first game in the Chrono series. The game's development team included three designers that Square dubbed the \"Dream Team\": Hironobu Sakaguchi, creator of Square's Final Fantasy series; Yuji Horii, creator of Enix's Dragon Quest series; and Akira Toriyama, character designer of Dragon Quest and author of the Dragon Ball manga series. In addition, Takashi Tokita co-directed the game and co-wrote the scenario, Kazuhiko Aoki produced the game,[1] Masato Kato wrote most of the story, while composer Yasunori Mitsuda wrote most of the soundtrack before falling ill and deferring the remaining tracks to Final Fantasy series composer Nobuo Uematsu.[2][3] The game's story follows a group of adventurers who travel through time to prevent a global catastrophe.",
      69.99,
      0,
      new Date(1995, 3, 11),
      developers[4],
      [consoles[6], consoles[7], consoles[8]],
      [genres[1]]
    ),
    videoGameCreate(
      "Persona 4 Golden",
      "Persona 4 Golden, released in Japan as Persona 4: The Golden, was announced in August 2011 as a port of Persona 4 for the portable PlayStation Vita. It was originally planned by Atlus to be a PlayStation Portable title, similar to Persona 3 Portable, which would have required removing some of the features of the PlayStation 2 game. However, the Vita provided sufficient resources that allowed Atlus to expand the game.[92] It is an expanded version of the PlayStation 2 title, adding new features and story elements to the game. A new character named Marie was added to the story. Additional Personas, character outfits, and expanded spoken lines and anime cutscenes are included as well as two new Social Links for Marie and Tohru Adachi. The game supports the wireless networking features of the Vita, allowing a player to call in help from other players to help in dungeon battles.[93] Another new feature is a garden that produces items the player can use in the various dungeons.[94] The game was released in Japan on June 14, 2012.[95] Persona 4 Golden was also the first game in the series to be released in traditional Chinese.[96]",
      39.99,
      535,
      developers[5],
      [
        consoles[0],
        consoles[1],
        consoles[4],
        consoles[5],
        consoles[9],
        consoles[10],
      ],
      [genres[1]]
    ),
    videoGameCreate(
      "Phoenix Wright: Ace Attorney",
      "Phoenix Wright: Ace Attorney[a] is a visual novel adventure game developed by Capcom Production Studio 4[3] and published by Capcom. It was released in 2001 for the Game Boy Advance in Japan and has been ported to multiple platforms. The 2005 Nintendo DS version, titled Gyakuten Saiban Yomigaeru Gyakuten in Japan, introduced an English language option, and was the first time the game was released in North America and Europe. It is the first entry in the Ace Attorney series; several sequels and spin-offs were produced, while this game has seen further ports and remasters for computers, game consoles, and mobile devices.",
      19.99,
      5456,
      developers[6],
      [consoles[6]],
      [genres[2], genres[4]]
    ),
    videoGameCreate(
      "Portal",
      "Portal is a 2007 puzzle-platform game developed and published by Valve. It was released in a bundle, The Orange Box, for Windows, Xbox 360 and PlayStation 3, and has been since ported to other systems, including Mac OS X, Linux, Android (via Nvidia Shield), and Nintendo Switch.",
      9.99,
      213,
      developers[7],
      [consoles[1]],
      [genres[2]]
    ),
    videoGameCreate(
      "Nine Hours, Nine Persons, Nine Doors",
      // eslint-disable-next-line quotes
      'Nine Hours, Nine Persons, Nine Doors[b] is a visual novel and adventure video game developed by Chunsoft. It is the first installment in the Zero Escape series, and was released in Japan in December 2009 and in North America in November 2010 for the Nintendo DS. The story follows Junpei, a college student who is abducted along with eight other people and forced to play the "Nonary Game", which puts its participants in a life-or-death situation, to escape from a sinking cruise liner. The gameplay alternates between two types of sections: Escape sections, where the player completes puzzles in escape-the-room scenarios; and Novel sections, where the player reads the game\'s narrative and makes decisions that influence the story toward one of six different endings.',
      19.99,
      999,
      developers[8],
      [consoles[1]],
      [genres[2], genres[4]]
    ),
    videoGameCreate(consoles[1], "Imprint XXX3", false, false),
  ]);
}
