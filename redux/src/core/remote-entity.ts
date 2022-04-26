export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type SyncingError = "not-found" | "network-error";

// entity being loaded, saved or deleted
type SyncingEntity<T> = {
  status: "loading" | "saving" | "deleting";
  remoteState?: T;
  localChanges?: DeepPartial<T>;
};

// entity matching last known remote state
type InSyncEntity<T> = {
  status: "ready";
  remoteState: T;
  localChanges: DeepPartial<T>;
};

// entity state after loading, saving or deleting failed
type FailedSyncEntity<T> = {
  status: "loading-error" | "saving-error" | "deleting-error";
  error: SyncingError;
  remoteState?: T;
  localChanges?: DeepPartial<T>;
};

export type RemoteEntity<T> = SyncingEntity<T> | FailedSyncEntity<T> | InSyncEntity<T>;
