import { ContactTable } from "@prisma/client";
import { ScalarContactTable } from "../types/collection";
import { prisma } from "../prisma/db";

/**
 * Servicios para la gestión de ContactTable.
 */
class ContactTableService {
  /**
   * Crea una nueva instancia de ContactTable en la base de datos.
   * @param data Los datos de la instancia de ContactTable a crear.
   * @returns La instancia de ContactTable creada.
   */
  static async create(data: ScalarContactTable): Promise<ContactTable> {
    return prisma.contactTable.create({ data });
  }

  /**
   * Encuentra una instancia de ContactTable por su ID.
   * @param id El ID de la instancia de ContactTable a buscar.
   * @returns La instancia de ContactTable encontrada, o null si no se encontró ninguna.
   */
  static async findById(id: string): Promise<ContactTable | null> {
    return prisma.contactTable.findUnique({ where: { id } });
  }

//   /**
//    * Encuentra todas las instancias de ContactTable por sessionId.
//    * @param sessionId El sessionId de las instancias de ContactTable a buscar.
//    * @returns Las instancias de ContactTable encontradas.
//    */
//   static async findBySessionId(sessionId: string): Promise<ContactTable[]> {
//     return prisma.contactTable.findMany({ where: { sessionId } });
//   }

  /**
   * Actualiza una instancia de ContactTable.
   * @param id El ID de la instancia de ContactTable a actualizar.
   * @param data Los nuevos datos para actualizar la instancia de ContactTable.
   * @returns La instancia de ContactTable actualizada, o null si no se pudo actualizar.
   */
  static async update(
    id: string,
    data: ScalarContactTable
  ): Promise<ContactTable | null> {
    return prisma.contactTable.update({ where: { id }, data });
  }

  /**
   * Elimina una instancia de ContactTable por su ID.
   * @param id El ID de la instancia de ContactTable a eliminar.
   * @returns La instancia de ContactTable eliminada, o null si no se pudo eliminar.
   */
  static async delete(id: string): Promise<ContactTable | null> {
    return prisma.contactTable.delete({ where: { id } });
  }
}

export default ContactTableService;
