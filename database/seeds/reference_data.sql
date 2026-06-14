INSERT INTO organisations (id, name, pilot_geography, timezone, currency_code)
VALUES ('00000000-0000-4000-8000-000000000001', 'Outgrower OS Zambia Pilot', 'Lusaka Province, Zambia', 'Africa/Lusaka', 'ZMW');

INSERT INTO roles (id, key, name)
VALUES
    ('00000000-0000-4000-8000-000000000101', 'admin', 'System Administrator'),
    ('00000000-0000-4000-8000-000000000102', 'production_manager', 'Production Manager'),
    ('00000000-0000-4000-8000-000000000103', 'field_officer', 'Field Officer / Agronomist'),
    ('00000000-0000-4000-8000-000000000104', 'collection_quality', 'Collection / Quality Officer'),
    ('00000000-0000-4000-8000-000000000105', 'finance', 'Finance Officer'),
    ('00000000-0000-4000-8000-000000000106', 'viewer', 'Buyer / Management Viewer');

INSERT INTO reference_values (id, organisation_id, type, code, label, metadata)
VALUES
    ('00000000-0000-4000-8000-000000000201', '00000000-0000-4000-8000-000000000001', 'crop', 'tomato', 'Tomato', '{"variety":"Tengeru 97","grade_a_price_zmw":8.00,"grade_b_price_zmw":5.50}'),
    ('00000000-0000-4000-8000-000000000202', '00000000-0000-4000-8000-000000000001', 'crop', 'onion', 'Onion', '{"variety":"Red Creole","grade_a_price_zmw":10.00,"grade_b_price_zmw":7.00}'),
    ('00000000-0000-4000-8000-000000000203', '00000000-0000-4000-8000-000000000001', 'crop', 'cabbage', 'Cabbage', '{"variety":"Copenhagen Market","grade_a_price_zmw":6.00,"grade_b_price_zmw":4.50}'),
    ('00000000-0000-4000-8000-000000000204', '00000000-0000-4000-8000-000000000001', 'crop', 'chilli', 'Chilli', '{"variety":"ABE Chilli","grade_a_price_zmw":18.00,"grade_b_price_zmw":12.00}'),
    ('00000000-0000-4000-8000-000000000301', '00000000-0000-4000-8000-000000000001', 'grade', 'grade_a', 'Grade A', '{}'),
    ('00000000-0000-4000-8000-000000000302', '00000000-0000-4000-8000-000000000001', 'grade', 'grade_b', 'Grade B', '{}'),
    ('00000000-0000-4000-8000-000000000303', '00000000-0000-4000-8000-000000000001', 'grade', 'reject', 'Reject', '{}'),
    ('00000000-0000-4000-8000-000000000401', '00000000-0000-4000-8000-000000000001', 'collection_point', 'lusaka_central', 'Lusaka Central Collection Point', '{}'),
    ('00000000-0000-4000-8000-000000000501', '00000000-0000-4000-8000-000000000001', 'payment_method', 'cash', 'Cash', '{}'),
    ('00000000-0000-4000-8000-000000000502', '00000000-0000-4000-8000-000000000001', 'payment_method', 'mobile_money', 'Mobile money', '{}'),
    ('00000000-0000-4000-8000-000000000503', '00000000-0000-4000-8000-000000000001', 'payment_method', 'bank_transfer', 'Bank transfer', '{}');

