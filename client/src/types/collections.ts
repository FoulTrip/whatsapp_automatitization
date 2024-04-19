export interface ScalarCollection {
  id?: string;
  name: string;
  nameType: string;
  sessionId: string;
  created_at?: Date;
}

export type ScalarEventCollectionNotifications = {
  id?: string;
  name: string;
  collectionId: string;
  type: typeEventChatNotification;
  created_at?: Date;
};

export type EventCollectionChat = {
  id?: string;
  name: string;
  collectionId: string;
  type: typeEventChat;
  created_at?: Date;
};

type typeEventChatNotification = "subscription" | "reminder";

type typeEventChat = "subscription" | "reminder";
