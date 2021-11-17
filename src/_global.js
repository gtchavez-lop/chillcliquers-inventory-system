import { createClient } from '@supabase/supabase-js';
import { readable, writable, get } from 'svelte/store';

const supabase_url = 'https://fzlclhxdijmleazmkwwy.supabase.co';
const supabase_key = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabase_url, supabase_key);
export const activeTab = writable(1);
export const masterKey = writable('admin1234');
export const active_user = supabase.auth.user();
export const inventory_activeTab = writable(1);
export const inventory_selectedItemToEdit = writable('');
export const inventory_pendingBorrowList = writable([]);

export const inventoryItems = readable(null, (set) => {
	supabase
		.from('inventory')
		.select('*')
		.then(({ data, error }) => set(data));

	const thisSubscription = supabase
		.from('inventory')
		.on('*', (payload) => {
			if (payload.eventType === 'INSERT') {
				set([...get(inventoryItems), payload]);
			}
			if (payload.eventType === 'UPDATE') {
				let index = get(inventoryItems).findIndex((thisitem) => thisitem.id === payload.new.id);
				let oldData = get(inventoryItems);
				oldData[index] = payload.new;
				set(oldData);
			}
		})
		.subscribe();

	return () => {
		supabase.removeSubscription(thisSubscription);
	};
});
export const borrowedItems = readable(null, (set) => {
	supabase
		.from('borrowed_items')
		.select('*')
		.then(({ data, error }) => set(data));

	const thisSubscription = supabase
		.from('borrowed_items')
		.on('*', (payload) => {
			if (payload.eventType === 'INSERT') {
				set([...get(borrowedItems), payload]);
			}
			if (payload.eventType === 'UPDATE') {
				let index = get(borrowedItems).findIndex((thisitem) => thisitem.id === payload.new.id);
				let oldData = get(borrowedItems);
				oldData[index] = payload.new;
				set(oldData);
			}
		})
		.subscribe();

	return () => {
		supabase.removeSubscription(thisSubscription);
	};
});
export const inventory_category_type = readable(null, (set) => {
	supabase
		.from('inventory_category_type')
		.select('*')
		.then(({ data, error }) => set(data));

	const thisSubscription = supabase
		.from('inventory_category_type')
		.on('*', (payload) => {
			if (payload.eventType === 'INSERT') {
				set([...get(inventory_category_type), payload]);
			}
			if (payload.eventType === 'UPDATE') {
				let index = get(inventory_category_type).findIndex((thisitem) => thisitem.id === payload.new.id);
				let oldData = get(inventory_category_type);
				oldData[index] = payload.new;
				console.log(payload.new);
				set(oldData);
			}
		})
		.subscribe();

	return () => {
		supabase.removeSubscription(thisSubscription);
	};
});

export const inventory_itemCategory = [
	{
		key: 'sc',
		category: 'Service Cleaning',
		types: {
			general: ['Service Report', 'Pressure Washer', 'Chamoise Cloth', 'Tarpaulin', 'Wipe-out', 'Soap', 'Clip', 'Thermo Gun', 'Clamp Tester', 'Assorted Hand Tools', 'Others']
		}
	},
	{
		key: 'in',
		category: 'Installation',
		types: {
			general: ['Service Report'],
			powerTools: [
				'Power Drill',
				'Grinder with Cutting Wheel',
				'Welding Machine',
				'Vacuum Pump',
				'Nitrogen Tank',
				'Torch and Mapp-Gas',
				'Flaring Tools',
				'Service Ladder',
				'Silver Rod',
				'Refrigerant Tank',
				'Metal Saw',
				'Cut-off Machine',
				'Others'
			],
			equipment: {
				copperPiping: ['Suction Pipe', 'Liquid Pipe', 'Rubber Insulation (Suction Line)', 'Rubber Insulation (Liquid Line)'],
				brackets: ['Welded Type', 'Slotted Type', 'Slotted Bolt', 'Expansion Bolt', 'Bolt Footings', 'Tox? and Screw', 'Scaffolding', 'Joint Pin'],
				handTools: [
					'Gauge Manefoold Set with Hose and Inverter AC Adaptor',
					'Multi Tester',
					'Clamp Ammeter Tester',
					'Adjustable Wrench - 2 pairs',
					'Allen Key',
					'Phillip Screwdriver',
					'Flat Screwdriver',
					'Fliers',
					'Side Cutter',
					'Tube Cutter',
					'Label Bar',
					'Thermo Gunner',
					'Open Wrench',
					'Claw Hammer',
					'Ball Hammer',
					'L-Square',
					'Meter Tape'
				],
				others: ['Boral?', 'PVC Pipe - Elbow', 'PVC Pipe - Standard', 'PVC Pipe - Clamp', 'Polyethelene Tape', 'PVC Cement', 'Electrical Tape']
			}
		}
	},
	{
		key: 're',
		category: 'Repair',
		types: {
			general: [
				'Service Report',
				'Gauge Manefold',
				'System Cleaner',
				'Vacuum Pump',
				'Torch and Mapp Gas',
				'Silver Rod',
				'1/4 2ft Copper Tube',
				'3/8 2ft Copper Tube',
				'Access Valve',
				'Tube Cutter',
				'Nitrogen Tank',
				'Refrigirant Tank',
				'Others'
			],
			assortedHandTools: ['Phillip Screwdriver', 'Flat Screwdriver', 'Fliers', 'Side Cutter', 'Electrical Tape', 'Clamp Tester', 'Multi-tester', 'Adjustable Wrench', 'Allen Key', 'Inverter AC Adapter', 'Thermo Gun']
		}
	}
];
