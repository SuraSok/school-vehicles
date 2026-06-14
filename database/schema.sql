-- Database Schema for School Vehicle Booking System
-- Designed for Cloudflare D1 (SQLite)

-- 1. Departments (ฝ่าย/กลุ่มสาระการเรียนรู้)
CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users (ผู้ใช้ระบบ: ผู้อนุมัติ, เจ้าหน้าที่ยานพาหนะ, พนักงานขับรถ, ผู้บริหาร)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT CHECK(role IN ('approver', 'driver', 'admin', 'executive', 'superadmin')) NOT NULL,
    department_id INTEGER,
    phone TEXT,
    status TEXT CHECK(status IN ('active', 'inactive')) DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- 3. Vehicles (ข้อมูลรถโรงเรียน)
CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    license_plate TEXT NOT NULL UNIQUE,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    type TEXT CHECK(type IN ('new_van', 'old_van', 'six_wheeler_truck', 'other')) NOT NULL,
    capacity INTEGER NOT NULL,
    status TEXT CHECK(status IN ('available', 'maintenance', 'inactive')) DEFAULT 'available',
    current_mileage INTEGER DEFAULT 0,
    standard_fuel_consumption REAL DEFAULT 10.0, -- อัตราการกินน้ำมันมาตรฐาน (กิโลเมตร/ลิตร)
    purchase_date DATE,
    purchase_cost REAL DEFAULT 0.0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Drivers (ข้อมูลพนักงานขับรถ)
CREATE TABLE IF NOT EXISTS drivers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER, -- เชื่อมโยงบัญชีผู้ใช้กรณีล็อกอินดูตารางงานได้ (Nullable)
    full_name TEXT NOT NULL,
    license_number TEXT NOT NULL,
    phone TEXT NOT NULL,
    status TEXT CHECK(status IN ('available', 'on_trip', 'leave', 'inactive')) DEFAULT 'available',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 5. Bookings (คำขอใช้รถ - ไม่ต้องล็อกอินเพื่อสร้าง)
CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_reference TEXT NOT NULL UNIQUE, -- รหัสอ้างอิงสำหรับการติดตาม (เช่น SV-YYYYMM-XXXX)
    requester_name TEXT NOT NULL, -- ชื่อครู/บุคลากรผู้ขอ
    requester_phone TEXT NOT NULL, -- เบอร์ติดต่อ
    requester_position TEXT NOT NULL, -- ตำแหน่งของผู้ขอใช้รถ
    department_id INTEGER NOT NULL, -- ฝ่าย/กลุ่มสาระที่สังกัด
    objective TEXT NOT NULL, -- วัตถุประสงค์การเดินทาง
    destination TEXT NOT NULL, -- ปลายทาง
    passenger_count INTEGER NOT NULL, -- จำนวนคน
    passenger_details TEXT, -- รายชื่อคนเดินทาง (เก็บเป็น JSON หรือ TEXT รายบรรทัด)
    start_date_time DATETIME NOT NULL, -- วันเวลาเริ่มเดินทาง
    end_date_time DATETIME NOT NULL, -- วันเวลากลับ
    requested_vehicle_type TEXT CHECK(requested_vehicle_type IN ('new_van', 'old_van', 'six_wheeler_truck', 'other')) NOT NULL,
    status TEXT CHECK(status IN ('pending', 'approved', 'rejected', 'cancelled', 'completed')) DEFAULT 'pending',
    approver_id INTEGER, -- ผู้พิจารณาคำขอ
    approved_at DATETIME,
    rejection_reason TEXT,
    document_url TEXT,
    gps_distance REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (approver_id) REFERENCES users(id)
);

-- 6. Booking Assignments (การจับคู่รถและพนักงานขับกับใบขอใช้รถที่ได้รับการอนุมัติ)
CREATE TABLE IF NOT EXISTS booking_assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL UNIQUE,
    vehicle_id INTEGER NOT NULL,
    driver_id INTEGER NOT NULL,
    assigned_by INTEGER NOT NULL,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    FOREIGN KEY (driver_id) REFERENCES drivers(id),
    FOREIGN KEY (assigned_by) REFERENCES users(id)
);

-- 7. Post-Trip Logs (บันทึกหลังการเดินทางจริง)
CREATE TABLE IF NOT EXISTS post_trip_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_assignment_id INTEGER NOT NULL UNIQUE,
    start_mileage INTEGER NOT NULL,
    end_mileage INTEGER NOT NULL,
    distance_travelled INTEGER NOT NULL, -- end_mileage - start_mileage
    fuel_liters REAL DEFAULT 0.0, -- เติมกี่ลิตร
    fuel_cost REAL DEFAULT 0.0, -- ค่าน้ำมัน
    maintenance_cost REAL DEFAULT 0.0, -- ค่าใช้จ่ายจิปาถะ/ซ่อมด่วนระหว่างทริป
    incident_reports TEXT, -- ปัญหา/อุบัติเหตุ
    satisfaction_score INTEGER CHECK(satisfaction_score BETWEEN 1 AND 5), -- ความพึงพอใจ
    satisfaction_feedback TEXT,
    logger_id INTEGER NOT NULL, -- ใครเป็นคนบันทึก (พนักงานขับรถหรือเจ้าหน้าที่ยานพาหนะ)
    logged_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_assignment_id) REFERENCES booking_assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (logger_id) REFERENCES users(id)
);

-- 8. Maintenance Logs (ประวัติการซ่อมบำรุง/เช็กระยะของรถ)
CREATE TABLE IF NOT EXISTS maintenance_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_id INTEGER NOT NULL,
    maintenance_date DATE NOT NULL,
    type TEXT CHECK(type IN ('routine', 'repair', 'accident')) NOT NULL,
    cost REAL NOT NULL,
    details TEXT,
    current_mileage INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_booking_assignments_booking ON booking_assignments(booking_id);
CREATE INDEX IF NOT EXISTS idx_post_trip_logs_assignment ON post_trip_logs(booking_assignment_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_logs_vehicle ON maintenance_logs(vehicle_id);
