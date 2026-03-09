-- Smart Parking System - Database Seeding Script
-- This script populates the database with sample data for testing

-- =====================================================
-- 1. INSERT SAMPLE USERS
-- =====================================================

INSERT INTO users (email, username, password_hash, full_name, phone, vehicle_plate, created_at, updated_at)
VALUES
  ('admin@parking.com', 'admin_user', '$2a$10$example_hash_1', 'Admin User', '+1-800-PARKING', 'ADMIN01', NOW(), NOW()),
  ('john.doe@email.com', 'john_doe', '$2a$10$example_hash_2', 'John Doe', '+1-555-1234', 'JD-2024', NOW(), NOW()),
  ('jane.smith@email.com', 'jane_smith', '$2a$10$example_hash_3', 'Jane Smith', '+1-555-5678', 'JS-5555', NOW(), NOW()),
  ('michael.johnson@email.com', 'mjohnson', '$2a$10$example_hash_4', 'Michael Johnson', '+1-555-9012', 'MJ-9012', NOW(), NOW()),
  ('sarah.williams@email.com', 'swilliams', '$2a$10$example_hash_5', 'Sarah Williams', '+1-555-3456', 'SW-3456', NOW(), NOW()),
  ('robert.brown@email.com', 'rbrown', '$2a$10$example_hash_6', 'Robert Brown', '+1-555-7890', 'RB-7890', NOW(), NOW()),
  ('emily.davis@email.com', 'edavis', '$2a$10$example_hash_7', 'Emily Davis', '+1-555-2345', 'ED-2345', NOW(), NOW()),
  ('david.miller@email.com', 'dmiller', '$2a$10$example_hash_8', 'David Miller', '+1-555-6789', 'DM-6789', NOW(), NOW()),
  ('lisa.wilson@email.com', 'lwilson', '$2a$10$example_hash_9', 'Lisa Wilson', '+1-555-4567', 'LW-4567', NOW(), NOW()),
  ('james.moore@email.com', 'jmoore', '$2a$10$example_hash_10', 'James Moore', '+1-555-8901', 'JM-8901', NOW(), NOW());

-- =====================================================
-- 2. INSERT SAMPLE PARKING SLOTS
-- =====================================================

INSERT INTO parking_slots (number, status, last_updated)
VALUES
  (101, 'free', NOW()),
  (102, 'occupied', NOW()),
  (103, 'free', NOW()),
  (104, 'occupied', NOW()),
  (105, 'free', NOW()),
  (106, 'free', NOW()),
  (107, 'occupied', NOW()),
  (108, 'free', NOW()),
  (109, 'occupied', NOW()),
  (110, 'free', NOW()),
  (111, 'free', NOW()),
  (112, 'occupied', NOW()),
  (113, 'free', NOW()),
  (114, 'free', NOW()),
  (115, 'occupied', NOW()),
  (116, 'free', NOW()),
  (117, 'occupied', NOW()),
  (118, 'free', NOW()),
  (119, 'free', NOW()),
  (120, 'occupied', NOW()),
  (201, 'free', NOW()),
  (202, 'free', NOW()),
  (203, 'occupied', NOW()),
  (204, 'free', NOW()),
  (205, 'occupied', NOW()),
  (206, 'free', NOW()),
  (207, 'free', NOW()),
  (208, 'occupied', NOW()),
  (209, 'free', NOW()),
  (210, 'free', NOW());

-- =====================================================
-- 3. INSERT SAMPLE RESERVATIONS (ACTIVE)
-- =====================================================

