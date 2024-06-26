import { Session } from "@prisma/client";
import { ScalarSession } from "../types/classes";
import { prisma } from "../prisma/db";

/**
 * Creacion de sessiones de ingreso para whatsapp bot
 */
class SessionService {
  /**
   * 
   * @param data 
   * @returns 
   */
  static async create(data: ScalarSession): Promise<Session> {
    if (!data.session_id) {
      throw new Error("Session_id is required");
    }

    return prisma.session.create({
      data: {
        nameSession: data.session_id,
      },
    });
  }

  /**
   * 
   * @returns 
   */
  static async all(): Promise<Session[]> {
    return prisma.session.findMany();
  }
}

export default SessionService;
