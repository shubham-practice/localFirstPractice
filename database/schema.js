import { appSchema, tableSchema } from "@nozbe/watermelondb"

export const mySchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: "users",
      columns: [
        { name: "name", type: "string" },
        { name: "email", type: "string" },
        { name: "is_active", type: "boolean", isIndexed: true },
      ],
    }),
  ],
})
