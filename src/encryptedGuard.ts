/**
 * Guard helpers that replace the removed encryption layer.
 *
 * PRD v1.3 §5.1.C (C1) requires that removing the encryption backend keeps
 * three behaviours of the old wrapper class (which was always constructed
 * with an empty password, so it was effectively a pass-through):
 *
 *   ① `walk()` results still carry `keyEnc = keyRaw` / `sizeEnc = sizeRaw`
 *   ② `encryptEntity()` is replaced by an equivalent local function
 *   ③ the "remote is encrypted but the local side has no password" abort
 *      guard must survive the removal of the class
 *
 * This module holds the (small) amount of logic that is still needed for
 * the above. It deliberately contains **no** encryption/decryption code.
 */

import type { Entity } from "./baseTypes";

import cloneDeep from "lodash/cloneDeep";

/**
 * The magic prefixes of the openssl "Salted__" encrypted file names.
 * They are kept verbatim (as plain constants) so that the guard can still
 * recognise a remote that was encrypted by the legacy code path.
 */
export const MAGIC_ENCRYPTED_PREFIX_BASE32 = "KNQWY5DFMRPV";
export const MAGIC_ENCRYPTED_PREFIX_BASE64URL = "U2FsdGVkX";

export type PasswordCheckReasonType =
  | "empty_remote"
  | "unknown_encryption_method"
  | "remote_encrypted_local_no_password"
  | "password_matched"
  | "password_or_method_not_matched_or_remote_not_encrypted"
  | "likely_no_password_both_sides"
  | "encryption_method_not_matched";

/**
 * Same shape as the former `PasswordCheckType` interface of the removed
 * encryption layer.
 * Only `empty_remote`, `remote_encrypted_local_no_password` and
 * `likely_no_password_both_sides` can be produced now (the encryption
 * backend is gone, so there is no password to check anymore).
 */
export interface PasswordCheckType {
  ok: boolean;
  reason?: PasswordCheckReasonType;
}

/**
 * Copy the entity and fill the "encrypted" mirror fields.
 *
 * This is a verbatim copy of the former
 * `copyEntityAndCopyKeyEncSizeEnc()` of the removed encryption layer: with
 * an empty password the old layer did nothing but fill these two fields.
 *
 * `src/sync.ts` still compares `keyEnc` / `sizeEnc` when it decides whether
 * the remote side changed, so the fields must keep being filled.
 */
export function copyEntityAndCopyKeyEncSizeEnc(entity: Entity): Entity {
  const res = cloneDeep(entity);
  res["keyEnc"] = res["keyRaw"];
  res["sizeEnc"] = res["sizeRaw"];
  return res;
}

/**
 * A quick guess, no actual decryption here (same as the old helper of the
 * removed encryption layer).
 */
export function isLikelyOpenSSLEncryptedName(name: string): boolean {
  return (
    name.startsWith(MAGIC_ENCRYPTED_PREFIX_BASE32) ||
    name.startsWith(MAGIC_ENCRYPTED_PREFIX_BASE64URL)
  );
}

/**
 * Tell whether the given remote entity list contains an encrypted file.
 *
 * The name that is inspected is `keyRaw` (the bare file name of the remote
 * object). `key` is only used as a fallback when `keyRaw` is missing, so
 * that a full path can never produce a false positive just because of one
 * of its parent directories.
 */
export function isRemoteEncrypted(entities: Entity[]): boolean {
  for (const entity of entities) {
    const name =
      entity.keyRaw !== undefined && entity.keyRaw !== ""
        ? entity.keyRaw
        : entity.key;
    if (name === undefined || name === "") {
      continue;
    }
    if (isLikelyOpenSSLEncryptedName(name)) {
      return true;
    }
  }
  return false;
}

/**
 * The guard that replaces the removed `isPasswordOk()` check.
 *
 * When the remote side contains openssl ciphertext and the local side has
 * no password (which is always the case now that the encryption backend is
 * removed), the sync must be aborted. Otherwise the ciphertext would be
 * pulled as if it were plaintext and would overwrite the local notes.
 */
export function checkRemoteEncryption(
  entities: Entity[] | undefined | null
): PasswordCheckType {
  if (entities === undefined || entities === null || entities.length === 0) {
    // remote empty
    return {
      ok: true,
      reason: "empty_remote",
    };
  }
  if (isRemoteEncrypted(entities)) {
    return {
      ok: false,
      reason: "remote_encrypted_local_no_password",
    };
  }
  return {
    ok: true,
    reason: "likely_no_password_both_sides",
  };
}
