export default function handler(req, res) {
    
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const secretCommands = JSON.parse(
    process.env.SECRET_COMMANDS_JSON
  );

  const command = req.body.command;

  if (secretCommands[command]) {
    return res.status(200).json(secretCommands[command]);
  }

  return res.status(200).json({
    effect: "none",
    lines: [`Command not found: ${command}`]
  });
}