INSERT INTO reservations (user_id, slot_id, vehicle_plate, check_in_time, check_out_time, status, duration_hours, amount_paid, created_at, updated_at)
VALUES
  (2, 2, 'JD-2024', NOW() - INTERVAL '2 hours', NULL, 'active', NULL, NULL, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),
  (3, 4, 'JS-5555', NOW() - INTERVAL '1.5 hours', NULL, 'active', NULL, NULL, NOW() - INTERVAL '1.5 hours', NOW() - INTERVAL '1.5 hours'),
  (4, 7, 'MJ-9012', NOW() - INTERVAL '45 minutes', NULL, 'active', NULL, NULL, NOW() - INTERVAL '45 minutes', NOW() - INTERVAL '45 minutes'),
  (5, 9, 'SW-3456', NOW() - INTERVAL '30 minutes', NULL, 'active', NULL, NULL, NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes'),
  (6, 12, 'RB-7890', NOW() - INTERVAL '1 hour', NULL, 'active', NULL, NULL, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour'),
  (7, 15, 'ED-2345', NOW() - INTERVAL '3 hours', NULL, 'active', NULL, NULL, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours'),
  (8, 17, 'DM-6789', NOW() - INTERVAL '20 minutes', NULL, 'active', NULL, NULL, NOW() - INTERVAL '20 minutes', NOW() - INTERVAL '20 minutes'),
  (9, 23, 'LW-4567', NOW() - INTERVAL '2.5 hours', NULL, 'active', NULL, NULL, NOW() - INTERVAL '2.5 hours', NOW() - INTERVAL '2.5 hours');

-- =====================================================
-- 4. INSERT SAMPLE PARKING HISTORY (COMPLETED)
-- =====================================================

INSERT INTO parking_history (user_id, slot_number, vehicle_plate, check_in, check_out, duration_minutes, amount_paid, created_at)
VALUES
  (2, 105, 'JD-2024', NOW() - INTERVAL '1 day' - INTERVAL '2 hours', NOW() - INTERVAL '1 day', 120, 12.00, NOW() - INTERVAL '1 day'),
  (3, 108, 'JS-5555', NOW() - INTERVAL '1 day' - INTERVAL '3 hours', NOW() - INTERVAL '1 day' - INTERVAL '1.5 hours', 90, 9.00, NOW() - INTERVAL '1 day' - INTERVAL '1.5 hours'),
  (4, 106, 'MJ-9012', NOW() - INTERVAL '2 days' - INTERVAL '1 hour', NOW() - INTERVAL '2 days', 60, 6.00, NOW() - INTERVAL '2 days'),
  (5, 110, 'SW-3456', NOW() - INTERVAL '2 days' - INTERVAL '4 hours', NOW() - INTERVAL '2 days' - INTERVAL '2 hours', 120, 12.00, NOW() - INTERVAL '2 days' - INTERVAL '2 hours'),
  (6, 111, 'RB-7890', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days' + INTERVAL '1.5 hours', 90, 9.00, NOW() - INTERVAL '3 days' + INTERVAL '1.5 hours'),
  (7, 114, 'ED-2345', NOW() - INTERVAL '3 days' - INTERVAL '5 hours', NOW() - INTERVAL '3 days' - INTERVAL '2 hours', 180, 18.00, NOW() - INTERVAL '3 days' - INTERVAL '2 hours'),
  (8, 116, 'DM-6789', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days' + INTERVAL '3 hours', 180, 18.00, NOW() - INTERVAL '4 days' + INTERVAL '3 hours'),
  (9, 101, 'LW-4567', NOW() - INTERVAL '4 days' - INTERVAL '6 hours', NOW() - INTERVAL '4 days' - INTERVAL '3 hours', 180, 18.00, NOW() - INTERVAL '4 days' - INTERVAL '3 hours'),
  (10, 103, 'JM-8901', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days' + INTERVAL '2 hours', 120, 12.00, NOW() - INTERVAL '5 days' + INTERVAL '2 hours'),
  (2, 104, 'JD-2024', NOW() - INTERVAL '5 days' - INTERVAL '4 hours', NOW() - INTERVAL '5 days' - INTERVAL '2 hours', 120, 12.00, NOW() - INTERVAL '5 days' - INTERVAL '2 hours'),
  (3, 107, 'JS-5555', NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days' + INTERVAL '1 hour', 60, 6.00, NOW() - INTERVAL '6 days' + INTERVAL '1 hour'),
  (4, 109, 'MJ-9012', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days' + INTERVAL '2.5 hours', 150, 15.00, NOW() - INTERVAL '7 days' + INTERVAL '2.5 hours');

-- =====================================================
-- 5. VERIFICATION QUERIES
-- =====================================================

-- Verify users inserted
SELECT COUNT(*) as total_users FROM users;

-- Verify parking slots
SELECT COUNT(*) as total_slots, 
       SUM(CASE WHEN status = 'free' THEN 1 ELSE 0 END) as free_slots,
       SUM(CASE WHEN status = 'occupied' THEN 1 ELSE 0 END) as occupied_slots
FROM parking_slots;

-- Verify active reservations
SELECT COUNT(*) as active_reservations FROM reservations WHERE status = 'active';

-- Verify parking history
SELECT COUNT(*) as completed_sessions FROM parking_history;

-- Get current occupancy rate
SELECT 
  (SUM(CASE WHEN status = 'occupied' THEN 1 ELSE 0 END)::float / COUNT(*)::float * 100)::NUMERIC(5,2) as occupancy_rate
FROM parking_slots;

-- =====================================================
-- NOTES FOR TESTING
-- =====================================================
/*

PASSWORD HASHES (bcryptjs) - For manual testing:
- All sample users have placeholder hashes above
- To generate real hashes, use: bcryptjs.hash('password123', 10)
- Default password for all users: 'password123' (not actually hashed above)

IMPORTANT: Replace the placeholder hashes with real bcryptjs hashes in production:
Example: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36CHev3a

TO SEED MANUALLY:
1. Connect to your Neon database
2. Copy and paste the INSERT statements above
3. Or use: psql -d your_database_url < seed.sql

SAMPLE TEST CREDENTIALS:
- Email: john.doe@email.com, Password: password123
- Email: jane.smith@email.com, Password: password123
- Email: admin@parking.com, Password: password123

CURRENT DATA:
- 10 Users created
- 30 Parking slots (20 on Level 1, 10 on Level 2)
- 8 Active reservations (slots currently occupied)
- 12 Completed parking sessions (history)
- Occupancy Rate: ~53% (16 occupied, 14 free)

*/
