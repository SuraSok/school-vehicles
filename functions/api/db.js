const tableMap = {
    'school_vehicle_departments': 'departments',
    'school_vehicle_users': 'users',
    'school_vehicle_vehicles': 'vehicles',
    'school_vehicle_drivers': 'drivers',
    'school_vehicle_bookings': 'bookings',
    'school_vehicle_assignments': 'booking_assignments',
    'school_vehicle_post_trip_logs': 'post_trip_logs',
    'school_vehicle_maintenance_logs': 'maintenance_logs'
};

const schemaColumns = {
    departments: ['id', 'name', 'created_at'],
    users: ['id', 'username', 'password', 'email', 'full_name', 'role', 'department_id', 'phone', 'status', 'created_at'],
    vehicles: ['id', 'license_plate', 'brand', 'model', 'type', 'capacity', 'status', 'current_mileage', 'standard_fuel_consumption', 'purchase_date', 'purchase_cost', 'created_at'],
    drivers: ['id', 'user_id', 'full_name', 'license_number', 'phone', 'status', 'created_at'],
    bookings: ['id', 'booking_reference', 'requester_name', 'requester_phone', 'requester_position', 'department_id', 'objective', 'destination', 'passenger_count', 'passenger_details', 'start_date_time', 'end_date_time', 'requested_vehicle_type', 'status', 'approver_id', 'approved_at', 'rejection_reason', 'created_at'],
    booking_assignments: ['id', 'booking_id', 'vehicle_id', 'driver_id', 'assigned_by', 'assigned_at'],
    post_trip_logs: ['id', 'booking_assignment_id', 'start_mileage', 'end_mileage', 'distance_travelled', 'fuel_liters', 'fuel_cost', 'maintenance_cost', 'incident_reports', 'satisfaction_score', 'satisfaction_feedback', 'logger_id', 'logged_at'],
    maintenance_logs: ['id', 'vehicle_id', 'maintenance_date', 'type', 'cost', 'details', 'current_mileage', 'created_at']
};

export async function onRequestGet(context) {
    const { DB } = context.env;
    if (!DB) {
        return new Response('D1 Database binding DB not found', { status: 500 });
    }

    try {
        const queries = [
            DB.prepare('SELECT * FROM departments'),
            DB.prepare('SELECT * FROM users'),
            DB.prepare('SELECT * FROM vehicles'),
            DB.prepare('SELECT * FROM drivers'),
            DB.prepare('SELECT * FROM bookings'),
            DB.prepare('SELECT * FROM booking_assignments'),
            DB.prepare('SELECT * FROM post_trip_logs'),
            DB.prepare('SELECT * FROM maintenance_logs')
        ];
        const batchResult = await DB.batch(queries);
        const responseData = {
            'school_vehicle_departments': batchResult[0].results,
            'school_vehicle_users': batchResult[1].results,
            'school_vehicle_vehicles': batchResult[2].results,
            'school_vehicle_drivers': batchResult[3].results,
            'school_vehicle_bookings': batchResult[4].results,
            'school_vehicle_assignments': batchResult[5].results,
            'school_vehicle_post_trip_logs': batchResult[6].results,
            'school_vehicle_maintenance_logs': batchResult[7].results
        };
        return new Response(JSON.stringify(responseData), {
            headers: { 'Content-Type': 'application/json;charset=utf-8' }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function onRequestPost(context) {
    const { DB } = context.env;
    if (!DB) {
        return new Response('D1 Database binding DB not found', { status: 500 });
    }

    try {
        const { table, items } = await context.request.json();
        const dbTable = tableMap[table];
        if (!dbTable) {
            return new Response('Invalid table name', { status: 400 });
        }

        const validCols = schemaColumns[dbTable];
        const statements = [];

        // 1. Delete rows not present in the received array (handles deletes)
        const itemIds = items.map(item => parseInt(item.id)).filter(id => !isNaN(id));
        if (itemIds.length > 0) {
            statements.push(DB.prepare(`DELETE FROM ${dbTable} WHERE id NOT IN (${itemIds.join(',')})`));
        } else {
            statements.push(DB.prepare(`DELETE FROM ${dbTable}`));
        }

        // 2. Insert or replace all rows (handles inserts & updates)
        for (const item of items) {
            const keys = Object.keys(item).filter(k => validCols.includes(k));
            const cols = keys.map(k => `"${k}"`).join(', ');
            const placeholders = keys.map(() => '?').join(', ');
            const values = keys.map(k => {
                const val = item[k];
                if (val !== null && typeof val === 'object') {
                    return JSON.stringify(val);
                }
                return val;
            });
            statements.push(DB.prepare(`INSERT OR REPLACE INTO ${dbTable} (${cols}) VALUES (${placeholders})`).bind(...values));
        }

        await DB.batch(statements);

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
