import { EventCollectionNotifications } from "@prisma/client";
import { ScalarEventCollectionNotifications } from "../types/collection";
import { prisma } from "../prisma/db";

/**
 * Servicios para la gestión de notificaciones de colecciones de eventos.
 */
class EventCollectionNotificationsService {
  /**
   * Crea una nueva notificación de colección de eventos en la base de datos.
   * @param `data` Los datos de la notificación de colección de eventos a crear.
   * @returns La notificación de colección de eventos creada.
   */
  static async create(
    data: ScalarEventCollectionNotifications
  ): Promise<EventCollectionNotifications> {
    return prisma.eventCollectionNotifications.create({
      data,
    });
  }

  /**
   * Encuentra en el modelo `EventCollectionNotifications` por Id
   * @param `id` de la notificación de colección de eventos a obtener.
   * @returns La notificación de colección de eventos encontrada.
   */
  static async findById(
    id: string
  ): Promise<EventCollectionNotifications | null> {
    return prisma.eventCollectionNotifications.findUnique({ where: { id } });
  }

  /**
   * Encuentra en el modelo `EventCollectionNotifications` todas las notificaciones por collectionId
   * @param `collectionId` de la notificación de colección de eventos a obtener.
   * @returns Las notificaciones de colección de eventos encontradas.
   */
  static async findByCollectionId(
    collectionId: string
  ): Promise<EventCollectionNotifications[]> {
    return prisma.eventCollectionNotifications.findMany({
      where: { collectionId },
    });
  }

  /**
   * Actualiza una notificación de colección de eventos.
   * @param `notificationId` de la notificación de colección de eventos a actualizar.
   * @param `data` Nuevos datos de la notificación de colección de eventos.
   * @returns La notificación de colección de eventos actualizada.
   */
  static async updateNotification(
    notificationId: string,
    data: ScalarEventCollectionNotifications
  ): Promise<EventCollectionNotifications | null> {
    try {
      if (!notificationId) throw new Error("notificationId is required");
      return await prisma.eventCollectionNotifications.update({
        where: {
          id: notificationId,
        },
        data,
      });
    } catch (error) {
      throw new Error(
        `Error al actualizar la notificación de colección de eventos: ${error}`
      );
    }
  }

  /**
   * Elimina una notificación de colección de eventos por su ID.
   * @param `notificationId` El ID de la notificación de colección de eventos a borrar.
   * @returns La notificación de colección de eventos eliminada.
   */
  static async deleteNotification(
    notificationId: string
  ): Promise<EventCollectionNotifications | null> {
    try {
      return await prisma.eventCollectionNotifications.delete({
        where: {
          id: notificationId,
        },
      });
    } catch (error) {
      throw new Error(
        `Error al eliminar la notificación de colección de eventos: ${error}`
      );
    }
  }
}

export default EventCollectionNotificationsService;
