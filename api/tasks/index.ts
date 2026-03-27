import type { VercelRequest, VercelResponse } from "@vercel/node";
import { z } from "zod";
import { prisma } from "../_lib/prisma";
import { mapTask } from "../_lib/task-mapper";

const createTaskSchema = z.object({
  title: z.string().trim().min(1, "O titulo e obrigatorio"),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === "GET") {
      const tasks = await prisma.task.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.status(200).json(tasks.map(mapTask));
    }

    if (req.method === "POST") {
      const parseResult = createTaskSchema.safeParse(req.body);

      if (!parseResult.success) {
        return res.status(400).json({
          message: "Payload invalido",
          issues: parseResult.error.issues,
        });
      }

      const task = await prisma.task.create({
        data: {
          title: parseResult.data.title,
          concluded: false,
        },
      });

      return res.status(201).json(mapTask(task));
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("/api/tasks failed", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
