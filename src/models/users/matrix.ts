/*
Copyright 2020 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/**
 * Construct a Matrix user.
 * @constructor
 * @param {string} userId The user_id of the user.
 * @param {Object=} data Serialized data values
 * @param {boolean} escape [true] Escape the user's localpart. Modify {@link MatrixUser~ESCAPE_DEFAULT}
 *                  to change the default value.
 */
export class MatrixUser {
    private _localpart: string;
    public readonly host: string;
    constructor(public userId: string, public readonly _data: Record<string, unknown>, escape=MatrixUser.ESCAPE_DEFAULT) {
        if (!userId) {
            throw Error("Missing user_id");
        }
        if (_data && typeof _data === "object") {
            throw Error("data arg must be an Object");
        }
        this.userId = userId;
        const split = this.userId.split(":");
        this._localpart = split[0].substring(1);
        this.host = split[1];
        if (escape) {
            this.escapeUserId();
        }
    }

    public get localpart() {
        return this._localpart;
    }

    /**
     * Get the matrix user's ID.
     * @return {string} The user ID
     */
    public getId() {
        return this.userId;
    }

    /**
     * Get the display name for this Matrix user.
     * @return {?string} The display name.
     */
    public getDisplayName() {
        return this._data.displayName as string|undefined;
    }

    /**
     * Set the display name for this Matrix user.
     * @param {string} name The Matrix display name.
     */
    public setDisplayName(name: string) {
        this._data.displayName = name;
    }

    /**
     * Get the data value for the given key.
     * @param {string} key An arbitrary bridge-specific key.
     * @return {*} Stored data for this key. May be undefined.
     */
    public get<T>(key: string) {
        return this._data[key] as T;
    }

    /**
     * Set an arbitrary bridge-specific data value for this room.
     * @param {string} key The key to store the data value under.
     * @param {*} val The data value. This value should be serializable via
     * <code>JSON.stringify(data)</code>.
     */
    public set<T>(key: string, val: T) {
        this._data[key] = val;
    }

    /**
     * Serialize all the data about this user, excluding the user ID.
     * @return {Object} The serialised data
     */
    public serialize() {
        return {
            localpart: this.localpart,
            ...this._data,
        };
    }

    /**
     * Make a userId conform to the matrix spec using QP escaping.
     * Grammar taken from: https://matrix.org/docs/spec/appendices.html#identifier-grammar
     */
    public escapeUserId() {
        // NOTE: Currently Matrix accepts / in the userId, although going forward it will be removed.
        // NOTE: We also allow uppercase for the time being.
        const badChars = new Set(this.localpart.replace(/([A-Z]|[a-z]|[0-9]|-|\.|=|_)+/g, ""));
        let res = this.localpart;
        badChars.forEach((c) => {
            const hex = c.charCodeAt(0).toString(16).toLowerCase();
            res = res.replace(
                new RegExp(`\\${c}`, "g"),
                `=${hex}`
            );
        });
        this._localpart = res;
        this.userId = `@${this.localpart}:${this.host}`;
    }

    /**
     * @static
     * This is a global variable to modify the default escaping behaviour of MatrixUser.
     */
    public static ESCAPE_DEFAULT = true;
}