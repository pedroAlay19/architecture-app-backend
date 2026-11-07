export const MESSAGES = {
  AUTH: {
    REGISTERED: 'Usuario registrado correctamente',
    LOGIN: 'Inicio de sesion exitoso',
    INVALID_CREDENTIALS: 'Credenciales incorrectas',
    EMAIL_ALREADY_EXISTS: 'Ya existe un usuario registrado con ese correo',
  },
  PROJECTS: {
    CREATED: 'Proyecto creado correctamente',
    LIST: 'Proyectos obtenidos correctamente',
    NOT_FOUND: 'Proyecto no encontrado',
    FOUND: 'Proyecto encontrado exitosamente'
  },
  FILES: {
    XLSX_REQUIRED: 'Sube un archivo .xlsx válido en el campo "file"',
    INVALID_FILE: 'El archivo no es un .xlsx valido',
  },
  BUDGET: {
    CREATED: 'Presupuesto registrado correctamente',
    DELETED: 'Presupuesto eliminado correctamente',
    PREVIEW: 'Presupuesto interpretado correctamente',
    EMPTY: 'La hoja no tiene filas del presupuesto',
    ALREADY_EXISTS: 'El proyecto ya tiene un presupuesto asignado',
    SHEET_NOT_FOUND: (sheet: string) => `No se encontró la hoja "${sheet}"`,
    TOO_MANY_ITEMS: (max: number) => `El presupuesto tiene más de ${max} rubros`,
    MISSING_COLUMNS: (columns: string[]) => `Faltan columnas en la fila 1: ${columns.join(', ')}`,
  },


  CUSTOMER: {
    CREATED: 'Cliente creado correctamente',
    UPDATED: 'Cliente actualizado correctamente',
    DELETED: 'Cliente eliminado correctamente',
    FOUND: 'Cliente obtenido correctamente',
    LIST: 'Clientes obtenidos correctamente',
    NOT_FOUND: 'Cliente no encontrado',
    ALREADY_EXISTS: 'Ya existe un cliente con ese correo o identificacion',
    ALREADY_INACTIVE: 'El cliente ya se encuentra desactivado',
    IDENTIFICATION_EXISTS: 'Ya existe un cliente con esa identificación',
    MEMBER_ADDED: 'Cliente registrado en el grupo exitosamente'
  },
  CUSTOMER_GROUP: {
    CREATED: 'Grupo de clientes creado correctamente',
    UPDATED: 'Grupo de clientes actualizado correctamente',
    DELETED: 'Grupo de clientes eliminado correctamente',
    FOUND: 'Grupo de clientes obtenido correctamente',
    LIST: 'Grupos de clientes obtenidos correctamente',
    NOT_FOUND: 'Grupo de clientes no encontrado',
    NAME_EXISTS: 'Ya existe un grupo con ese nombre',
    HAS_CUSTOMERS: 'No se puede eliminar un grupo que tiene clientes',
    NOT_AVAILABLE: 'El grupo no existe o esta inactivo',
    ALREADY_MEMBER: 'El cliente ya es miembro de este grupo'
  },
} as const;