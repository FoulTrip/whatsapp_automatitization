import {
  destinationEvent,
  EventCollectionNotifications,
  EventCollectionChat,
} from "@prisma/client";
import { prisma } from "../prisma/db";
import { ScalarDestinationEvent } from "../types/collection";

/**
 * Services for managing destinationEvent.
 */
class DestinationEventService {
  /**
   * Creates a new instance of destinationEvent in the database.
   * @param data The data of the destinationEvent instance to create.
   * @returns The created destinationEvent instance.
   */
  static async create(data: ScalarDestinationEvent): Promise<destinationEvent> {
    return prisma.destinationEvent.create({ data });
  }

  /**
   * Finds a destinationEvent instance by its ID.
   * @param id The ID of the destinationEvent instance to find.
   * @returns The found destinationEvent instance, or null if none was found.
   */
  static async findById(id: string): Promise<destinationEvent | null> {
    return prisma.destinationEvent.findUnique({ where: { id } });
  }

  /**
   * Updates a destinationEvent instance.
   * @param id The ID of the destinationEvent instance to update.
   * @param data The new data to update the destinationEvent instance.
   * @returns The updated destinationEvent instance, or null if it couldn't be updated.
   */
  static async update(
    id: string,
    data: ScalarDestinationEvent
  ): Promise<destinationEvent | null> {
    return prisma.destinationEvent.update({ where: { id }, data });
  }

  /**
   * Deletes a destinationEvent instance by its ID.
   * @param id The ID of the destinationEvent instance to delete.
   * @returns The deleted destinationEvent instance, or null if it couldn't be deleted.
   */
  static async delete(id: string): Promise<destinationEvent | null> {
    return prisma.destinationEvent.delete({ where: { id } });
  }

  /**
   * Gets the relationship with EventCollectionNotifications for a specific destinationEvent instance.
   * @param destinationEventId The ID of the destinationEvent instance.
   * @returns The relationship with EventCollectionNotifications for the specified destinationEvent instance.
   */
  static async getEventCollectionNotification(
    destinationEventId: string
  ): Promise<EventCollectionNotifications | null> {
    const destinationEventWithNotification =
      await prisma.destinationEvent.findUnique({
        where: { id: destinationEventId },
        include: { EventCollectionNotification: true },
      });

    return (
      destinationEventWithNotification?.EventCollectionNotification || null
    );
  }

  /**
   * Gets the relationship with EventCollectionChat for a specific destinationEvent instance.
   * @param destinationEventId The ID of the destinationEvent instance.
   * @returns The relationship with EventCollectionChat for the specified destinationEvent instance.
   */
  static async getEventCollectionChat(
    destinationEventId: string
  ): Promise<EventCollectionChat | null> {
    const destinationEventWithChat = await prisma.destinationEvent.findUnique({
      where: { id: destinationEventId },
      include: { EventCollectionChat: true },
    });

    return destinationEventWithChat?.EventCollectionChat || null;
  }
}

export default DestinationEventService;
