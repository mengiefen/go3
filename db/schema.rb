# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_04_13_193746) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "departments", force: :cascade do |t|
    t.jsonb "name", null: false
    t.jsonb "description"
    t.string "abbreviation"
    t.bigint "organization_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_departments_on_name", using: :gin
    t.index ["organization_id"], name: "index_departments_on_organization_id"
  end

  create_table "groups", force: :cascade do |t|
    t.jsonb "name", null: false
    t.jsonb "description"
    t.bigint "organization_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_groups_on_name", using: :gin
    t.index ["organization_id"], name: "index_groups_on_organization_id"
  end

  create_table "groups_members", id: false, force: :cascade do |t|
    t.bigint "group_id", null: false
    t.bigint "member_id", null: false
    t.index ["group_id", "member_id"], name: "index_groups_members_on_group_id_and_member_id"
    t.index ["member_id", "group_id"], name: "index_groups_members_on_member_id_and_group_id"
  end

  create_table "members", force: :cascade do |t|
    t.string "email", null: false
    t.string "name"
    t.bigint "organization_id", null: false
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_members_on_email"
    t.index ["organization_id"], name: "index_members_on_organization_id"
  end

  create_table "organizations", force: :cascade do |t|
    t.jsonb "name", null: false
    t.jsonb "description"
    t.integer "parent_id"
    t.boolean "is_tenant"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_organizations_on_name", using: :gin
    t.index ["parent_id"], name: "index_organizations_on_parent_id"
  end

  create_table "permissions", force: :cascade do |t|
    t.string "permission_code", null: false
    t.string "grantee_type", null: false
    t.bigint "grantee_id", null: false
    t.string "target_type"
    t.bigint "target_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["grantee_id", "grantee_type", "permission_code"], name: "index_permissions_on_grantee_and_code"
    t.index ["grantee_type", "grantee_id"], name: "index_permissions_on_grantee"
    t.index ["permission_code"], name: "index_permissions_on_permission_code"
    t.index ["target_type", "target_id"], name: "index_permissions_on_target"
  end

  create_table "role_assignments", force: :cascade do |t|
    t.bigint "role_id", null: false
    t.string "assignee_type", null: false
    t.bigint "assignee_id", null: false
    t.bigint "organization_id", null: false
    t.datetime "start_date"
    t.datetime "finish_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["assignee_id", "assignee_type"], name: "index_role_assignments_on_assignee_id_and_assignee_type"
    t.index ["assignee_type", "assignee_id"], name: "index_role_assignments_on_assignee"
    t.index ["organization_id"], name: "index_role_assignments_on_organization_id"
    t.index ["role_id", "assignee_id", "assignee_type"], name: "index_role_assignments_on_role_and_assignee", unique: true
    t.index ["role_id"], name: "index_role_assignments_on_role_id"
  end

  create_table "roles", force: :cascade do |t|
    t.jsonb "name", null: false
    t.jsonb "description"
    t.integer "parent_id"
    t.bigint "organization_id", null: false
    t.bigint "department_id"
    t.boolean "active", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["department_id"], name: "index_roles_on_department_id"
    t.index ["name"], name: "index_roles_on_name", using: :gin
    t.index ["organization_id"], name: "index_roles_on_organization_id"
    t.index ["parent_id"], name: "index_roles_on_parent_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.integer "failed_attempts", default: 0, null: false
    t.string "unlock_token"
    t.datetime "locked_at"
    t.string "provider"
    t.string "uid"
    t.string "otp_secret"
    t.boolean "otp_required_for_login", default: false
    t.boolean "otp_verified", default: false
    t.integer "consumed_timestep"
    t.string "otp_backup_codes"
    t.string "phone_number"
    t.boolean "phone_verified", default: false
    t.string "first_name"
    t.string "last_name"
    t.string "job_title"
    t.date "birth_date"
    t.string "avatar"
    t.string "timezone"
    t.string "preferred_locale", default: "en"
    t.jsonb "preferences", default: {}, null: false
    t.boolean "active", default: true
    t.datetime "deactivated_at"
    t.datetime "password_changed_at"
    t.string "security_audit_log"
    t.string "last_activity_type"
    t.datetime "last_activity_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "address"
    t.string "language", default: "en"
    t.index ["active"], name: "index_users_on_active"
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["first_name", "last_name"], name: "index_users_on_first_name_and_last_name"
    t.index ["language"], name: "index_users_on_language"
    t.index ["otp_secret"], name: "index_users_on_otp_secret", unique: true
    t.index ["phone_number"], name: "index_users_on_phone_number"
    t.index ["provider", "uid"], name: "index_users_on_provider_and_uid", unique: true, where: "((provider IS NOT NULL) AND (uid IS NOT NULL))"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["unlock_token"], name: "index_users_on_unlock_token", unique: true
  end

  create_table "versions", force: :cascade do |t|
    t.string "whodunnit"
    t.datetime "created_at"
    t.bigint "item_id", null: false
    t.string "item_type", null: false
    t.string "event", null: false
    t.text "object"
    t.index ["item_type", "item_id"], name: "index_versions_on_item_type_and_item_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "departments", "organizations"
  add_foreign_key "groups", "organizations"
  add_foreign_key "members", "organizations"
  add_foreign_key "role_assignments", "organizations"
  add_foreign_key "role_assignments", "roles"
  add_foreign_key "roles", "departments"
  add_foreign_key "roles", "organizations"
end
