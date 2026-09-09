export default function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  let secretCommands;
  try {
    secretCommands = JSON.parse(process.env.SECRET_JSON);
  }
  catch (error) {
    console.error("Failed to load secret commands:", error);
    return res.status(500).json({error: "Failed to load secret commands"});
  }

  const command = req.body.command;

  if (secretCommands[command]) {
    return res.status(200).json(secretCommands[command]);
  }

  return res.status(200).json({
    effect: "none",
    lines: [`Command not found: ${command}`]
  });
}