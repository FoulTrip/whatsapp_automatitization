export type ScalarCollection = {
  id?: string;
  name: string;
  nameType: string;
  sessionId: string;
  created_at?: Date;
};

export type ScalarContactTable = {
  id?: string;
  name: string;
  fields: Record<string, string | number>[];
  collectionId: string;
  created_at?: Date;
};

export type ScalarEventCollectionNotifications = {
  id?: string;
  collectionId: string;
  name: string;
  type: typeEventChatNotification;
  created_at?: Date;
};

export type ScalarDestinationEvent = {
  id?: string;
  name: string;
  phone: string;
  dateEvent: Date;
  eventIdNotification: undefined;
  eventIdChat: undefined;
};

export type EventCollectionChat = {
  id?: string;
  collectionId: string;
  type: typeEventChat;
  created_at?: Date;
};

type typeEventChatNotification = "subscription" | "reminder";

type typeEventChat = "subscription" | "reminder";