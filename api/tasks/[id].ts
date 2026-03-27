import type { VercelRequest, VercelResponse } from "@vercel/node";
import { z } from "zod";
import { prisma } from "../_lib/prisma";
import { mapTask } from "../_lib/task-mapper";

const paramsSchema = z.object({
  id: z.string().min(1),
});

const updateTaskSchema = z.object({
  title: z.string().trim().min(1).optional(),
  concluded: z.boolean().optional(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const idParse = paramsSchema.safeParse(req.query);

  if (!idParse.success) {
    return res.status(400).json({ message: "Task id invalido" });
  }

  const taskId = Array.isArray(idParse.data.id) ? idParse.data.id[0] : idParse.data.id;

  try {
    if (req.method === "PATCH") {
      const parseResult = updateTaskSchema.safeParse(req.body);

      if (!parseResult.success) {
        return res.status(400).json({
          message: "Payload invalido",
          issues: parseResult.error.issues,
        });
      }

      if (Object.keys(parseResult.data).length === 0) {
        return res.status(400).json({ message: "Nenhum campo para atualizar" });
      }

      const task = await prisma.task.update({
        where: { id: taskId },
        data: parseResult.data,
      });

      return res.status(200).json(mapTask(task));
    }

    if (req.method === "DELETE") {
      await prisma.task.delete({
        where: { id: taskId },
      });

      return res.status(204).end();
    }

    res.setHeader("Allow", "PATCH, DELETE");
    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2025"
    ) {
      return res.status(404).json({ message: "Task nao encontrada" });
    }

    console.error(`/api/tasks/${taskId} failed`, error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
