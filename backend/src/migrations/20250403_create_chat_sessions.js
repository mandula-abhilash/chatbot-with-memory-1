export function up(knex) {
  return knex.schema.createTable("chat_sessions", (table) => {
    table.uuid("session_id").primary();
    table.jsonb("messages").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTable("chat_sessions");
}
