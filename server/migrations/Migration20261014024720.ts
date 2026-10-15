import { Migration } from '@mikro-orm/migrations';

export class Migration20261014024720 extends Migration {

  override name = 'Migration20261014024720';

  override up(): void | Promise<void> {
    this.addSql(`create table \`promotion_category\` (\`id\` integer not null primary key autoincrement, \`slug\` text not null, \`label\` text not null, \`sort_order\` integer not null default 0);`);
    this.addSql(`create unique index \`promotion_category_slug_unique\` on \`promotion_category\` (\`slug\`);`);

    this.addSql(`create table \`promotion_code\` (\`id\` integer not null primary key autoincrement, \`promotion_id\` integer not null, \`channel\` text not null, \`code\` text not null, \`max_uses\` integer null, \`used_count\` integer not null default 0, \`is_active\` integer not null default true, constraint \`promotion_code_promotion_id_foreign\` foreign key (\`promotion_id\`) references \`promotion\` (\`id\`));`);
    this.addSql(`create index \`promotion_code_promotion_id_index\` on \`promotion_code\` (\`promotion_id\`);`);
    this.addSql(`create unique index \`promotion_code_code_unique\` on \`promotion_code\` (\`code\`);`);

    this.addSql(`create table \`promotion_translation\` (\`id\` integer not null primary key autoincrement, \`promotion_id\` integer not null, \`locale\` text not null, \`title\` text not null, \`subtitle\` text not null, \`description\` text not null, \`terms\` text not null, constraint \`promotion_translation_promotion_id_foreign\` foreign key (\`promotion_id\`) references \`promotion\` (\`id\`));`);
    this.addSql(`create index \`promotion_translation_promotion_id_index\` on \`promotion_translation\` (\`promotion_id\`);`);
    this.addSql(`create unique index \`promotion_translation_promotion_id_locale_unique\` on \`promotion_translation\` (\`promotion_id\`, \`locale\`);`);

    this.addSql(`create table \`menu_promotion\` (\`id\` integer not null primary key autoincrement, \`title\` text not null, \`description\` text not null, \`discount\` text not null, \`original_price_takeaway\` real not null, \`original_price_dinein\` real not null, \`promo_price_takeaway\` real not null, \`promo_price_dinein\` real not null, \`image\` text not null, \`category\` text not null, \`valid_until\` text not null, \`is_featured\` integer not null default false);`);

    this.addSql(`create table \`promotion_categories\` (\`campaign_promotion_id\` integer not null, \`campaign_promotion_category_id\` integer not null, primary key (\`campaign_promotion_id\`, \`campaign_promotion_category_id\`), constraint \`promotion_categories_campaign_promotion_id_foreign\` foreign key (\`campaign_promotion_id\`) references \`promotion\` (\`id\`) on update cascade on delete cascade, constraint \`promotion_categories_campaign_promotion_category_id_foreign\` foreign key (\`campaign_promotion_category_id\`) references \`promotion_category\` (\`id\`) on update cascade on delete cascade);`);
    this.addSql(`create index \`promotion_categories_campaign_promotion_id_index\` on \`promotion_categories\` (\`campaign_promotion_id\`);`);
    this.addSql(`create index \`promotion_categories_campaign_promotion_category_id_index\` on \`promotion_categories\` (\`campaign_promotion_category_id\`);`);

    // Replace the legacy menu-promos `promotion` table with the campaign schema.
    // The 10 menu rows are NOT migrated — `pnpm seed` refills them into
    // `menu_promotion` afterwards (the Promotion entity now points there).
    this.addSql(`drop table if exists \`promotion\`;`);
    this.addSql(`create table \`promotion\` (\`id\` integer not null primary key autoincrement, \`slug\` text not null, \`kind\` text not null, \`discount_label\` text not null, \`audience\` text not null, \`requires_ticket\` integer not null default false, \`min_spend\` real null, \`max_redemptions\` integer null, \`per_customer_limit\` integer null, \`valid_from\` datetime null, \`valid_until\` datetime null, \`days_of_week\` text not null, \`time_start\` text not null, \`time_end\` text not null, \`original_price_takeaway\` real null, \`original_price_dinein\` real null, \`promo_price_takeaway\` real null, \`promo_price_dinein\` real null, \`hero_image\` text null, \`thumbnail\` text null, \`is_active\` integer not null default true, \`is_featured\` integer not null default false, \`priority\` integer not null default 0, \`created_at\` datetime not null, \`updated_at\` datetime not null);`);
    this.addSql(`create unique index \`promotion_slug_unique\` on \`promotion\` (\`slug\`);`);
  }

  override down(): void | Promise<void> {

    this.addSql(`drop table if exists \`promotion_category\`;`);
    this.addSql(`drop table if exists \`promotion_code\`;`);
    this.addSql(`drop table if exists \`promotion_translation\`;`);
    this.addSql(`drop table if exists \`menu_promotion\`;`);
    this.addSql(`drop table if exists \`promotion_categories\`;`);

    this.addSql(`pragma foreign_keys = off;`);
    this.addSql(`create table \`promotion__temp_alter\` (\`id\` integer not null primary key autoincrement, \`title\` TEXT not null, \`description\` TEXT not null, \`discount\` TEXT not null, \`original_price_takeaway\` REAL not null, \`original_price_dinein\` REAL not null, \`promo_price_takeaway\` REAL not null, \`promo_price_dinein\` REAL not null, \`image\` TEXT not null, \`category\` TEXT not null, \`valid_until\` TEXT not null, \`is_featured\` INTEGER not null default false);`);
    this.addSql(`insert into \`promotion__temp_alter\` select \`id\`, null as \`title\`, null as \`description\`, null as \`discount\`, \`original_price_takeaway\`, \`original_price_dinein\`, \`promo_price_takeaway\`, \`promo_price_dinein\`, null as \`image\`, null as \`category\`, \`valid_until\`, \`is_featured\` from \`promotion\`;`);
    this.addSql(`drop table \`promotion\`;`);
    this.addSql(`alter table \`promotion__temp_alter\` rename to \`promotion\`;`);
    this.addSql(`pragma foreign_keys = on;`);
  }

}
