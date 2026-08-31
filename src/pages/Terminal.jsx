import { useState, useRef, useEffect } from "react";

/* I had more than a little fun with this directory, turning it into a little game.
   I may make this more serious for the final project, definitely more polished.
   Still, I think this is a fun prototype.
*/

// A single file system object representing files in the directory
const fileSystem = {

  type: "directory",
  catalog: {
    about: {
      type: "directory",
      catalog: {
        "bio.txt": {
          type: "file",
          data: ["About me"]
        }
      }
    },

    projects: {
      type: "directory",
      catalog: {
        "campusbuzz.txt": {
          type: "file",
          data: ["Career Fair Web App"]
        },

        "stampthe.dev": {
          type: "file",
          data: ["Personal Website"]
        },
      }
    },

    experience: {
      type: "directory",
      catalog: {
        "Walmart": {
          type: "file",
          data: ["Overnight Stocker"]
        }
      }
    },

    ".README.txt": {
      type: "file",
      data: ["If you've found this, you're either pretty persistent, or you know a thing or two about commands.",
             "Thanks for taking the time to explore. There's a hidden directory nearby. It might be worth your time.",
             "Keep an eye out for uppercase letters..."]
    },

    "contact.txt": {
      type: "file",
      data: ["Contact information"]
    },

    "skills.txt": {
      type: "file",
      data: ["My skillset"]
    },

    gallery: {
      type: "directory",
      catalog: {
        "photo1.jpg": {
          type: "image",
          data: "first photo",
          src: "/private/Screenshot (26).png"
        },

        "photo2.jpg": {
          type: "image",
          data: "second photo",
          src: "/private/Screenshot (33).png"
        },

        "photo3.jpg": {
          type: "image",
          data: "third photo",
          src: "/private/Screenshot (54).png"
        }
      }
    },

    ".secret": {
      type: "directory",
      catalog: {
        "hidden.txt": {
          type: "file",
          data: ["In all lowercase, what is the first thing a software developer ever does?"]
        }
      }
    }
  }
};

