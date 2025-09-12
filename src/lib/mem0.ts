// server-only file
import MemoryClient from "mem0ai";

const MEM0_API_KEY = process.env.MEM0_API_KEY!;
if (!MEM0_API_KEY) {
  throw new Error("Missing MEM0_API_KEY in env");
}

// quickstart shows constructor usage with the key string
const mem0 = new MemoryClient({ apiKey: MEM0_API_KEY });

export default mem0;
