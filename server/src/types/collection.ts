export type ScalarCollection = {
  id?: string;
  name: string;
  nameType: string;
  sessionId: string;
  created_at?: Date;
};

export type TableContact = {
  id?: string;
  name: string;
  fields: Record<string, string | number>[];
  sessionId: string;
  created_at?: Date;
};

export type EventCollectionNotifications = {
  id?: string;
  type: typeEventChatNotification.no_definido;
  datetime: Date;
  created_at?: Date;
};

export type EventCollectionChat = {
  id?: string;
  type: typeEventChat.no_definido;
  datetime: Date;
  created_at?: Date;
};

enum typeEventChatNotification {
  reminder = "reminder",
  event = "Event",
  Promotions = "Promotions",
  no_definido = "No definido",
}

enum typeEventChat {
    reminder = "reminder",
    event = "Event",
    Promotions = "Promotions",
    no_definido = "No definido",
  }