function Terminal() {

  // Current path in directory
  const [currentPath, setCurrentPath] = useState([]);
  // Array of previous commands
  const [commandHistory, setCommandHistory] = useState([]);
  // Array of chosen command using up/down arrows
  const [commandIndex, setCommandIndex] = useState(-1);

  // Input in newest command slot, saved when using up/down arrows
  const [newInput, setNewInput] = useState("");
  // The text in the command line
  const [input, setInput] = useState("");
  // The output on the terminal
  const [output, setOutput] = useState([]);
  
  // Previewed images moving across screen
  const [flyingImages, setFlyingImages] = useState([]);
  // Identifies if secret message typing effect is playing
  const [isTyping, setIsTyping] = useState(false);

  // Remembers if the user was clicked into terminal line
  const inputRef = useRef(null);
  useEffect(() => {
    if (!isTyping) {
      inputRef.current.focus();
    }
  }, [isTyping]);

  // Handles submission of a command
  async function handleSubmit(event) {
    event.preventDefault();

    if (input.trim() === "clear") {
      handleClear();
      return;
    }

    const result = await handleCommand();
    if (result == null) {
      setOutput([...output, `> ${input}`]);
    }
    // If result has an effect, handle effect; otherwise add result to terminal
    else if (result.effect) {
      setOutput([...output, `> ${input}`]);
      handleSpecialEffect(result);
    }
    else {
      setOutput([...output, `> ${input}`, ...result]);
    }
    // Reset input and reset back to last command slot
    setInput("");
    setCommandIndex(-1);
  }

  // Handles the specifics of each command
  async function handleCommand() {

    // Split entered text into command and argument (which is everything after first space)
    const fullCommand = input.trim();
    const firstSpace = fullCommand.indexOf(" ");
    let command = "";
    let argument = "";
    if (firstSpace === -1) {
      command = fullCommand;
      argument = undefined;
    }
    else {
      command = fullCommand.slice(0, firstSpace);
      argument = fullCommand.slice(firstSpace + 1).trim();
    }

    // Add non-empty command to command history
    if (command != "") {
      setCommandHistory([fullCommand, ...commandHistory]);
    }

    // Perform different action based on command
    switch (command) {
      case "":
        return null;
      case "help":
        return ["List of valid commands:",
          "cat <file> - print out file contents",
          "cd <dir> - move into next directory",
          "clear - erase terminal output from screen",
          "date - prints out current date",
          "echo <txt> - prints text out to terminal",
          "history - prints out command history",
          "ls [-a] - list files/directories in current directory",
          "pwd - print current file path",
          "tree [-a] - draws map of current directory",  
          "view <file> - previews the specified file",
          "whoami - prints out current user",
          "???",
          "",
          "Unauthorized:",
          "cp <file/dir> <dest> - copies a file or directory to destination",
          "mkdir <dir> - creates new directory",
          "mv <file/dir> <dest> - moves a file or directory to destination",
          "rm <file/dir> - deletes a file or directory",
          "touch <dir> - creates new file",
        ];
      case "ls":
        return handleLs(argument);
      case "cd":
        return handleCd(argument);
      case "pwd":
        return handlePwd(argument);
      case "cat":
        return handleCat(argument);
      case "echo":
        return handleEcho(argument);
      case "whoami":
        return handleWhoami();
      case "date":
        return handleDate();
      case "history":
        return [...handleHistory(), fullCommand];
      case "tree":
        return handleTree(argument);
      case "view":
        return handleView(argument);
      case "???":
        return ["Not all commands are listed here.", "Some can only be found by entering the command itself."];
      case "mkdir":
        return ["mkdir: Command \"mkdir\" is not authorized"];
      case "touch":
        return ["touch: Command \"touch\" is not authorized"];
      case "rm":
        return ["rm: Command \"rm\" is not authorized"];
      case "cp":
        return ["cp: Command \"cp\" is not authorized"];
      case "mv":
        return ["mv: Command \"mv\" is not authorized"];
      default:
        // If no command matched, check backend for secret command
        const message = await fetch("http://localhost:3001/api/terminal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
          },
          body: JSON.stringify({ command: fullCommand })
        });

        // Command may return an effect; if not, just return the text
        const response = await message.json();
        if (response.effect === "none") {
          return response.lines;
        }
        return response;
    }
  }

  // Handles special effects of secret commands
  function handleSpecialEffect(result) {
    switch (result.effect) {

      case "typing":
        typeMessage(result.lines);
        break;

      case "photowave":
        spamImages();
        break;
    }
  }

  // Types a secret message on the terminal slowly, and disables terminal input
  function typeMessage(lines) {
    let lineIndex = 0;
    let characterIndex = 0;
    let interval;

    setIsTyping(true);

    // Create the first blank line that will be typed into
    setOutput(previousOutput => [
      ...previousOutput,
      ""
    ]);

    function typeNextCharacter() {
      const currentLine = lines[lineIndex];

      // Handle intentionally blank lines
      if (currentLine.length === 0) {
        lineIndex++;
        characterIndex = 0;

        if (lineIndex >= lines.length) {
          clearInterval(interval);
          setIsTyping(false);
          return;
        }

        setOutput(previousOutput => [
          ...previousOutput,
          ""
        ]);

        return;
      }

      characterIndex++;

      const typedText = currentLine.slice(0, characterIndex);

      // Replace only the line currently being typed
      setOutput(previousOutput => [
        ...previousOutput.slice(0, -1),
        typedText
      ]);

      // Finished this particular line
      if (characterIndex >= currentLine.length) {
        lineIndex++;
        characterIndex = 0;

        // Finished the entire message
        if (lineIndex >= lines.length) {
          clearInterval(interval);
          setIsTyping(false);
        }

        // Prepare a new output line
        else {
          setOutput(previousOutput => [
            ...previousOutput,
            ""
          ]);
        }
      }
    }

    interval = setInterval(typeNextCharacter, 40);
  }

  // Floods the screen with various pictures from directory
  function spamImages() {
    let pictures = [];
    let imagesSent = 0;
    let interval;

    // Recursively finds images in the directory and adds them to list
    function findImages(directory) {
      for (const name of Object.keys(directory.catalog)) {

        if (name.startsWith(".")) {
          continue;
        }
        
        const item = directory.catalog[name];
        if (item.type === "image") {
          pictures.push(item);
        }
        else if (item.type === "directory") {
          findImages(item);
        }
      }
    }

    // Sends a random found image to the terminal screen
    function sendRandomImage() {
      const randomIndex = Math.floor(Math.random() * pictures.length);
      const image = pictures[randomIndex];

      const flyingImage = {
        id: Date.now() + Math.random(),
        src: image.src,
        top: 20 + Math.random() * 30,
        width: 140 + Math.random() * 140,
        duration: 10 + Math.random() * 5
      };

      setFlyingImages(previousImages => [...previousImages, flyingImage]);
      imagesSent++;
      if (imagesSent >= 30) {
        clearInterval(interval);
      }
    }

    findImages(fileSystem);
    interval = setInterval(sendRandomImage, 500);
  }

  // Handles the ls command
  function handleLs(argument) {

    const currentDirectory = getCurrentDirectory();
    let result = [];
    for (const entry of Object.keys(currentDirectory.catalog).sort()) {
      if (entry.startsWith(".") && argument !== "-a") {
        continue;
      }
      if (currentDirectory.catalog[entry].type === "directory") {
        result.push(`${entry}/`);
      }
      else {
        result.push(entry);
      }
    }
    return result;
  }

  // Handles the cd command
  function handleCd(argument) {

    if (argument == undefined) {
      return ["cd: No argument given"];
    }

    if (argument === "/") {
      setCurrentPath([]);
      return null;
    }

    if (argument === "..") {
      setCurrentPath(currentPath.slice(0, -1));
      return null;
    }

    const currentDirectory = getCurrentDirectory();
    const destination = currentDirectory.catalog[argument];
    if (!destination) {
      return [`cd: ${argument}: No such file or directory`];
    }
    if (destination.type !== "directory") {
      return [`cd: ${argument}: Not a directory`];
    }
    setCurrentPath([...currentPath, argument]);
    return null;
  }

  // Handles the pwd command
  function handlePwd() {

    let result = "/home/";
    for (const entry of currentPath) {
      result += entry + "/";
    }
    return [result];
  }

  // Handles the cat command
  function handleCat(argument) {

    if (argument == undefined) {
      return ["cat: No argument given"];
    }

    const currentDirectory = getCurrentDirectory();
    const destination = currentDirectory.catalog[argument];
    if (!destination) {
      return [`cat: ${argument}: No such file or directory`];
    }
    if (destination.type === "directory") {
      return [`cat: ${argument}: Not a compatible file`];
    }
    // cat produces deterministic gibberish on nontext files
    if (destination.type === "image") {
      let result = [];
      let seed = 0;
      
      for (let i = 0; i < argument.length; i++) {
        seed = seed * 17 + argument.charCodeAt(i);
      }

      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()[]{}<>?/|";
      for (let i = 0; i < 5; i++) {
        let line = "";
        for (let j = 0; j < 100; j++) {
          line += characters[seed % characters.length];
          seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        }
        result.push(line);
      }
      return [...result, "P.S. Using cat on nontext files may have unexpected consequences"]
    }

    return currentDirectory.catalog[argument].data;
  }

  // Handles the echo command
  function handleEcho(argument) {
    if (argument === undefined) {
      return null;
    }
    return [`${argument}`];
  }

  // Handles the whoami command
  function handleWhoami() {
    return ["Jacob S."];
  }

  // Handles the date command
  function handleDate() {
    const now = new Date();
    return [now.toString()];
  }

  // Handles the history command
  function handleHistory() {
    let result = [];
    for (const entry of commandHistory) {
      result.push(entry);
    }
    return result.reverse();
  }

  // Handles the tree command
  function handleTree(argument) {

    let directoryName = "home";
    if (currentPath.length > 0) {
      directoryName = currentPath[currentPath.length - 1];
    }

    let result = [directoryName];
    let showHidden = false;
    if (argument === "-a") {
      showHidden = true;
    }

    result = recurseTree(getCurrentDirectory(), result, "", showHidden);
    return result;
  }

  // Recurseively traverses tree and prints out diagram of the tree
  function recurseTree(directory, result, prefix, showHidden) {
    let entries = Object.keys(directory.catalog);

    if (!showHidden) {
      entries = entries.filter(entry => !entry.startsWith("."));
    }

    for (let i = 0; i < entries.length; i++) {
      const entryName = entries[i];
      const entry = directory.catalog[entries[i]];
      let isLast = false;
      if (i == entries.length - 1) {
        isLast = true;
      }
      let line = prefix;
      if (isLast) {
        line += `└── ${entryName}`;
      }
      else {
        line += `├── ${entryName}`;
      }
      result.push(line);

      if (entry.type === "directory") {
        if (isLast) {
          recurseTree(entry, result, prefix + "    ", showHidden);
        }
        else {
          recurseTree(entry, result, prefix + "│   ", showHidden);
        }
      }
    }

    return result;
  }

  // Handles the clear command
  function handleClear() {
    setOutput([]);
    setInput("");
    setCommandIndex(-1);
    setCommandHistory(["clear", ...commandHistory]);
  }

  // Handles the view command
  function handleView(argument) {

    if (argument == undefined) {
      return ["view: No argument given"];
    }

    const currentDirectory = getCurrentDirectory();
    const image = currentDirectory.catalog[argument];

    if (!image) {
      return [`view: ${argument}: No such file`];
    }
    if (image.type !== "image") {
      return [`view: ${argument}: Not an image file`];
    }

    const flyingImage = {
      id: Date.now() + Math.random(),
      src: image.src,
      top: 20 + Math.random() * 30,
      width: 140 + Math.random() * 140,
      duration: 10 + Math.random() * 5
    };
    setFlyingImages([...flyingImages, flyingImage]);
    return null;
  }

  // Fetches the current directory object
  function getCurrentDirectory() {
    let current = fileSystem;
    for (const directory of currentPath) {
      current = current.catalog[directory];
    }
    return current;
  }

  // Handles specific key presses
  function handleKeyDown(event) {

    // Up Arrow: goes to previous command
    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (commandIndex < commandHistory.length - 1) {
        if (commandIndex === -1) {
          setNewInput(input);
        }
        setCommandIndex(commandIndex + 1);
        setInput(commandHistory[commandIndex + 1]);
      }
    }

    // Down Arrow: goes to subsequent command
    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (commandIndex > -1) {
        setCommandIndex(commandIndex - 1);
        if (commandIndex - 1 === -1) {
          setInput(newInput);
        }
        else {
          setInput(commandHistory[commandIndex - 1]);
        }
      }
    }

    // Autocompletes terminal line input to match files/directories
    if (event.key === "Tab" && input.at(-1) !== " ") {
      event.preventDefault();
      const currentDirectory = getCurrentDirectory();

      const lastSpace = input.lastIndexOf(" ");
      if (lastSpace === -1) {
        return;
      }

      const beforeWord = input.slice(0, lastSpace + 1);
      const currentWord = input.slice(lastSpace + 1);
      const entries = Object.keys(currentDirectory.catalog);
      const matches = entries.filter(entry =>
        entry.startsWith(currentWord)
      );

      if (matches.length === 0) {
        return;
      }
      if (matches.length === 1) {
        setInput(beforeWord + matches[0]);
        return;
      }
      else {
        const testWord = matches[0];
        let matchedLetters;
        for (matchedLetters = 0; matchedLetters < testWord.length; matchedLetters++) {
          for (const match of matches) {
            if (testWord[matchedLetters] !== match[matchedLetters]) {
              setInput(beforeWord + testWord.slice(0, matchedLetters));
              return;
            }
          }
        }
        setInput(beforeWord + testWord);
        return;
      }
    }
  }

  return (
    <div className="terminal-page">

      {flyingImages.map(image => (
        <img
          key={image.id}
          className="flying-image"
          src={image.src}
          style={{
            top: `${image.top}%`,
            width: `${image.width}px`,
            animationDuration: `${image.duration}s`
          }}
          onAnimationEnd={() => {
            setFlyingImages(previous =>
              previous.filter(item => item.id !== image.id)
            );
          }}
        />
      ))}

      <div className="terminal-window">

        <div className="terminal-output">
          {output.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>

        <form
          className="terminal-input"
          onSubmit={handleSubmit}
        >
          <span>&gt;</span>

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            autoFocus
          />
        </form>

      </div>
    </div>
  );
}

export default Terminal