import { Migration } from '@mikro-orm/migrations';

export class Migration20261014120000 extends Migration {

  override name = 'Migration20261014120000';

  override up(): void | Promise<void> {
    this.addSql(`create table \`promotion_redemption\` (\`id\` integer not null primary key autoincrement, \`promotion_id\` integer not null, \`placement\` text not null, \`utm_source\` text not null, \`utm_medium\` text not null, \`user_agent\` text null, \`language\` text not null, \`whatsapp_claim_at\` datetime not null, \`checked_in_at\` datetime null, \`ordered_at\` datetime null, \`order_value\` real null, \`notes\` text null, \`created_at\` datetime not null, constraint \`promotion_redemption_promotion_id_foreign\` foreign key (\`promotion_id\`) references \`promotion\` (\`id\`));`);
    this.addSql(`create index \`promotion_redemption_promotion_id_index\` on \`promotion_redemption\` (\`promotion_id\`);`);
    this.addSql(`create index \`promotion_redemption_promotion_id_created_at_index\` on \`promotion_redemption\` (\`promotion_id\`, \`created_at\`);`);
    this.addSql(`create index \`promotion_redemption_utm_source_index\` on \`promotion_redemption\` (\`utm_source\`);`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists \`promotion_redemption\`;`);
  }

}
