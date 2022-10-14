interface SyncingError extends Error {
  code: string;
  details: unknown;
}

export type SyncOperation = "load" | "save" | "update" | "delete";

type SyncedStatus = {
  type: "synced";
};

type UnsyncedStatus = {
  type: "unsynced";
};

type SyncingStatus = {
  type: "syncing";
  operation: SyncOperation;
};

type SyncingFailedStatus = {
  type: "syncing-failed";
  operation: SyncOperation;
  error: SyncingError;
};

export type RemoteEntityStatus = SyncedStatus | UnsyncedStatus | SyncingStatus | SyncingFailedStatus;

export type RemoteEntity<E, L, C> = {
  status: RemoteEntityStatus;
  remoteState: E;
  localChanges: C;
  lod: L;
};

export type Constraints<L, F, S> = {
  filters: F;
  sorting: S;
  lod: L;
};

export type Page<E> = {
  status: RemoteEntityStatus;
  items: E[];
};

export type RemoteEntityList<E, C, P> = {
  constraints: C;
  totalEntities: number;
  pagination: P;
  pages: Record<number, Page<E>>;
};

type UnknownRemoteEntity = RemoteEntity<unknown, unknown, unknown>;

function getStatus(entity: UnknownRemoteEntity) {
  return entity.status.type;
}

export function isSynced(entity: UnknownRemoteEntity) {
  return getStatus(entity) === "synced";
}

export function isSyncing(entity: UnknownRemoteEntity) {
  return getStatus(entity) === "syncing";
}

export function isUnsynced(entity: UnknownRemoteEntity) {
  return getStatus(entity) === "unsynced";
}

export function isSycingFailed(entity: UnknownRemoteEntity) {
  return getStatus(entity) === "syncing-failed";
}

type OperationStatus = "done" | "running" | "failed";

type Create = {
  type: "create";
  status: OperationStatus;
};

type Read = {
  type: "read",
  status: OperationStatus;


type NewEntity<C> = {
  localChanges?: C;
  operation?: Create;
};

type NotLoadedEntity<C> = {
  id: string;
  operation?: Read;
};

type LoadedEntity<C, E> = {
  id: string;
  operation?: Create | Read | Delete | Update;
  localChanges?: C;
  remoteState: E;
};

type RemoteEntity<C, E> = NewEntity<C> | NotLoadedEntity<C> | LoadedEntity<C, E>;

/**

   id:
   operation: create | read | update | delete



   - new entity:
   id: null
   status: unsynced
   localChanges: object?
   remoteState: null

   - unloaded:
   id: string
   status: unsynced
   localChanges: null
   remoteState: null

   - loaded/unchanged:
   id: string
   status: synced
   localChanges: null
   remoteState: object

   - loading:
   id: string
   status: syncing
   operation: read
   localChanges: null
   remoteState: null

   - updating:
   id: string
   status: syncing
   operation: update
   localChanges: object
   remoteState: object

   - creating
   id: string
   status: syncing
   operation: create
   localChanges: object
   remoteState: null

   - deleting
   id: string
   status: syncing
   operation: delete
   localChanges: object?
   remoteState: object?

   - failed operation:
   id: string
   status: syncing-failed
   operation: create | read | update | delete
   localChanges: object?
   remoteState: object?
*/
