/*
  # Add unique constraint to chat_sessions

  1. Changes
    - Add unique constraint to session_id to prevent duplicate saves
*/

export function up(knex) {
  return knex.schema.alterTable("chat_sessions", (table) => {
    table.unique("session_id");
  });
}

export function down(knex) {
  return knex.schema.alterTable("chat_sessions", (table) => {
    table.dropUnique("session_id");
  });
}
