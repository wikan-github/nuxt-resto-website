import { Migration } from '@mikro-orm/migrations';

export class Migration20261013060208 extends Migration {

  override name = 'Migration20261013060208';

  override up(): void | Promise<void> {
    this.addSql(`create table \`category\` (\`id\` integer not null primary key autoincrement, \`slug\` text not null, \`label\` text not null, \`sort_order\` integer not null default 0);`);

    this.addSql(`create table \`contact_message\` (\`id\` integer not null primary key autoincrement, \`name\` text not null, \`email\` text not null, \`subject\` text not null, \`message\` text not null, \`read\` integer not null default false, \`created_at\` datetime not null);`);

    this.addSql(`create table \`menu_item\` (\`id\` integer not null primary key autoincrement, \`name\` text not null, \`description\` text not null, \`price_takeaway\` real not null, \`price_dinein\` real not null, \`category_id\` integer not null, \`image\` text not null, \`sort_order\` integer not null default 0, constraint \`menu_item_category_id_foreign\` foreign key (\`category_id\`) references \`category\` (\`id\`));`);
    this.addSql(`create index \`menu_item_category_id_index\` on \`menu_item\` (\`category_id\`);`);

    this.addSql(`create table \`order\` (\`id\` integer not null primary key autoincrement, \`customer_name\` text not null, \`customer_phone\` text not null, \`order_type\` text not null, \`table_number\` text null, \`delivery_address\` text null, \`total_amount\` real not null, \`status\` text not null, \`whatsapp_sent\` integer not null default false, \`created_at\` datetime not null);`);

    this.addSql(`create table \`order_item\` (\`id\` integer not null primary key autoincrement, \`order_id\` integer not null, \`item_id\` integer not null, \`item_name\` text not null, \`quantity\` integer not null, \`price\` real not null, \`order_type\` text not null, constraint \`order_item_order_id_foreign\` foreign key (\`order_id\`) references \`order\` (\`id\`));`);
    this.addSql(`create index \`order_item_order_id_index\` on \`order_item\` (\`order_id\`);`);

    this.addSql(`create table \`promotion\` (\`id\` integer not null primary key autoincrement, \`title\` text not null, \`description\` text not null, \`discount\` text not null, \`original_price_takeaway\` real not null, \`original_price_dinein\` real not null, \`promo_price_takeaway\` real not null, \`promo_price_dinein\` real not null, \`image\` text not null, \`category\` text not null, \`valid_until\` text not null, \`is_featured\` integer not null default false);`);

    this.addSql(`create table \`reservation\` (\`id\` integer not null primary key autoincrement, \`customer_name\` text not null, \`customer_phone\` text not null, \`customer_email\` text not null, \`date\` text not null, \`time\` text not null, \`party_size\` integer not null, \`special_requests\` text null, \`status\` text not null, \`created_at\` datetime not null);`);

    this.addSql(`create table \`restaurant\` (\`id\` integer not null primary key autoincrement, \`whatsapp_number\` text not null, \`whatsapp_display\` text not null, \`reservation_message\` text not null, \`map_latitude\` real not null, \`map_longitude\` real not null, \`map_embed_url\` text not null, \`map_link_url\` text not null, \`geofence_radius_meters\` integer not null, \`dine_in_multiplier\` real not null, \`branding_name\` text not null, \`branding_tagline\` text not null, \`branding_logo_path\` text not null, \`address_street\` text not null, \`address_locality\` text not null, \`address_region\` text not null, \`address_postal_code\` text not null, \`address_country\` text not null, \`address_full\` text not null);`);
  }

}
