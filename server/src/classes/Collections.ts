import { Collections } from "@prisma/client";
import { ScalarCollection } from "../types/collection";
import { prisma } from "../prisma/db";

/**
 * Creacion de Collecciones de datos para whatsapp bot
 */
class CollectionServices {
  /**
   * Creates a new data collection in the database.
   * @param `data` Los datos de la colección a crear.
   * @returns The collection created.
   */
  static async create(data: ScalarCollection): Promise<Collections> {
    return prisma.collections.create({
      data,
    });
  }

  /**
   * Find in model `Collections` by Id
   * @param `id` of the collection to obtain.
   * @returns The collection found.
   */
  static async findById(id: string): Promise<Collections | null> {
    return prisma.collections.findUnique({ where: { id } });
  }

  /**
   * Find in model `Collections` all collections by sessionId
   * @param `sessionId` of the collection to obtain
   * @returns The collection found.
   */
  static async findBySession(sessionId: string): Promise<Collections[]> {
    return prisma.collections.findMany({ where: { sessionId: sessionId } });
  }

  /**
   * Updates a data collection.
   * @param `collectionId` of the collection to be updated
   * @param `data` New collection data.
   * @returns The updated collection.
   */
  static async updateCollection(
    collectionId: string,
    data: ScalarCollection
  ): Promise<Collections | null> {
    try {
      if (!collectionId) throw new Error("collectionId is required");
      return await prisma.collections.update({
        where: {
          id: collectionId,
        },
        data,
      });
    } catch (error) {
      throw new Error(`Error al actualizar la colección: ${error}`);
    }
  }

  /**
   * Deletes a data collection by its ID.
   * @param `collectionId` El ID de la colección a borrar.
   * @returns The deleted collection.
   */
  static async deleteCollection(
    collectionId: string
  ): Promise<Collections | null> {
    try {
      return await prisma.collections.delete({
        where: {
          id: collectionId,
        },
      });
    } catch (error) {
      throw new Error(`Error al eliminar la colección: ${error}`);
    }
  }
}

export default CollectionServices;
