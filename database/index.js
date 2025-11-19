/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/namespace */
import { Database } from "@nozbe/watermelondb"
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite"

import User from "./models/User"
import { mySchema } from "./schema"

const adapter = new SQLiteAdapter({
  schema: mySchema,
  unsafeResetDatabase: true,
})

export const database = new Database({
  adapter,
  modelClasses: [User],
  actionsEnabled: true,
})
