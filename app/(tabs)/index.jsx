import { useEffect, useState } from "react"
import {
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native"
import { database } from "../../database"
import { useOnlineStatus } from "../../hooks/useOnlineStatus"

export default function HomeScreen() {
  const [data, setData] = useState([])

  const isConnected = useOnlineStatus()

  // function serializeRecords(records) {
  //   return records.map((r) => r._raw)
  // }

  async function createRecord(collectionName, newData) {
    try {
      const collection = database.collections.get(collectionName)

      await database.write(() =>
        collection.create((record) => {
          Object.assign(record, newData)
        })
      )

      console.log("Created user")
      return { success: true }
    } catch (err) {
      console.log("Create Error:", err)
      return { success: false, error: err.message }
    }
  }
  async function fetchUsers() {
    try {
      const collection = database.collections.get("users")
      const records = await collection.query().fetch()
      setData(records)
    } catch (err) {
      console.log("Fetch Error:", err)
    }
  }

  async function updateRecord(collectionName, id, updateData) {
    try {
      const collection = database.collections.get(collectionName)
      const record = await collection.find(id)

      await database.write(async () => {
        await record.update((r) => {
          if (updateData.name !== undefined) r.name = updateData.name
          if (updateData.email !== undefined) r.email = updateData.email
          if (updateData.is_active !== undefined)
            r.is_active = updateData.is_active
        })
      })
      await fetchUsers()
      return { success: true }
    } catch (err) {
      console.log("Update Error:", err)
      return { success: false, error: err.message }
    }
  }

  async function resetDB() {
    try {
      await database.write(async () => {
        await database.unsafeResetDatabase()
      })
      console.log("DATABASE RESET DONE")

      setData([]) // Clear UI list
    } catch (err) {
      console.log("Reset Error:", err)
    }
  }

  useEffect(() => {
    const collection = database.collections.get("users")

    const subscription = collection
      .query()
      .observe()
      .subscribe((records) => {
        // Keep model instances for updates/deletes
        setData(records)
        console.log(
          "Updated list:",
          records.map((r) => r.name)
        ) // just for logging
      })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        {/* Status */}
        <Text style={styles.statusText}>
          Online Status:{" "}
          <Text style={{ fontWeight: "bold" }}>
            {isConnected ? "Online" : "Offline"}
          </Text>
        </Text>

        {/* Add User */}
        <View style={styles.buttonWrapper}>
          <Button
            title="Add User"
            onPress={async () => {
              await createRecord("users", {
                name: "Shubham",
                email: "shubham@test.com",
                is_active: true,
              })
            }}
          />
        </View>

        {/* Reset DB */}
        <View style={styles.resetWrapper}>
          <Button title="Reset Database" color="red" onPress={resetDB} />
        </View>

        {/* User List */}
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          style={{ marginTop: 10 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>Name: {item.name}</Text>
              <Text style={styles.email}>Email: {item.email}</Text>

              <View style={styles.actionRow}>
                <View style={styles.actionButton}>
                  <Button
                    title="Update"
                    onPress={async () => {
                      await updateRecord("users", item.id, {
                        name: "Updated Name",
                      })
                    }}
                  />
                </View>

                <View style={styles.actionButton}>
                  <Button
                    title="Delete"
                    color="red"
                    onPress={async () => {
                      await database.write(async () => {
                        await item.markAsDeleted()
                      })
                    }}
                  />
                </View>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 20,
  },
  inner: {
    flex: 1,
    padding: 20,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonWrapper: {
    marginBottom: 15,
  },
  resetWrapper: {
    marginVertical: 15,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2, // Android shadow
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  email: {
    fontSize: 14,
    color: "#444",
    marginTop: 5,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
})
