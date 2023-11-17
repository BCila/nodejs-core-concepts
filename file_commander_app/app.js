const fs = require("fs/promises");

(async () => {
  const CREATE_FILE = "create a file";
  const DELETE_FILE = "delete a file";
  const RENAME_FILE = "rename the file";
  const ADD_TO_FILE = "add to the file";

  /**
   *
   * @param {String} path
   */
  const createFile = async (path) => {
    try {
      const existingFileHandle = await fs.open(path, "r");
      console.log("The file " + path.split("/").at(-1) + " already exist");
      existingFileHandle.close();
    } catch (error) {
      const newFileHandle = await fs.open(path, "w");
      console.log("The file " + path.split("/").at(-1) + " created");
      newFileHandle.close();
    }
  };

  const deleteFile = async (path) => {
    try {
      await fs.unlink(path); // Fulfills with undefined upon success.
      console.log(`${path} is deleted`);
    } catch (error) {
      if (error.code === "ENOENT") {
        console.log(`No such file to delete ${path}`);
      } else {
        console.log(error);
      }
    }
  };

  const renameFile = async (oldPath, newPath) => {
    if (!oldPath || !newPath) {
      console.log(`No such file to rename`);
    }
    try {
      await fs.rename(oldPath, newPath); // Fulfills with undefined upon success.
      console.log("File renamed.");
    } catch (error) {
      if (error.code === "ENOENT") {
        console.log(`No such file to rename ${oldPath}`);
      } else {
        console.log(error);
      }
    }
  };

  let addedContent;
  const addToFile = async (path, content) => {
    if (addedContent === content) return;
    try {
      const fileHandle = await fs.open(path, "a");
      fileHandle.write(content);
      addedContent = content;
      console.log("The content was added succesfully.");
    } catch (error) {
      console.log("An error occured");
    }
  };

  const commandFileHandler = await fs.open("./command.txt", "r");

  commandFileHandler.on("change", async () => {
    // get the size of commant.txt
    const size = (await commandFileHandler.stat()).size;
    // allocate our buffer with the size of the file
    const buff = Buffer.alloc(size);
    // the location at which we want to start filling our buffer
    const offset = 0;
    // how many bytes we want to read
    const length = buff.byteLength;
    // the position that we want to start reading file from
    const position = 0;

    // we always want to read the whole content
    await commandFileHandler.read(buff, offset, length, position);
    const command = buff.toString("utf-8");

    // create a file <path>
    if (command.includes(CREATE_FILE)) {
      const filePath = command.substring(CREATE_FILE.length + 1);
      // const fileName = command.substring(filePath + 1);
      createFile(filePath);
    }

    // delete a file <path>
    if (command.includes(DELETE_FILE)) {
      const filePath = command.substring(DELETE_FILE.length + 1);
      // const fileName = command.substring(filePath + 1);
      deleteFile(filePath);
    }

    // rename the file <path> to <new-path>
    if (command.includes(RENAME_FILE)) {
      const _idx = command.indexOf(" to ");
      const oldFilePath = command.substring(RENAME_FILE.length + 1, _idx);
      const newFilePath = command.substring(_idx + 4);

      renameFile(oldFilePath, newFilePath);
    }

    // add to the file <path> this content: <content>
    if (command.includes(ADD_TO_FILE)) {
      const _idx = command.indexOf(" this content: ");
      const filePath = command.substring(ADD_TO_FILE.length + 1, _idx);
      const content = command.substring(_idx + 15);
      addToFile(filePath, content);
    }
  });

  const watcher = fs.watch("./command.txt");

  // watcher
  for await (const event of watcher) {
    if (event.eventType === "change") {
      commandFileHandler.emit("change");
    }
  }
})();
