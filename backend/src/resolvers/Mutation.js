const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { APP_SECRET, getUserId } = require("../utils");

async function signup(parent, args, context, info) {
  const { name, email, username } = args;
  const password = await bcrypt.hash(args.password, 10);

  let fileUploadPath = "";

  if (args.profilePicture) {
    // profile picture upload
    // Using local fs
    return args.profilePicture.then(async (file) => {
      const { createReadStream, filename, mimetype } = file;

      const fileStream = createReadStream();
      fileUploadPath = `/profilePictureUploads/${filename}`;
      fileStream.pipe(fs.createWriteStream(`.${fileUploadPath}`));

      const user = await context.prisma.user.create({
        data: {
          name,
          email,
          username,
          password,
          profilePicture: fileUploadPath,
        },
      });

      const token = jwt.sign({ userId: user.id }, APP_SECRET);

      return {
        token,
        user,
      };
    });
  } else {
    const user = await context.prisma.user.create({
      data: { name, email, username, password, profilePicture: fileUploadPath },
    });
    const token = jwt.sign({ userId: user.id }, APP_SECRET);
    return {
      token,
      user,
    };
  }
}

async function login(parent, args, context, info) {
  // Finding user with provided username
  const user = await context.prisma.user.findUnique({
    where: { username: args.username },
  });
  if (!user) {
    throw new Error("No such user found");
  }

  // Encrypting given password and comparing with the existing password to authenticate the user.
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }
  // Generating a signed JWT
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

module.exports = {
  signup,
  login,
};
